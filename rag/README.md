# RAG 知识库对话项目

基于本项目 500+ 篇 Markdown 学习笔记的 RAG（检索增强生成）知识库对话系统。

## 架构

```
用户提问 → VitePress 聊天组件 → Egg.js 后端
                                    ├── Ollama Embedding（问题向量化）
                                    ├── ChromaDB（相似度检索）
                                    ├── 构建上下文 Prompt
                                    └── Ollama LLM（流式生成回答）→ SSE → 前端渲染
```

## 环境准备

### 1. 安装 Ollama

```bash
brew install ollama

# 拉取模型
ollama pull nomic-embed-text   # Embedding 模型（768 维，支持中英文）
ollama pull qwen2.5            # 对话模型（中文效果好，可换成其他模型）

# 启动 Ollama 服务（通常安装后自动启动）
ollama serve
```

### 2. 安装 ChromaDB

```bash
pip install chromadb

# 启动 ChromaDB 服务
chroma run --host localhost --port 8000
```

### 3. 安装项目依赖

```bash
# 索引脚本依赖
cd rag/scripts
pnpm install

# 后端服务依赖
cd ../server
pnpm install
```

## 使用步骤

### Step 1: 索引文档

将项目中的 Markdown 文件解析、分段、向量化后存入 ChromaDB：

```bash
cd rag/scripts

# 首次索引（全量）
pnpm run index:clean

# 增量更新（只处理变更文件）
pnpm run index
```

### Step 2: 启动后端服务

```bash
cd rag/server
pnpm run dev
```

服务启动后监听 `http://localhost:7001`，提供以下接口：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/rag/chat/stream` | POST | SSE 流式聊天 |
| `/api/rag/health` | GET | 健康检查 |

### Step 3: 启动文档站

```bash
# 在项目根目录
pnpm docs:dev
```

访问文档站后：
- 右下角会出现悬浮聊天按钮，点击即可提问
- 导航栏「AI 助手」链接进入全屏聊天页面

## 配置

### 环境变量

复制 `rag/server/.env.example` 为 `.env` 并按需修改：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama 服务地址 |
| `OLLAMA_EMBEDDING_MODEL` | `nomic-embed-text` | Embedding 模型名 |
| `OLLAMA_CHAT_MODEL` | `qwen2.5` | 对话模型名 |
| `CHROMA_HOST` | `http://localhost:8000` | ChromaDB 服务地址 |
| `CHROMA_COLLECTION` | `frontend-docs` | ChromaDB Collection 名 |
| `RAG_TOP_K` | `5` | 检索返回的文档片段数 |
| `RAG_SCORE_THRESHOLD` | `0.3` | 相似度阈值（越高越严格） |

### 切换对话模型

修改 `OLLAMA_CHAT_MODEL` 环境变量即可切换，推荐：

- `qwen2.5` -- 中文效果好，推荐
- `llama3` -- 英文能力强
- `mistral` -- 轻量快速
- `deepseek-r1` -- 推理能力强

## 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 前端 | VitePress + Vue 3 | 文档站 + 聊天组件 |
| 后端 | Egg.js + TypeScript | API 服务 |
| 向量数据库 | ChromaDB | 文档向量存储与检索 |
| LLM | Ollama | 本地大语言模型 |
| Embedding | Ollama nomic-embed-text | 文本向量化 |

## 项目结构

```
rag/
├── server/                    # Egg.js TypeScript 后端
│   ├── app/
│   │   ├── controller/rag.ts  # SSE 流式聊天接口
│   │   ├── service/
│   │   │   ├── rag.ts         # RAG 核心流程
│   │   │   ├── ollama.ts      # Ollama API 封装
│   │   │   └── vectorStore.ts # ChromaDB 封装
│   │   ├── middleware/        # 错误处理中间件
│   │   └── router.ts         # 路由
│   ├── config/                # Egg.js 配置
│   └── typings/               # TypeScript 类型声明
├── scripts/
│   └── index-docs.ts          # 文档索引脚本
└── README.md
```
