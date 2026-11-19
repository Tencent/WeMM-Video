# Native runtime dependencies

The native engine links the pinned upstream llama.cpp/ggml/mtmd libraries.
Their source and license are obtained from the public repository identified by
`llama.cpp.lock.json`; distribute their notices with source or binary packages.

`include/third_party/pillow_resize.h` extracts resize arithmetic from the pinned
llama.cpp mtmd image implementation. `torch_u8_resize.h` adapts that arithmetic
to match PyTorch uint8 bicubic behavior without linking PyTorch. Source hashes
and extraction details are in `include/third_party/provenance.json`, with the
retained `LICENSE.llama.cpp` and `LICENSE.pytorch` alongside the headers.

The installed program invokes the separately installed FFmpeg and FFprobe
executables for decoding. CUDA builds also require a compatible NVIDIA driver
and CUDA runtime. Binary distribution should identify the FFmpeg, compiler,
system-library and CUDA versions actually used. This source delivery does not
assign a license to model weights or claim that prebuilt binaries were published.
