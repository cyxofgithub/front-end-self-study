# 添科智能一面 Demo

对应 [一面准备.md](../一面准备.md) 岗位要求 ① Agent/Chatbot 前端 ② CUI+GUI，三个可演示/可讲解的 demo。

## 1. cui-gui-demo.html — CUI + GUI 混合交互（岗位要求 ② 主打）

**运行**：浏览器直接打开，无任何依赖。

**演示内容**：

- 左侧对话（CUI）流式输出，中间穿插**工具调用卡片**（running → success 状态机 + 耗时）
- 右侧画布（GUI）按 `ui` 事件渲染结构化卡片：**组件注册表**（`PlanCard` / `DataChart` / `DataTable`）—— 与低代码 schema 驱动渲染同构
- **GUI 操作回流 CUI**：计划卡片上点「确认执行」→ 转写成一条 user message + `gui_action` 上行事件，会话上下文不断
- **停止生成**：流式过程中随时 abort（AbortController 的 mock）
- 底部**事件流检查器**：展示 `text_delta / tool_call / tool_result / ui / done` 帧格式 —— 即生产环境 SSE 的下行帧协议

**操作路径**：点「🎬 生成下周抖音带货脚本」看全链路 → 在右侧卡片改参数点确认 → 看回流；流式中点「停止」看中断。

## 2. sse/ — 手写 SSE（一面准备.md §2 的实物）

**运行**：

```bash
cd sse
node server.cjs
# 打开 http://localhost:3000
```

**左侧（原生 EventSource，GET /sse）**：

- 帧编号 `id:`、`retry: 2000` 重连间隔、注释帧心跳
- **断点续传演示**：连接后把服务端 Ctrl+C 杀掉，面板出现 onerror + 自动重连；重启 `node server.cjs`，浏览器带 `Last-Event-ID` 重连，服务端从 history 缓存补发缺失帧（终端有日志）

**右侧（fetch + ReadableStream，POST /chat/stream）**：

- POST body + `Authorization` 头（EventSource 做不到的两点）
- **半包/粘包处理**：buffer 累积 + 按 `\n\n` 切帧
- 输入带「天气」触发具名 `event: tool_call` 帧
- 「中断 abort()」按钮 → AbortController，服务端 `res close` 感知并停止生成（终端有日志）

## 3. AI_Agent示例 — Dify 真实流式聊天（已有项目）

见 [AI/code/AI_Agent示例](../../../../AI/code/AI_Agent示例/README.md)：React + Express 代理内部 dify API 的 SSE，streamdown 渲染。链路：前端 → Express（保护 API Key + CORS）→ dify SSE。

## 面试话术串联

> 「我写了几个小 demo 沉淀这块的理解：一个是 CUI+GUI 混合交互——对话流式输出 + 工具调用卡片 + 画布卡片渲染，GUI 确认操作会回流成对话消息保证上下文完整；一个是手写 SSE——EventSource 和 fetch 两种实现都写了，包括半包处理、abort、Last-Event-ID 断点续传；还接内部 dify 做过完整的流式聊天应用。」

## 面试官可能现场追问的点（对着 demo 讲）

| 追问 | 答案锚点 |
| --- | --- |
| 流式为什么卡顿/怎么优化 | 增量 md 解析、rAF 合帧、只渲染最后一条消息 |
| 怎么中断 | AbortController.abort()；服务端 res close 感知 |
| 断网怎么办 | EventSource 自动重连 + Last-Event-ID；fetch 版要应用层实现（Redis 缓存帧） |
| 确认是重新发起 SSE，怎么接上上次对话 | SSE 一回合一条、流完即关，接的不是连接是**会话**：首轮响应帧带 `conversation_id` → 客户端流中捕获存 state（App.jsx:110）→ 确认/新消息的请求 body 带回该 id → 服务端按 id 取历史追加。另一派（next-web）无 id，每次全量上传 messages 数组——状态随请求走 |
| GUI 卡片怎么来的 | 模型下发 `ui` 帧（component + props），前端注册表渲染 = 低代码 schema 渲染 |
| 服务端怎么知道确认的是哪一个 | ID 的权威方是服务端：下发 `ui` 帧时 props 里就带 `planId`，确认时原样回执 + 附上输入框当前值（参数快照 = 确认时刻的最终意图）；作用域由 (session, plan_id, action) 三元组限定 |
| 为什么 GUI 操作要回流对话 | 会话上下文是唯一 source of truth，否则模型不知道用户干了什么 |
