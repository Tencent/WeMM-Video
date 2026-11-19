# SPDX-License-Identifier: Apache-2.0
"""Model-specific media handling for WeMM; standard model defaults stay local."""

import asyncio
import hashlib
import json
import os
from copy import deepcopy
from pathlib import Path

import numpy as np
from transformers.utils.hub import cached_file

from vllm import envs
from vllm.multimodal.media.audio import AudioMediaIO
from vllm.multimodal.media.base import MediaIO
from vllm.multimodal.media.connector import MEDIA_CONNECTOR_REGISTRY, MediaConnector
from vllm.multimodal.media.image import ImageMediaIO
from vllm.multimodal.media.video import VideoMediaIO
from vllm.multimodal.wemm_video_policy import (
    resolve_video_options, video_environment_defaults,
)

ARCHITECTURE = "WeMMVideoForConditionalGeneration"
MOE_ARCHITECTURE = "WeMMVideoMoeForConditionalGeneration"


def wemm_audio_item(audio, uuid=None, timestamp_interval_sec=None):
    """Carry per-item policy through parsing and include it in user UUIDs."""
    from vllm.multimodal.wemm_timestamps import resolve_timestamp_interval

    interval = resolve_timestamp_interval(timestamp_interval_sec)
    if uuid is not None:
        identity = json.dumps([uuid, interval], separators=(",", ":"))
        uuid = "wemm:audio:" + hashlib.sha256(identity.encode()).hexdigest()
    return {"wemm_audio": audio, "timestamp_interval_sec": interval}, uuid


def is_wemm_model(model_config):
    architectures = getattr(model_config.hf_config, "architectures", None) or []
    return bool({ARCHITECTURE, MOE_ARCHITECTURE}.intersection(architectures))


def wemm_media_kwargs(model_config, overrides=None):
    """Read the model's sampling recipe before decoding its first request."""
    result = deepcopy(overrides or {})
    video = {}
    for filename in ("video_preprocessor_config.json", "processor_config.json"):
        path = cached_file(
            model_config.model,
            filename,
            revision=model_config.revision,
            _raise_exceptions_for_missing_entries=False,
        )
        if path is None:
            continue
        values = json.loads(Path(path).read_text())
        if filename == "processor_config.json":
            video.update(values.get("wemm_defaults", {}))
        else:
            video.update(
                {
                    k: values[k]
                    for k in ("fps", "min_frames", "max_frames")
                    if k in values
                }
            )
            size = values.get("size", {})
            if "longest_edge" in size:
                video["total_pixels"] = size["longest_edge"]
            if "shortest_edge" in size:
                video["min_pixels"] = size["shortest_edge"]
    video = {
        k: v
        for k, v in video.items()
        if k in ("fps", "min_frames", "max_frames", "total_pixels", "min_pixels")
    }
    video.setdefault("fps", 2.0)
    video.setdefault("min_frames", 4)
    video.setdefault("max_frames", 128)
    video = resolve_video_options(
        {**video, **video_environment_defaults()}, result.get("video", {})
    )
    video["video_backend"] = "wemm"
    result["video"] = video
    return result


def wemm_video_uuid(uuid, video, kwargs):
    """Include paired audio, video content, and decoding options in identity."""
    metadata = video[1] if isinstance(video, tuple) and len(video) == 2 else {}
    if uuid is None and not metadata.get("audio_bytes_sha256"):
        return None  # Let the standard multimodal hasher hash decoded data.
    identity = {
        "uuid": uuid,
        "video": metadata.get("video_bytes_sha256"),
        "audio": metadata.get("audio_bytes_sha256"),
        "decode": metadata.get("wemm_decode_kwargs", kwargs),
    }
    return (
        "wemm:"
        + hashlib.sha256(json.dumps(identity, sort_keys=True).encode()).hexdigest()
    )


class RawBytesMediaIO(MediaIO[bytes]):
    def load_bytes(self, data):
        return data

    def load_base64(self, media_type, data):
        import base64

        return base64.b64decode(data, validate=True)

    def load_file(self, path):
        return path.read_bytes()

    def encode_base64(self, media, **kwargs):
        import base64

        return base64.b64encode(media).decode()


class WeMMAudioMediaIO(AudioMediaIO):
    def load_bytes(self, data):
        from vllm.multimodal.wemm_audio import _decode_audio_to_16k_mono

        decoded = _decode_audio_to_16k_mono(data)
        if not decoded or not decoded[0].size:
            raise ValueError("Empty WeMM audio input")
        return decoded[0].astype(np.float32), 16000.0

    def load_file(self, path):
        return self.load_bytes(path.read_bytes())


