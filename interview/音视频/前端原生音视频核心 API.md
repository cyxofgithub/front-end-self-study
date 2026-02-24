### 一、核心基础：HTMLMediaElement（音视频标签的底层接口）

`HTMLMediaElement` 是 `<audio>` 和 `<video>` 标签的底层 DOM 接口，所有音视频标签的核心能力都基于这个接口，下面补充完整且常用的核心内容：

#### 1. 核心属性（补充关键且常用的）

| 属性名               | 作用               | 补充说明                                                                      |
| -------------------- | ------------------ | ----------------------------------------------------------------------------- |
| `src`                | 音视频资源地址     | 支持本地文件、网络 URL、Blob/Object URL（用于流式/本地文件播放）              |
| `currentTime`        | 当前播放时间（秒） | 可读写，用于拖拽进度条、跳播                                                  |
| `duration`           | 总时长（秒）       | 只读，`NaN` 表示资源未加载完成                                                |
| `volume`             | 音量（0-1）        | 0 静音，1 最大音量，部分浏览器限制静音自动播放                                |
| `paused`             | 是否暂停           | 只读，`true` 为暂停/未播放，`false` 为播放中                                  |
| `muted`              | 是否静音           | 可读写，静音不影响 `volume` 值                                                |
| `playbackRate`       | 播放速率           | 可读写，1 为正常，0.5 倍速，2 倍速，部分浏览器支持负数（倒放）                |
| `buffered`           | 已缓冲的时间范围   | 返回 `TimeRanges` 对象，可获取缓冲起始/结束时间（解决“拖动到未缓冲区域”问题） |
| `readyState`         | 就绪状态           | 0:未加载，1:元数据加载，2:可播放部分帧，3:可播放大部分，4:可完整播放          |
| `networkState`       | 网络状态           | 0:未初始化，1:正在加载，2:加载完成，3:加载失败                                |
| `poster`（仅 video） | 视频封面           | 视频未播放时显示的图片地址                                                    |
| `controls`           | 是否显示原生控制栏 | 布尔值，也可自定义控制栏隐藏此属性                                            |

#### 2. 核心方法（补充关键且常用的）

| 方法名                            | 作用                       | 注意事项                                                                          |
| --------------------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| `play()`                          | 开始播放                   | 返回 Promise，需处理播放失败（如自动播放被拦截）                                  |
| `pause()`                         | 暂停播放                   | 无返回值，调用后 `paused` 变为 `true`                                             |
| `load()`                          | 重新加载资源               | 重置播放状态，常用于切换 `src` 后重新加载                                         |
| `canPlayType(type)`               | 检测浏览器是否支持指定格式 | 参数如 `video/mp4; codecs="avc1.42E01E, mp4a.40.2"`，返回 `''`/`maybe`/`probably` |
| `requestFullscreen()`（仅 video） | 申请全屏播放               | 需用户交互触发（如点击事件），不同浏览器有前缀（如 webkitRequestFullscreen）      |
| `captureStream()`                 | 捕获音视频流               | 返回 `MediaStream`，用于直播、录屏、实时处理                                      |

#### 3. 核心事件（补充关键且常用的）

| 事件名           | 触发时机                      | 应用场景                             |
| ---------------- | ----------------------------- | ------------------------------------ |
| `canplay`        | 浏览器可播放至少一帧          | 触发“可播放”状态，显示播放按钮       |
| `timeupdate`     | 当前播放时间改变              | 更新进度条，每秒触发 4-6 次          |
| `ended`          | 播放结束                      | 自动重播、显示“播放完毕”提示         |
| `error`          | 加载/播放出错                 | 捕获错误信息（`event.target.error`） |
| `waiting`        | 缓冲不足，暂停播放            | 显示“加载中”提示                     |
| `stalled`        | 网络异常，资源加载中断        | 检测网络问题，提示用户刷新           |
| `loadedmetadata` | 元数据（时长/分辨率）加载完成 | 获取 `duration`、视频宽高的最佳时机  |
| `loadeddata`     | 第一帧加载完成                | 视频封面替换为第一帧                 |
| `progress`       | 正在缓冲资源                  | 监听缓冲进度，更新缓冲条             |
| `volumechange`   | 音量/静音状态改变             | 同步音量控件显示                     |
| `play`           | 开始播放（包括暂停后继续）    | 记录播放状态，隐藏暂停按钮           |
| `pause`          | 暂停播放                      | 记录播放状态，隐藏播放按钮           |

