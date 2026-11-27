"""Describe a video and its original audio track with WeMM-Video in Transformers."""

import argparse
from pathlib import Path


DEFAULT_MODEL = "tencent/WeMM-Video-2B"
DEFAULT_VIDEO = Path(__file__).resolve().parent / "media" / "apollo-11-first-steps.mp4"
DEFAULT_PROMPT = "Describe what happens on screen and summarize the speech you hear."


def prepare_inputs(processor, video, prompt, *, fps=None, max_frames=None, total_pixels=None):
    # Omitted options inherit the checkpoint's processor_config.json.
    sampling = {
        key: value
        for key, value in {
            "fps": fps, "max_frames": max_frames, "total_pixels": total_pixels,
        }.items()
        if value is not None
    }
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "video_audio",
                    "video": str(video),
                    **sampling,
                },
                {"type": "text", "text": prompt},
            ],
        }
    ]
    return processor.apply_chat_template(
        messages,
        tokenize=True,
        return_dict=True,
        return_tensors="pt",
        add_generation_prompt=True,
        enable_thinking=False,
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", default=DEFAULT_MODEL, help="WeMM-Video BF16 Hub ID")
    parser.add_argument("--revision", default="main", help="Model and processor Hub revision")
    parser.add_argument("--video", type=Path, default=DEFAULT_VIDEO, help="Local video with audio")
    parser.add_argument("--prompt", default=DEFAULT_PROMPT)
    parser.add_argument("--fps", type=float, help="Override the processor's sampling FPS")
    parser.add_argument("--max-frames", type=int, help="Override the processor's frame limit")
    parser.add_argument("--total-pixels", type=int, help="Override the processor's video pixel budget")
    args = parser.parse_args()
    if not args.video.is_file():
        parser.error(f"Video file does not exist: {args.video}")

    import torch
    from transformers import AutoModelForImageTextToText, AutoProcessor

    processor = AutoProcessor.from_pretrained(
        args.model, revision=args.revision, trust_remote_code=True
    )
    model = AutoModelForImageTextToText.from_pretrained(
        args.model,
        revision=args.revision,
        trust_remote_code=True,
        dtype=torch.bfloat16,
        device_map="auto",
    )
    inputs = prepare_inputs(
        processor, args.video, args.prompt,
        fps=args.fps, max_frames=args.max_frames, total_pixels=args.total_pixels,
    ).to(model.device)
    with torch.inference_mode():
        output = model.generate(**inputs, max_new_tokens=128, do_sample=False)
    completion = output[0, inputs.input_ids.shape[1]:]
    print(processor.tokenizer.decode(completion, skip_special_tokens=True))


if __name__ == "__main__":
    main()
