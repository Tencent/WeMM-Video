"""Send a bundled WeMM-Video example to a vLLM or SGLang server."""

import argparse
import base64
import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


MEDIA_DIR = Path(__file__).resolve().parent / "media"
PROMPTS = {
    "text": "A 20-minute meeting starts at 09:45. When does it end? Reply in HH:MM.",
    "image": "What is the main object in this photograph? Describe its visible features.",
    "audio": "Transcribe the English speech in this recording.",
    "video": "Describe the visible scene and the main actions in this clip.",
    "video-audio": "Describe what happens on screen and summarize the speech you hear.",
}
MEDIA = {
    "image": ("apollo-11-earth.jpg", "image/jpeg"),
    "audio": ("apollo-11-small-step.wav", "audio/wav"),
    "video": ("apollo-11-first-steps.mp4", "video/mp4"),
}


def message_for(case):
    prompt = PROMPTS[case]
    if case == "text":
        return {"role": "user", "content": prompt}

    modality = "video" if case == "video-audio" else case
    filename, mime_type = MEDIA[modality]
    data = base64.b64encode((MEDIA_DIR / filename).read_bytes()).decode("ascii")
    source = {"url": f"data:{mime_type};base64,{data}"}
    if modality == "video":
        source.update(use_audio=case == "video-audio", fps=1, max_frames=16)
    part_type = f"{modality}_url"
    return {
        "role": "user",
        "content": [
            {"type": part_type, part_type: source},
            {"type": "text", "text": prompt},
        ],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case", choices=PROMPTS)
    parser.add_argument("--model", required=True, help="The model ID or alias exposed by the server")
    parser.add_argument("--base-url", default="http://127.0.0.1:8000/v1")
    parser.add_argument("--timeout", type=float, default=240, help="Request timeout in seconds")
    args = parser.parse_args()
    payload = {
        "model": args.model,
        "messages": [message_for(args.case)],
        "temperature": 0,
        "max_tokens": 160,
        "chat_template_kwargs": {"enable_thinking": False},
    }
    headers = {"Content-Type": "application/json"}
    if api_key := os.environ.get("OPENAI_API_KEY"):
        headers["Authorization"] = f"Bearer {api_key}"
    request = Request(
        f"{args.base_url.rstrip('/')}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
    )
    try:
        with urlopen(request, timeout=args.timeout) as response:
            completion = json.load(response)
    except HTTPError as error:
        parser.exit(1, f"HTTP {error.code} from the server. Check the server logs for details.\n")
    except (URLError, TimeoutError) as error:
        parser.exit(1, f"Request failed: {error}\n")
    print(completion["choices"][0]["message"]["content"])


if __name__ == "__main__":
    main()