### 二、进阶能力：Web Audio API（音频处理核心）

Web Audio API 是专门用于**音频数字信号处理**的高级 API，远超 `<audio>` 标签的基础音量控制，能实现专业级音频处理，核心是“音频上下文”+“节点链路”的设计。

#### 1. 核心概念

-   **AudioContext**：音频上下文，所有音频处理的“容器”，需先创建上下文才能使用：
    ```javascript
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    ```
-   **音频节点（AudioNode）**：处理音频的最小单元，如源节点、效果节点、输出节点，节点之间通过 `connect()` 连接形成链路。

#### 2. 常用节点与功能（覆盖你提到的音量、降噪、均衡器等）

| 节点类型                                  | 作用                        | 应用场景                                             |
| ----------------------------------------- | --------------------------- | ---------------------------------------------------- |
| `AudioBufferSourceNode`                   | 音频源（内存中的音频数据）  | 播放本地/网络加载的音频文件（非实时流）              |
| `MediaElementAudioSourceNode`             | 关联 `<audio>/<video>` 标签 | 对现有音视频标签的音频进行处理                       |
| `MediaStreamAudioSourceNode`              | 关联麦克风/摄像头音频流     | 实时处理麦克风输入（如直播降噪）                     |
| `GainNode`                                | 音量控制                    | 精准调节音量（支持渐变），比 `<audio>.volume` 更灵活 |
| `BiquadFilterNode`                        | 音频滤波                    | 实现均衡器（高低音调节）、降噪（低通/高通滤波）      |
| `ConvolverNode`                           | 卷积效果                    | 模拟混响（如房间、音乐厅音效）                       |
| `AnalyserNode`                            | 音频分析                    | 音频可视化（频谱、波形图）                           |
| `ChannelMergerNode`/`ChannelSplitterNode` | 声道合并/拆分               | 混音（多音频叠加）、立体声处理                       |

#### 3. 基础示例（音频可视化）

```javascript
// 1. 创建音频上下文和分析节点
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048; // FFT大小，越大频谱越精细
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// 2. 关联audio标签
const audio = document.querySelector('audio');
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser); // 源节点连分析节点
analyser.connect(audioCtx.destination); // 分析节点连输出（扬声器）

// 3. 绘制频谱（结合Canvas）
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
function drawSpectrum() {
    requestAnimationFrame(drawSpectrum);
    analyser.getByteFrequencyData(dataArray); // 获取频率数据

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgb(${barHeight}, 50, 50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
    }
}
audio.play().then(() => drawSpectrum()); // 播放后开始可视化
```

### 三、现代核心：WebCodecs API（原生编解码）

WebCodecs API 是浏览器原生提供的音视频编解码接口，**性能远超 WASM/JS 方案**，解决了传统 `<video>` 标签无法自定义编解码、处理裸流（如 H.264/H.265 裸码流）的问题，核心用于实时音视频（如 WebRTC）、直播、视频编辑等场景。

#### 1. 核心优势

-   原生浏览器实现，直接调用底层硬件加速，性能比 WASM 高 5-10 倍；
    -   **硬件加速来源**：通过各平台原生媒体 API 对接 GPU/专用芯片：Windows 用 DXVA/D3D11 Video，macOS/iOS 用 VideoToolbox（Apple 硬编解码引擎），Android 用 MediaCodec，Linux 用 VA-API/VDPAU；实际运行会优先使用 Intel Quick Sync、NVIDIA NVENC/NVDEC、AMD VCE/VCN 等专用编解码单元。
-   支持处理裸码流（EncodedVideoChunk/EncodedAudioChunk），灵活控制编解码过程；
-   支持主流编码格式：H.264、VP8、VP9、AV1（视频），AAC、PCM（音频）。

#### 2. 核心接口