@MEDIA_CONNECTOR_REGISTRY.register("wemm")
class WeMMMediaConnector(MediaConnector):
    def __init__(self, *args, **kwargs):
        # Import registers the dedicated loader without replacing standard symbols.
        from vllm.multimodal import wemm_video  # noqa: F401

        super().__init__(*args, **kwargs)

    def _video_options(self, overrides):
        defaults = dict(self.media_io_kwargs.get("video", {}))
        options = resolve_video_options(defaults, overrides)
        # VideoMediaIO has its own num_frames default. Carry an explicit count
        # through the loader's nframes route so that default cannot replace it.
        if options.get("num_frames") is not None:
            options["nframes"] = options.pop("num_frames")
        # ZIP frames are already sampled. Their deployment limit must not be
        # raised by a request, even when raw-video defaults are overridable.
        limits = [int(defaults.get("max_frames") or 128)]
        if defaults.get("max_allowed_frames") is not None:
            limits.append(int(defaults["max_allowed_frames"]))
        options["wemm_zip_max_frames"] = min(limits)
        options["video_backend"] = "wemm"
        return options

    def _decode_video(self, data, audio_data, options, *, audio_from_video=False):
        decoder_options = dict(options)
        count = decoder_options.pop("num_frames", None)
        count = decoder_options.pop("nframes", count)
        video_io = VideoMediaIO(
            ImageMediaIO(**self.media_io_kwargs.get("image", {})),
            num_frames=count, **decoder_options
        )
        frames, metadata = video_io.load_bytes(data)
        metadata["video_bytes_sha256"] = hashlib.sha256(data).hexdigest()
        metadata["wemm_decode_kwargs"] = options
        if audio_from_video:
            # use_audio requests an optional track from this video container.
            # A valid video without an audio track remains video-only; decode
            # errors in an existing track or an explicit paired file must fail.
            import subprocess

            probe = subprocess.run(
                ["ffprobe", "-v", "error", "-select_streams", "a",
                 "-show_entries", "stream=index", "-of", "json", "pipe:0"],
                input=data, capture_output=True, timeout=60, check=True,
            )
            if not json.loads(probe.stdout)["streams"]:
                audio_data = None
                metadata["audio_fallback"] = "no audio stream; video only"
        if audio_data is not None:
            metadata["audio_bytes"] = audio_data
            metadata["audio_bytes_sha256"] = hashlib.sha256(audio_data).hexdigest()
        return frames, metadata

    def fetch_audio(self, audio_url):
        return self.load_from_url(
            audio_url, WeMMAudioMediaIO(), fetch_timeout=envs.VLLM_AUDIO_FETCH_TIMEOUT
        )

    async def fetch_audio_async(self, audio_url):
        return await self.load_from_url_async(
            audio_url, WeMMAudioMediaIO(), fetch_timeout=envs.VLLM_AUDIO_FETCH_TIMEOUT
        )

    def fetch_wemm_video(self, video_url, *, audio_url=None, **kwargs):
        data = self.load_from_url(
            video_url, RawBytesMediaIO(), fetch_timeout=envs.VLLM_VIDEO_FETCH_TIMEOUT
        )
        audio_data = (
            self.load_from_url(
                audio_url,
                RawBytesMediaIO(),
                fetch_timeout=envs.VLLM_AUDIO_FETCH_TIMEOUT,
            )
            if audio_url
            else None
        )
        return self._decode_video(
            data, audio_data, self._video_options(kwargs),
            audio_from_video=bool(audio_url and audio_url == video_url),
        )

    def fetch_video(self, video_url, **kwargs):
        return self.fetch_wemm_video(video_url, **kwargs)

    async def fetch_wemm_video_async(self, video_url, *, audio_url=None, **kwargs):
        raw = RawBytesMediaIO()
        data = self.load_from_url_async(
            video_url, raw, fetch_timeout=envs.VLLM_VIDEO_FETCH_TIMEOUT
        )
        if audio_url:
            data, audio_data = await asyncio.gather(
                data,
                self.load_from_url_async(
                    audio_url, raw, fetch_timeout=envs.VLLM_AUDIO_FETCH_TIMEOUT
                ),
            )
        else:
            data, audio_data = await data, None
        return await asyncio.to_thread(
            self._decode_video, data, audio_data, self._video_options(kwargs),
            audio_from_video=bool(audio_url and audio_url == video_url),
        )

    async def fetch_video_async(self, video_url, **kwargs):
        return await self.fetch_wemm_video_async(video_url, **kwargs)

    async def fetch_wemm_video_with_audio_url_async(
        self, video_url, audio_url, **kwargs
    ):
        return await self.fetch_wemm_video_async(
            video_url, audio_url=audio_url, **kwargs
        )
