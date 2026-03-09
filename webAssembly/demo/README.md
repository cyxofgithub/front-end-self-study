# WebAssembly 实践示例

本目录包含速成计划中的三个实践 demo：

| 目录 | 说明 | 运行方式 |
|------|------|----------|
| [wat/](wat/) | WAT 手写（add、multiply、max） | `cd wat && npm install && npm run build && npm run serve` |
| [ffmpeg/](ffmpeg/) | ffmpeg.wasm 进阶（视频压缩、水印） | 直接打开 index.html 或 `npx serve .` |
| [rust-wasm/](rust-wasm/) | Rust 编译到 WASM（数组求和、斐波那契） | 需安装 Rust + wasm-pack，见目录内 README |
