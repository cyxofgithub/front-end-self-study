# ffmpeg.wasm 进阶示例（npm 方案）

基于 `@ffmpeg/ffmpeg` + `@ffmpeg/core`（本地依赖）实现：

1. **视频压缩**：使用 H.264 编码，CRF 28 控制质量，减小文件体积
2. **添加水印**：使用 overlay 滤镜，将水印图片叠加在视频右下角

## 使用方式

```bash
npm install
npm run dev
```

打开命令行输出的本地地址后，选择视频文件点击按钮即可。首次使用会加载 WASM 核心，可能需要几秒。

## 说明

-   运行 `dev/build/preview` 时会先执行 `prepare:ffmpeg`
-   `prepare:ffmpeg` 会把 `@ffmpeg/core/dist/esm` 下的核心文件复制到 `public/ffmpeg`
-   页面通过同源路径 `/ffmpeg/ffmpeg-core.js` 与 `/ffmpeg/ffmpeg-core.wasm` 加载核心文件，避免 CDN Worker 跨域问题

## FFmpeg 参数说明

-   **压缩**：`-crf 28` 控制质量（18-28 常用，越大体积越小）、`-preset medium` 平衡速度与压缩率
-   **水印**：`overlay=main_w-overlay_w-10:main_h-overlay_h-10` 表示右下角，距边缘 10 像素
