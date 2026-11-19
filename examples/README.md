# Inference examples

## Transformers

[Install the Quick Start dependencies](../README.md#quick-start) and run the
bundled Apollo 11 clip with its original audio track.

```bash
python examples/transformers_video.py
```

Use `--video` for another local clip, `--model` for a different BF16 model, and
`--revision` to pin the Hub revision.

## Serving API

Run these commands from the project root with a patched [vLLM or SGLang
server](../docs/serving.md) listening on port 8000. Set `MODEL` to the Hub ID
or alias the server exposes. The client uses Python's standard library and
embeds the bundled media in the requests.

```bash
MODEL=tencent/WeMM-Video-2B

python examples/chat.py text        --model "$MODEL"
python examples/chat.py image       --model "$MODEL"
python examples/chat.py audio       --model "$MODEL"
python examples/chat.py video       --model "$MODEL"
python examples/chat.py video-audio --model "$MODEL"
```

| Case | Input | Task |
| --- | --- | --- |
| `text` | Meeting schedule | Calculate the end time (`10:05`). |
| `image` | [Photograph of Earth](media/apollo-11-earth.jpg) | Identify Earth and describe what is visible. |
| `audio` | [Apollo 11 radio recording](media/apollo-11-small-step.wav) | Transcribe the English speech. |
| `video` | [Apollo 11 television footage](media/apollo-11-first-steps.mp4) | Describe the frames with the soundtrack disabled. |
| `video-audio` | Same footage with its original soundtrack | Describe the scene and summarize the radio speech. |

Use `--base-url http://HOST:PORT/v1` for a different server and
`OPENAI_API_KEY` if it requires authentication.

## Run the clip with GGUF

After [building the native runtime](../native/README.md), run the same clip
with any compatible GGUF model from the Hub.

```bash
python native/run_hf.py --repo-id tencent/WeMM-Video-2B-GGUF \
  --video-audio examples/media/apollo-11-first-steps.mp4 \
  --fps 1 --max-frames 16 --total-pixels 262144 \
  --prompt "Describe what happens on screen and summarize the speech you hear." \
  --output apollo-11-result.json
```

## Media credits

The media comes from NASA's Apollo 11 archives. The photo is NASA's 640 × 640
rendition. The speech recording is stored as mono PCM WAV, and the television
clip as H.264 with its original soundtrack encoded in AAC.
See [NASA's media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).

| File | NASA source |
| --- | --- |
| `apollo-11-earth.jpg` | [Apollo 11 photograph AS11-36-5355](https://images-assets.nasa.gov/image/as11-36-5355/as11-36-5355~small.jpg) |
| `apollo-11-small-step.wav` | [Historical Sounds, “That's One Small Step for (a) Man”](https://www.nasa.gov/historical-sounds/) |
| `apollo-11-first-steps.mp4` | [Apollo 11 Video Library, television clip at mission time 109:23:38](https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/video11.html) |
