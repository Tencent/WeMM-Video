# Serving and runtime profiles

The commands use the repository IDs in the [Model Zoo](../README.md#model-zoo).
The serving examples allow up to four images, two videos, and two audio items
per request within the configured context length.
Set `HF_HOME` to change the Hub cache location. Use an authorized `HF_TOKEN` for
restricted repositories and pin `--revision` to reproduce a checkpoint.

## Runtime profiles

| Weights | Runtime recipe |
| --- | --- |
| BF16 | [Transformers](../README.md#quick-start), patched vLLM 0.18.0 or 0.31.0, or patched SGLang 0.5.16 or 0.5.19 |
| FP8 Block128 | Patched vLLM 0.18.0 on an FP8-capable GPU |
| AWQ W4A16 | Patched vLLM 0.18.0 with the checkpoint's compressed-tensors configuration |
| GGUF Q4_K_M | [WeMM native runtime](../native/README.md) on CPU or CUDA |
| NVFP4 W4A16 | Patched vLLM 0.31.0 with ModelOpt Mixed Precision and Marlin (SM120 reference configuration) |

## Docker environments

Build on Linux x86_64 with Docker BuildKit and the Compose plugin. GPU access
at runtime requires a driver compatible with CUDA 12.9 and the
[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html).

```bash
docker compose build
```

Append a service name to build one profile.

| Service | Image | Dependency lock |
| --- | --- | --- |
| `vllm-018` | `wemm-video:vllm-0.18.0-cu129` | [vLLM 0.18.0](../patch/vllm/0.18.0/requirements.lock.txt) |
| `vllm-031` | `wemm-video:vllm-0.31.0-cu129` | [vLLM 0.31.0](../patch/vllm/0.31.0/requirements.lock.txt) |
| `sglang-0516` | `wemm-video:sglang-0.5.16-cu129` | [SGLang 0.5.16](../patch/sglang/0.5.16/requirements.lock.txt) |
| `sglang-0519` | `wemm-video:sglang-0.5.19-cu129` | [SGLang 0.5.19](../patch/sglang/0.5.19/requirements.lock.txt) |

The newer vLLM and SGLang profiles share a BuildKit cache for FlashAttention 2
and causal-conv1d wheels. The first source build compiles these extensions
for PyTorch 2.13. To reuse the original wheels, pass
`--build-context hf-wheel-cache=/path/to/wheels` to `docker build`. The wheels
must match the [recorded checksums](../patch/hf-wheels.sha256).

Open an environment shell with `docker compose run --rm vllm-018`. See the
[Docker examples](../README.md#docker) for launching a vLLM or SGLang server and
sending a request from the host.

## Install without Docker

Choose a profile and follow the [manual install and patch workflow](../patch/README.md#manual-install-and-patch)
or use the [combined installer](../patch/README.md#install). Run the serving
command in the environment where you applied the patch.

## Serve with vLLM

This recipe uses patched vLLM 0.18.0.

```bash
MODEL=tencent/WeMM-Video-2B
vllm serve "$MODEL" --served-model-name "$MODEL" --trust-remote-code --dtype bfloat16 \
  --host 127.0.0.1 --port 8000 --max-model-len 65536 \
  --no-enable-prefix-caching --mamba-ssm-cache-dtype float32 \
  --limit-mm-per-prompt '{"image":4,"video":2,"audio":2}'
```

Pass an FP8 or AWQ Hub ID to use its checkpoint quantization configuration.
For 35B-A3B BF16, plan memory for the full expert weights and set
`--tensor-parallel-size` as needed.

### NVFP4

Use a separate patched vLLM 0.31.0 environment for ModelOpt Mixed Precision
and Marlin.

```bash
MODEL=tencent/WeMM-Video-2B-NVFP4
vllm serve "$MODEL" --served-model-name "$MODEL" --trust-remote-code --dtype bfloat16 \
  --host 127.0.0.1 --port 8000 --max-model-len 65536 \
  --max-num-seqs 1 --max-num-batched-tokens 8192 \
  --no-enable-prefix-caching --mamba-cache-mode none --mamba-ssm-cache-dtype float32 \
  --mm-processor-cache-gb 0 --skip-mm-profiling \
  --limit-mm-per-prompt '{"image":4,"video":2,"audio":2}' \
  --attention-config '{"backend":"FLASH_ATTN","flash_attn_version":2}' \
  --mm-encoder-attn-backend FLASH_ATTN \
  --quantization modelopt_mixed --linear-backend marlin --moe-backend marlin
```

## Serve with SGLang

Use a patched SGLang 0.5.16 or 0.5.19 environment.

```bash
MODEL=tencent/WeMM-Video-2B
python -m sglang.launch_server --model-path "$MODEL" --served-model-name "$MODEL" --trust-remote-code \
  --host 127.0.0.1 --port 8000 --dtype bfloat16 --context-length 65536 \
  --attention-backend triton --linear-attn-backend triton \
  --limit-mm-data-per-request '{"image":4,"video":2,"audio":2}'
```

Set `--tp-size` for multi-GPU serving.

## Video sampling and memory

The commands above inherit the checkpoint's `processor_config.json`
`wemm_defaults`, without imposing a low-resource sampling override:

| Option | Default |
| --- | --- |
| `fps` | `2.0` |
| `min_frames` | `4` |
| `max_frames` | `128` |
| `total_pixels` | `25165824` |
| `min_pixels` | `4096` |

These values match the [2B processor configuration](https://huggingface.co/tencent/WeMM-Video-2B/blob/main/processor_config.json)
and the [35B-A3B FP8 processor configuration](https://huggingface.co/tencent/WeMM-Video-35BA3B-FP8/blob/7a1d00fc8c77cbdbf54231303341f2baa587091d/processor_config.json).
The frame limit is a ceiling, not a fixed frame count. Sampling defaults can
be overridden per clip using `video_url.fps`, `video_url.max_frames`, and
`video_url.total_pixels`; the example client leaves them unset unless you pass
`--fps`, `--max-frames`, or `--total-pixels`.

If GPU memory or compute is limited, lower the pixel budget, frame limit, and
FPS together. For a **low-resource quick check**, add the following option to
a vLLM serve command:

```bash
--media-io-kwargs '{"video":{"fps":1,"min_frames":4,"max_frames":16,"total_pixels":262144,"min_pixels":4096}}'
```

For either backend, request the same low-resource settings for one clip:

```bash
python examples/chat.py video-audio --model "$MODEL" \
  --fps 1 --max-frames 16 --total-pixels 262144
```

Explicit request values override server
sampling defaults, so avoid sending them when you intend to inherit the server
configuration. Smaller settings may miss brief actions and cuts. More frames
share the same total pixel budget; the processor's per-frame budget calculation
also includes a temporal factor of 2.

The serving examples use a 65536-token context instead of 8192 to accommodate
the larger video budget. The NVFP4 `--max-num-batched-tokens 8192` controls the
scheduler's processing budget per iteration, separately from the context limit.
Long audio, multiple clips, and generated tokens also consume context. If a
request exceeds the limit, increase vLLM's `--max-model-len` or SGLang's
`--context-length` within the checkpoint's supported length, or reduce the input
budget. If memory is limited, lower the context limit together with the media
budget. The GGUF launcher uses a 73728-token context, matching the native CLI;
adjust it with `--context`.

## Send a video request

The Transformers processor uses the `video_audio` content type for a video
with its soundtrack. The OpenAI-compatible API uses `video_url` for both
patched vLLM and SGLang. Set `video_url.use_audio` to `true` to process the
video frames with the original soundtrack or `false` for frames only. Omit
sampling fields to inherit the server configuration. To override one clip, set
`fps`, `max_frames`, and `total_pixels` inside `video_url`.

Replace the URL below with an MP4 the server can reach. Set `model` to the
Hub ID or alias exposed by the running server.

```bash
curl --fail-with-body --silent --show-error http://127.0.0.1:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  --data-binary @- <<'JSON'
{
  "model": "tencent/WeMM-Video-2B",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "video_url",
          "video_url": {
            "url": "https://example.com/clip.mp4",
            "use_audio": true
          }
        },
        {"type": "text", "text": "Describe the scene and summarize what you hear."}
      ]
    }
  ],
  "max_tokens": 160,
  "chat_template_kwargs": {"enable_thinking": false}
}
JSON
```

Set `chat_template_kwargs.enable_thinking` to `true` to request Thinking mode.
The [video-audio example](../examples/README.md#serving-api) sends the bundled
local MP4 inline as a data URL.

## Validation

| Scope | Result |
| --- | --- |
| vLLM 0.18.0 and 0.31.0, SGLang 0.5.16 and 0.5.19 Docker environments | Rebuilt and started offline with the corresponding dependency locks. WeMM patch hashes, TorchCodec imports, and FFmpeg were verified. |
| vLLM 0.31.0 and SGLang 0.5.19 HF extensions | The rebuilt images used the original FlashAttention 2 and causal-conv1d wheels. The installed CUDA extension hashes matched the reference wheels. |
| Fresh HF extension source build | The locked compiler dependencies installed and the public sources reached wheel compilation. A completed source build is pending. |
| OpenAI-compatible examples | The five request variants passed loopback HTTP checks. FFmpeg decoded all bundled media. |
| Native GGUF | CPU runtime built successfully and completed a text-generation smoke test with the 2B Q4_K_M checkpoint. |

GPU generation after downloading a checkpoint from the Hub is pending.
