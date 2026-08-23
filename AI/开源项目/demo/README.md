# dify / chatgpt-next-web / lobe-chat 可运行 Demo

> **一句话结论：** 三个开源项目全部本机真实跑起来，模型源统一用本地 **Ollama**（`qwen2.5`，OpenAI 兼容接口），无任何外部 API 依赖。dify 那条线是「真实项目代码 + 协议适配层」，另外两个是**原版开源项目本体**。

## 总览

| Demo | 代码位置 | 启动命令 | 端口 | 本体真实性 |
| --- | --- | --- | --- | --- |
| dify 协议消费端 | 仓库内 [AI_Agent示例](../../../code/AI_Agent示例/README.md) | `LLM_MODE=ollama npm run dev` | 3002(前端)/3001(代理) | 前端+Express 代理全真；dify 平台用适配层模拟 |
| chatgpt-next-web | `~/Desktop/cache/ai-demos/chatgpt-next-web`（仓库外） | `yarn dev` | 3000 | **原版 NextChat 仓库**（main 分支） |
| lobe-chat | `~/Desktop/cache/ai-demos/lobe-chat`（仓库外） | `pnpm dev`（前置：本地 PG + 迁移，见下） | 3010 | **原版 lobe-chat v1.159.0**（tag 对应内部 2.1.11） |

两个开源项目是**完整的第三方仓库**，放仓库外 `~/Desktop/cache/ai-demos/`（各自 1–6GB node_modules，不入库）；仓库内的本 README 负责记录复现步骤与踩坑。lobe-chat 进站会跳登录页，访问密码见下文 `.env`（`ollama-demo`）。

## 前置：Ollama（三个 demo 共用）

```bash
# 服务没起时（menubar 里没图标 / curl 11434 不通）
ollama serve          # 或直接打开 Ollama.app

# 已装模型（2026-08 验证）
curl -s localhost:11434/api/tags
# → qwen2.5（对话模型，demo 用它）、nomic-embed-text（embedding）

# 快速自检：OpenAI 兼容流式端点
curl -N localhost:11434/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"qwen2.5","stream":true,"messages":[{"role":"user","content":"hi"}]}'
# → data: {...delta.content...} 一串 + data: [DONE] 即正常
```

## 1. dify 协议消费端（AI_Agent示例）

**讲的故事**：业务系统怎么消费 dify 平台——前端 → Express 代理（保护 Key + CORS + 转发 SSE）→ dify。

```bash
cd AI/code
LLM_MODE=ollama npm run dev:server              # 代理 + 协议适配层，端口 3001
npm run dev:client -- --port 3002              # 前端（用 3002，避开 next-web 的 3000）
# 不带 LLM_MODE 则走真实 dify（需要内网 + .env 的 DIFY_* 配置）
```

**改造点**（`server/server.js`，约 +100 行）：`LLM_MODE=ollama` 时，适配层把 Ollama 的 OpenAI 流翻译成 dify 的 SSE 事件协议——`event: message`（逐 token `answer` 增量）→ `event: message_end`（结算）→ `event: end`；多轮上下文用内存 Map 按 `conversation_id` 记（对应 dify 平台的服务端会话）。

> **依赖现状注意**：`AI/code/node_modules` 里 `.bin`/`.vite`/部分包目录是 root 属主（历史 sudo 安装污染），本次的 express/cors/dotenv/@chatscope/vite 是**软链到 `/tmp/aidemo-deps`**——重启后 /tmp 会被清，届时要么重跑上述软链，要么一次性根治：`sudo chown -R $(whoami) AI/code/node_modules` 后正常 `npm install`。

**面试观察点**（对着 DevTools Network → 该请求 → EventStream）：

- 前端只消费 `data:` 帧 JSON 里的 `answer` 字段——这就是 dify 协议的核心
- 中断生成：代理 `req.on('close')` → `reader.cancel()`，Ollama 停止生成（终端有日志）
- 这条链路 = 生产环境把 `dify.cvte.com` 换成公司 dify 域名即可上线

## 2. chatgpt-next-web（NextChat 原版）

```bash
cd ~/Desktop/cache/ai-demos/chatgpt-next-web
yarn dev                # 首次编译约 25s
# .env.local 已配好（见下），UI 里还要选一次模型
```

`.env.local`（已写入）：

```ini
BASE_URL=http://localhost:11434    # 注意不带 /v1！客户端 ChatPath 自动拼 v1/chat/completions
OPENAI_API_KEY=ollama              # Ollama 不校验，占位即可
```

**UI 配置**（设置 → 自定义接口）：接口地址 `http://localhost:11434`、密钥 `ollama`；模型名填 `qwen2.5`（默认列表里没有，需要手填/通过 CUSTOM_MODELS 环境变量加）。

**已验证**：代理路由 `app/api/[provider]/[...path]/route.ts` 从请求头 `x-base-url` 取上游地址、原样转发 Authorization 与 SSE 流——curl 模拟该路由请求，Ollama 真实 chunk 到达 ✅（2026-08-23）。

**面试观察点**：

- DevTools 里聊天请求打到 `/api/openai/v1/chat/completions`（同源）→ 代理转发 11434——**Key 不落前端的经典实现**
- 流式渲染打字机 + 会话存 localStorage（Application 面板可见）——纯前端持久化的天花板
- Mask（面具）功能 = system prompt + 参数的可分发预设

