## 核心 API 类（高频手写 / 应用题）

### 如何通过 getUserMedia 获取摄像头 / 麦克风流？

```javascript
async function getLocalMediaStream() {
    try {
        // 1. 配置音视频参数（可指定分辨率、帧率）
        const constraints = {
            video: { width: 1280, height: 720, frameRate: 30 }, // 视频配置
            audio: true, // 开启音频
        };

        // 2. 检查API支持性（兼容性前置）
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('当前浏览器不支持音视频采集');
        }

        // 3. 获取媒体流（需用户授权）
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // 4. 绑定到video标签播放
        const videoEl = document.getElementById('local-video');
        videoEl.srcObject = stream;
        await videoEl.play(); // 播放（需处理自动播放策略）
    } catch (error) {
        // 5. 分类处理异常（面试重点）
        console.error('采集失败：', error);
        if (error.name === 'NotAllowedError') {
            alert('请授予摄像头/麦克风权限');
        } else if (error.name === 'NotFoundError') {
            alert('未检测到摄像头/麦克风设备');
        } else if (error.name === 'NotSupportedError') {
            alert('仅支持HTTPS/localhost环境采集音视频');
        }
    }
}
```

关键解释：

-   getUserMedia 返回 Promise，需用户授权；
-   必须在 HTTPS 环境下使用（localhost 除外）；
-   异常需分类捕获，提升用户体验。

### MediaRecorder 实现音视频录制

常考 “录制逻辑 + Blob 下载”，核心是监听 dataavailable 事件

```javascript
async function recordMedia() {
    // 1. 先获取音视频流
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // 2. 创建录制实例（指定格式）
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    // 3. 存储录制的Blob数据块
    const chunks = [];

    // 4. 监听数据可用事件（录制中/停止时触发）
    recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };

    // 5. 录制结束：合并Blob并下载
    recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URLObjectURL.create(videoBlob); // 创建临时URL
        downloadLink.download = '录制的视频.webm';
        downloadLink.click();
        URL.revokeObjectURL(downloadLink.href); // 释放内存（面试易错点）

        // 停止流，释放设备（避免占用）
        stream.getTracks().forEach((track) => track.stop());
    };

    // 6. 开始录制（参数：时间片，每1秒触发一次dataavailable）
    recorder.start(1000);

    // 模拟5秒后停止录制
    setTimeout(() => recorder.stop(), 5000);
}
```

### WebRTC 核心原理（面试高频）

[参考](./webRTC.md)
