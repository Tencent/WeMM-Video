# WeMM GGUF runtime

`wemm-native` runs WeMM GGUF bundles with llama.cpp. Each bundle contains
`language.gguf`, `mmproj.gguf`, and `audio.gguf` from the same Hub repository and revision.

From the project root, build on Linux with CMake 3.20+, a C++17 compiler, Git, and Python 3.10+.
On Ubuntu, install the build and media dependencies with APT.

```bash
sudo apt-get install build-essential cmake git python3 python3-venv ffmpeg
python3 native/build.py --backend cpu
```

For GPU offload, install a compatible NVIDIA driver and CUDA toolkit with `nvcc`.
Set the architecture for your GPU (89 for L20, 90 for H20, or 120 for RTX PRO 5000).

```bash
python3 native/build.py --backend cuda --cuda-architectures 89
```

The build fetches and verifies the llama.cpp revision pinned in
[llama.cpp.lock.json](llama.cpp.lock.json). Use `--llama-source` to use an existing
checkout at that revision.

## Run from the Hub

```bash
python3 -m venv .venv-gguf
source .venv-gguf/bin/activate
python -m pip install huggingface_hub
export PATH="$PWD/native/install-cpu/bin:$PATH"
python native/run_hf.py --repo-id tencent/WeMM-Video-2B-GGUF \
  --prompt "In one sentence, explain what an eclipse is." --output result.json
```

Use any GGUF repository in the [Model Zoo](../README.md#model-zoo).
Use `--revision` to pin a Hub commit.
The launcher uses the Hub cache and downloads all three components together.

Pass `--image image.jpg`, `--audio audio.wav`, `--video input.mp4`, or
`--video-audio input.mp4` with media you supply. To offload layers to CUDA,
put `native/install-cuda/bin` on `PATH` and pass `--gpu-layers 99`. Choose a new
`--output` filename for each run.

See [third-party notices](THIRD_PARTY_NOTICES.md) for dependency attribution.