## 3. lobe-chat（原版，v1.159.0，server 模式 + 本地 Postgres）

> **版本现状**：lobe-chat 近期版本**全部要求 Postgres**（浏览器本地模式已移除；tag `v1.159.0` 内部版本实为 2.1.11，v1.x 编号是连续小版本不是「1.0 时代」）。v2（仓库更名 `lobehub/lobehub`）保留在 `~/Desktop/cache/ai-demos/lobe-chat-v2-servermode/` 备查。demo 用 v1.159.0 + brew 装的 PostgreSQL 17。

**一次性前置**（已配置好，换机器才需要重来）：

```bash
brew install postgresql@17 pgvector
PGBIN=/opt/homebrew/opt/postgresql@17/bin
$PGBIN/initdb -D ~/pgdata-lobe --auth=trust
$PGBIN/pg_ctl -D ~/pgdata-lobe start        # 之后每次 demo 前也要起
$PGBIN/createdb lobechat
$PGBIN/psql -d lobechat -c "CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE EXTENSION IF NOT EXISTS vector;"
cd ~/Desktop/cache/ai-demos/lobe-chat && pnpm db:migrate
```

**日常启动**：

```bash
$PGBIN/pg_ctl -D ~/pgdata-lobe start        # 没起的话
cd ~/Desktop/cache/ai-demos/lobe-chat && pnpm dev   # 端口 3010 → 自动跳 /signin → 输访问密码 ollama-demo
```

`.env`（已写入）：

```ini
OPENAI_API_KEY=ollama
OPENAI_PROXY_URL=http://localhost:11434/v1    # 要带 /v1（与 next-web 相反）
OPENAI_MODEL_LIST=+qwen2.5                    # 把本地模型加进默认列表
ACCESS_CODE=ollama-demo                       # 登录页的访问密码
KEY_VAULTS_SECRET=<openssl rand -base64 32 生成>   # 启动时无条件校验
NEXT_AUTH_SECRET=<openssl rand -base64 32 生成>    # 登录会话签名
DATABASE_URL=postgres://chenyuanxin@localhost:5432/lobechat
DATABASE_DRIVER=node                           # 默认 neon 走 websocket，本地库必须切 node
```

**面试观察点**：

- 插件市场（设置 → 插件）：装一个实时天气插件，观察 function calling 全流程——模型返回 tool_call → 前端真实请求插件 API → 结果回传 → 模型总结
- Agent 角色市场：一个「角色」= system prompt + 插件集合 + 参数的 JSON，可分享导入
- server 模式的数据全进 Postgres（`psql -d lobechat` 可直接查 sessions/messages 表）——对比 next-web 的 localStorage 方案，正好讲「纯前端持久化 vs 服务端持久化」的分界
- 数据库迁移本身就是 drizzle-orm 的活教材（`packages/database` 全是 schema 定义）

## 真实 / 模拟边界（诚实声明）

| 环节 | 真实性 |
| --- | --- |
| chatgpt-next-web / lobe-chat 代码 | ✅ 官方仓库原版（next-web: main 分支 clone；lobe-chat: v1.159.0 tag tarball） |
| lobe-chat 数据库 | ✅ 本地 PostgreSQL 17 + 官方迁移脚本（drizzle），真实 server 模式 |
| dify「平台」 | ⚠️ **适配层模拟**——dify 协议帧由 server.js 生成；真实平台需内网 dify（`AI/code/.env` 已有配置，去掉 LLM_MODE 即走真实链路） |
| dify 工作流/RAG 能力 | ❌ 适配层只有对话流；编排/知识库是 dify 后端能力，demo 覆盖不到（面试如实说） |

## 踩坑记录（复现时可能再遇到）

1. **GitHub clone 大仓库断流**（`early EOF`）：lobe-chat 直连 clone 失败 → 走加速 tarball：`curl -L https://ghfast.top/https://github.com/lobehub/lobe-chat/archive/refs/tags/v1.159.0.tar.gz | tar xz`
2. **lobe-chat 任何近期版本都要 Postgres**：浏览器本地模式已从产品里移除（v1/v2 皆然——tag `v1.159.0` 内部版本 2.1.11，1.x 编号是连续小版本不是「1.0 时代」）。本地没有 docker 的话用 brew 的 postgresql@17 + pgvector 一样跑。三个额外坑：`DATABASE_DRIVER` 默认 `neon`（websocket 驱动连不上本地库，要切 `node`）；迁移里 `CREATE EXTENSION vector` 需要 brew 装 pgvector；server 模式进站跳 `/signin`，输 `ACCESS_CODE` 即可（`NEXT_AUTH_SECRET` 不配的话登录会话签不出来）
3. **cnpm 镜像缺包**：`@chatscope/chat-ui-kit-styles@^2.1.1` 在镜像和官方源都不存在（官方最高 1.4.0，package.json 的 range 是坏的）——`AI/code/package.json` 已改为 `^1.4.0`
4. **next-web 的 BASE_URL 不带 `/v1`，lobe-chat 的 OPENAI_PROXY_URL 要带 `/v1`**——两家拼法相反，配错就 404
5. **首次请求慢是模型加载**：qwen2.5 冷启动要几秒到几十秒，流式测试的超时给足
6. **pnpm 10 拦构建脚本**：lobe-chat 安装完会提示 `pnpm approve-builds`——浏览器模式不碰那些原生依赖，可以直接无视