| 接口名         | 作用     | 核心方法/属性                                                                  |
| -------------- | -------- | ------------------------------------------------------------------------------ |
| `VideoDecoder` | 视频解码 | `configure()`（配置解码器）、`decode()`（解码裸码流）、`flush()`（刷新缓冲区） |
| `VideoEncoder` | 视频编码 | `configure()`（配置编码器，如码率、分辨率）、`encode()`（编码视频帧）          |
| `AudioDecoder` | 音频解码 | 同 VideoDecoder，处理音频裸码流                                                |
| `AudioEncoder` | 音频编码 | 同 VideoEncoder，配置采样率、声道数等                                          |
| `VideoFrame`   | 视频帧   | 承载解码后的视频帧数据，可绘制到 Canvas/OffscreenCanvas                        |
| `AudioData`    | 音频数据 | 承载解码后的音频样本数据                                                       |
| `ImageDecoder` | 图像解码 | 解码视频帧中的图片（如封面、关键帧）                                           |

#### 3. 基础示例（视频解码播放）

```javascript
// 1. 模拟获取H.264裸码流（实际从网络/文件读取）
async function getEncodedChunks() {
    // 此处仅示例，实际需从流中解析EncodedVideoChunk
    const response = await fetch('video.h264');
    const arrayBuffer = await response.arrayBuffer();
    return [
        new EncodedVideoChunk({
            type: 'key', // 关键帧
            timestamp: 0, // 时间戳（微秒）
            data: new Uint8Array(arrayBuffer),
        }),
    ];
}

// 2. 配置视频解码器
const videoDecoder = new VideoDecoder({
    // 解码成功回调：获取VideoFrame
    output: (frame) => {
        // 将帧绘制到Canvas
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
        frame.close(); // 释放帧资源
    },
    // 解码错误回调
    error: (e) => console.error('解码失败:', e),
});

// 3. 初始化解码器（配置编码格式、分辨率）
videoDecoder.configure({
    codec: 'avc1.42E01E', // H.264编码格式
    codedWidth: 1920,
    codedHeight: 1080,
    displayWidth: 1920,
    displayHeight: 1080,
});

// 4. 解码并播放
const chunks = await getEncodedChunks();
for (const chunk of chunks) {
    await videoDecoder.decode(chunk);
}
await videoDecoder.flush(); // 刷新缓冲区，确保所有帧解码完成
```

### 四、补充核心 API（音视频开发必备）

除了上述核心，还有几个高频使用的原生 API 需掌握：

#### 1. MediaStream API（媒体流）

-   作用：表示音频/视频流（如麦克风、摄像头、屏幕录制、音视频标签捕获的流）；
-   核心方法：
    -   `navigator.mediaDevices.getUserMedia()`：获取摄像头/麦克风流（直播、视频通话）；
    -   `navigator.mediaDevices.getDisplayMedia()`：获取屏幕录制流（录屏）；
    -   `mediaStream.addTrack()`/`removeTrack()`：添加/移除音视频轨道。

#### 2. MediaRecorder API（媒体录制）

-   作用：录制 `MediaStream` 为 Blob（本地保存/上传）；
-   核心示例：
    ```javascript
    // 获取麦克风流并录制
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.start(); // 开始录制
    setTimeout(() => {
        mediaRecorder.stop(); // 停止录制
        // 生成录制的音频文件
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    }, 5000);
    ```

#### 3. URL API（音视频资源处理）

-   `URL.createObjectURL(blob/mediastream)`：生成本地临时 URL，用于播放 Blob/流；
-   `URL.revokeObjectURL(url)`：释放临时 URL，避免内存泄漏。

---

### 总结

1. **基础层**：`HTMLMediaElement` 是音视频播放的基础，覆盖 `<audio>/<video>` 标签的所有属性、方法、事件，核心解决“播放/暂停/进度/缓冲”等基础需求；
2. **进阶层**：Web Audio API 专注音频处理，通过“上下文+节点”实现音量、降噪、均衡器、可视化等专业音频效果；
3. **现代层**：WebCodecs API 是原生编解码核心，性能远超传统方案，解决裸码流处理、自定义编解码等高级需求，搭配 MediaStream/MediaRecorder 可实现直播、录屏、视频编辑等复杂场景。

掌握这三层 API，就能覆盖前端原生音视频开发的所有核心场景（播放、处理、编解码、录制、直播）。
