# 三端帧率/分辨率控制 Demo

对应 [多路拉流与断线恢复.md](../多路拉流与断线恢复.md) §4.5「三端代码：帧率/分辨率到底在哪控制」。

**运行**：Chrome 直接双击打开 `simulcast-substream-demo.html`，零依赖。

## 演示内容

一句话结论的实物验证：**帧率/分辨率是编码端定死的参数**，上行真正改、服务端有条件改、下行只能选。

- **三面板对应三端**：① 上行（车端编码器）→ ② 服务端（SFU）→ ③ 下行（浏览器拉流）
- **点顶部档位**（主码流 720p30 / 子码流 360p15 / 极低档 180p10）＝ 上行改编码参数，下行收到的流实时变化
- **上行**：真实 `canvas.captureStream(fps)` 控帧率 + `scaleResolutionDownBy` 控分辨率，`getStats` 出站读数实时显示编码出的 frameWidth×Height 与 framesPerSecond
- **服务端**：挑档（simulcast 转发）vs 转码（重编码）两个图例，切换看代价差异
- **下行**：真实 `ontrack` 收流 + `getStats` 入站读数，解码开销 meter 按像素吞吐（分辨率×帧率）实时算

**操作路径**：打开页面等首帧出图（≤2s）→ 依次点「主码流 / 子码流 / 极低档」看 ①③ 面板的分辨率/帧率读数同步跳变、开销 meter 缩短 → 切「转码」看 SFU 图例变成重编码路径。

## 真实 / 模拟边界

| 部分 | 真实 | 模拟 |
| --- | --- | --- |
| 帧率控制 | `canvas.captureStream(fps)` 按采集帧率出流（车端 `-framerate` 等价物） | — |
| 分辨率控制 | `setParameters({ scaleResolutionDownBy })` 真实缩小编码分辨率 | — |
| 推拉流 | `RTCPeerConnection` + SDP/ICE 交换、`ontrack` 真实建连收流 | 信令通道是「同页两个 PC 互塞」，非网络 |
| 读数 | `getStats()` 出/入站 `frameWidth/frameHeight/framesPerSecond/framesDecoded` | — |
| SFU 挑档/转码 | — | 纯图例（单文件跑不起真 SFU） |
| 解码开销 | 公式按分辨率×帧率算，量纲真实 | 「硬解/软解」浏览器无直读 API，且真实解码非像素线性 |

## 接真实 SRS 的进阶路径

1. 把环回信令换成 WHEP：`new RTCPeerConnection()` + `addTransceiver('video', {direction:'recvonly'})` → `fetch(url, {method:'POST', headers:{'Content-Type':'application/sdp'}, body: offer.sdp})` → `setRemoteDescription(answer)`（文档 §二）
2. 「档位切换」换成拉不同子流 URL：主码流 `vehicle_01` vs 子码流 `vehicle_01_sub`（车端双推或 SRS 转码出子流）
3. simulcast 三档 rid 的配置本 demo 已给出（上行面板静态代码块），真 SRS 里 SFU 按订阅端 `?simulcast=` 挑档转发

## 面试话术串联

> 「我写了个 demo 验证『帧率/分辨率在编码端定死』这点：用真实 canvas 采集 + RTCPeerConnection 环回推拉流，切主码流/子码流档位，下行 getStats 的 frameWidth 和 framesPerSecond 实时变——证明浏览器侧只能选档不能改流，真正改帧率分辨率的是编码端的 scaleResolutionDownBy 和采集帧率，服务端要么挑档要么转码。」

## 面试官可能现场追问

| 追问 | 答案锚点 |
| --- | --- |
| 下行能直接降帧率吗 | 不能。帧已编好，要么收要么不收；浏览器只能换子流 URL 或靠 SFU 按 RTCP 反馈自动降 simulcast 档 |
| scaleResolutionDownBy 为什么是 2、4 | 该参数是整数倍缩小；本 demo 1280×720 ÷2 = 640×360、÷4 = 320×180 |
| 挑档和转码代价差多少 | 挑档纯转发≈0 CPU，一台 SFU 扛几百上千路；转码要解码+重编码，一台只能转几路 |
| 帧率到底谁控 | 编码端（车端 `-framerate` / canvas captureStream fps / `maxFramerate`）；服务端转码才能改，下行只能选 |
| 接真 SRS 差异 | 环回信令换 WHEP fetch，档位切换换拉 `vehicle_01_sub` URL，其余治理逻辑（并发/可见性/降级）不变 |
