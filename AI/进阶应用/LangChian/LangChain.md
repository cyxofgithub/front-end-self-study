## LangChain.js 核心内容讲解（含代码示例）

在 LangChain.js 的进阶应用中，你需要掌握如下核心功能。以下结合代码示例帮助理解：

---

### 1. Chains（链式调用）

Chains 用于将多个任务或模型调用串联起来，自动完成多步骤推理。

```js
import { LLMChain, PromptTemplate } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';

const prompt = PromptTemplate.fromTemplate('用一句话介绍：{topic}');
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
});
const chain = new LLMChain({ llm: model, prompt });

const result = await chain.call({ topic: 'LangChain' });
console.log(result.text);
// 输出：LangChain 是用于构建大语言模型应用的开发框架。
```

---

### 2. Prompts（提示词模板）

提示词模板可以灵活插入变量和复用，极大提升 LLM 指令工程能力。

```js
import { PromptTemplate } from 'langchain/prompts';

const prompt = new PromptTemplate({
    template: '请用 {style} 风格写一段关于 {topic} 的介绍',
    inputVariables: ['style', 'topic'],
});

const formatted = await prompt.format({
    style: '幽默',
    topic: 'LangChain',
});

console.log(formatted);
// 输出：请用 幽默 风格写一段关于 LangChain 的介绍
```

---

### 3. Memory（对话记忆）

Memory 用于保留对话历史，实现有记忆的多轮对话。

```js
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';

const memory = new BufferMemory();
const chain = new ConversationChain({
    llm: new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY }),
    memory,
});

await chain.call({ input: '你好，你是谁？' });
const response = await chain.call({ input: '再告诉我一下你能做什么？' });

console.log(response.response);
// 输出：我是一个 AI，可以帮助你查询信息、写作等。
```

---

### 4. Agents（智能代理）

Agents 让模型学会自主决策，选择并调用合适工具处理复杂任务。

```js
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { SerpAPI, Calculator } from 'langchain/tools'; // 以Web搜索和计算为例

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
});
const tools = [new SerpAPI(), new Calculator()];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'openai-functions',
});

const result = await executor.run('帮我查下北京天气，结果再加上128');
console.log(result);
// 输出类似：“北京今天天气为26°C，26+128=154”
```

---

### 5. Tools（工具集成）

Tools 可扩展调用 Web API、数据库等第三方服务，让大模型具备实际操作能力。

```js
import { DynamicTool } from 'langchain/tools';

const echoTool = new DynamicTool({
    name: 'Echo',
    description: '返回输入文本本身',
    func: async (input) => input,
});

console.log(await echoTool.call('Hello LangChain!'));
// 输出：Hello LangChain!
```

---

以上就是 LangChain.js 进阶应用中你必须掌握的核心内容和典型用法示例。建议在实际项目中尝试组合这些模块，能更深刻理解其强大之处。
