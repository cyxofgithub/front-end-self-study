## AI SDK

### 什么是 OpenAI SDK？

OpenAI SDK 是官方提供的一套工具包，让开发者可以用代码直接调用 OpenAI 的大模型 API（如 GPT-3.5/4，进行智能对话、文本生成等）。熟悉并掌握 OpenAI SDK，可以让你把强大的 AI 能力快速集成到自己的应用或产品中。

---

#### 学习要点（结合上方学习路径内容）

-   **API Key 配置与管理**：每一次调用 OpenAI API 都需安全地配置 API Key，确保密钥不暴露在前端代码或公开仓库。
-   **基础 API 调用（Chat Completions）**：利用官方 SDK 快速发起对话生成请求，获取模型回复。
-   **参数调优**：通过调整 `temperature`、`max_tokens`、`top_p` 等参数，控制生成内容的多样性与长度。
-   **错误处理与重试机制**：在网络波动、额度不足等异常情况下，合理处理错误并自动重试。

---

#### 实用代码示例

以 Node.js 环境为例，下面演示如何用 OpenAI 官方 SDK 发起简单对话、调节参数、处理常见错误：

```js
// 安装依赖：npm install openai
const { OpenAI } = require('openai');

// 一般把 API Key 存在环境变量，避免硬编码泄漏
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function chatWithGPT() {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // 选择模型
            messages: [{ role: 'user', content: '你好，请用一句话介绍自己。' }],
            temperature: 0.7, // temperature 控制生成内容的“随机性”：值越高回复越活跃多变，越低则更严谨可控
            max_tokens: 100, // 限制单次回复最大长度
            top_p: 1, // 采样参数，控制生成文本的多样性（nucleus sampling，值越小输出越集中、越大越多样，一般建议与 temperature 配合调整）
        });
        console.log('AI 回复：', response.choices[0].message.content);
    } catch (error) {
        // 错误处理与重试机制示例
        if (error.response) {
            console.error(
                '请求失败',
                error.response.status,
                error.response.data
            );
        } else {
            console.error('请求异常', error.message);
        }
        // 这里可以按需实现重试逻辑
    }
}

chatWithGPT();
```

**提示：**

-   API Key 请妥善保管，建议用 `.env` 文件或云端密钥管理服务存储，并加入 `.gitignore`。
-   SDK 还支持流式响应、图片生成等功能，可查阅[OpenAI 官方文档](https://platform.openai.com/docs)进一步学习。

---

### Vercel AI SDK 简介

Vercel AI SDK 是专为前端和全栈应用场景设计的开源工具集，适配 React、Next.js 等主流框架。它能够让你在客户端或服务端轻松调用 OpenAI、Anthropic、Azure 等主流大模型服务，并提供了流式响应、消息缓存、React Hooks 等开发体验优化。

**常用特性：**

-   `useChat`、`useCompletion` 等 React Hooks，前端即可直接集成聊天/补全功能；
-   开箱即用的流式输出支持，边生成边渲染；
-   多家模型厂商切换，不改业务代码；
-   内置错误处理、消息管理、实时加载提示等能力。

文档与教程：[Vercel AI SDK 官方文档](https://sdk.vercel.ai/docs)

**简单示例（React 组件中使用 useChat Hook）：**

```jsx
import { useChat } from 'ai/react';

export default function ChatComponent() {
    // 添加了 model 选项及更详细参数设置
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
    } = useChat({
        api: '/api/chat', // 自定义后端接口，需在 /api/chat 实现对 OpenAI（或别的厂商）的转发
        body: {
            model: 'gpt-3.5-turbo', // 指定所用模型
            max_tokens: 100,
            temperature: 0.7,
            top_p: 1,
        },
        // 其他 hooks 配置选项可参考官方文档
    });

    return (
        <form onSubmit={handleSubmit}>
            <ul>
                {messages.map((m) => (
                    <li key={m.id}>
                        <b>{m.role === 'user' ? '我' : 'AI'}:</b> {m.content}
                    </li>
                ))}
            </ul>
            <input
                value={input}
                onChange={handleInputChange}
                placeholder="请输入你的问题…"
                disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? '发送中...' : '发送'}
            </button>
            {error && (
                <div style={{ color: 'red' }}>发生错误：{error.message}</div>
            )}
        </form>
    );
}
```

**提示：**

-   服务端需提供 API 路由对接 OpenAI 等模型，这样前端请求可安全传递 Key、同时实现流式响应。
-   推荐在 Next.js、Vercel 平台部署体验最佳。
-

### vercel sdk 和 openai sdk 有什么区别
Vercel AI SDK 和 OpenAI SDK 主要区别如下：

- **定位与适用场景不同**  
    - **OpenAI SDK**：官方提供的 JavaScript/TypeScript 客户端，仅用于和 OpenAI API 通信（如 chat、completions、embeddings 等），支持 Node.js 和浏览器环境。适合直接操作 OpenAI 平台各项能力。
    - **Vercel AI SDK**：Vercel 团队推出的前后端集成 SDK，主打“流式（Streaming）”与“多模型适配”。适用于 React（包括 Next.js、Vercel App），不仅可连接 OpenAI，还可平滑适配 Azure OpenAI、Anthropic、Google Gemini、百度文心等多种 AI 服务。配合 React Hooks，可极大简化流式聊天前后端集成开发。

- **功能差异和易用性**
    - **OpenAI SDK**：仅为 API 调用封装，需自行处理流式响应、前后端传递、权限、状态管理等。
    - **Vercel AI SDK**：包含了流式响应、前后端路由适配、useChat/useCompletion 等 Hooks（状态、消息、loading/error 等）。开发聊天/对话类前端非常高效。

- **示例对比**  
    - OpenAI SDK 用法示例（Node.js）：  
      ```js
      import { OpenAI } from "openai";
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const resp = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "帮我写个 React 组件！" }],
      });
      ```
    - Vercel AI SDK 用法示例（前端 React）：  
      ```js
      import { useChat } from 'ai/react';
      // 见上方完整示例，可直接用于聊天 UI 开发
      ```

- **总结**  
    - 如果只对接 OpenAI 且项目偏后端/Node.js，可以直接用 OpenAI SDK。
    - 前端开发、追求多模型适配、流式体验、快速原型，建议优先用 Vercel AI SDK。

