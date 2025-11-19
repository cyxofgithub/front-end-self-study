# LangGraph.js 工作流

LangGraph.js 是 LangChain 的扩展，用于构建基于状态机（State Machine）的复杂 AI 工作流。它允许你创建可控、可预测的代理（Agent）执行流程，支持条件分支、循环、错误恢复等高级功能。

---

## 核心概念

### 1. 图（Graph）

图是工作流的基础结构，由节点（Nodes）和边（Edges）组成，定义了代理的执行路径。

### 2. 状态（State）

状态是工作流中传递的数据结构，可以在节点之间共享和修改。

### 3. 节点（Nodes）

节点是工作流中的执行单元，每个节点执行特定的任务（如调用 LLM、执行工具等）。

### 4. 边（Edges）

边定义了节点之间的连接关系，可以是条件边（根据状态决定路径）或普通边（固定路径）。

---

## 1. 状态机设计

状态机是 LangGraph 的核心，通过定义状态结构和状态转换规则来控制工作流的执行。

### 基本状态定义

```typescript
import { StateGraph, END, START } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';

// 定义状态接口
interface AgentState {
    messages: BaseMessage[];
    next: string;
    iterations: number;
}

// 创建状态图
const workflow = new StateGraph<AgentState>({
    channels: {
        messages: {
            reducer: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
            default: () => [],
        },
        next: {
            default: () => 'continue',
        },
        iterations: {
            default: () => 0,
        },
    },
});
```

### 状态更新节点

```typescript
// 定义节点函数
const agentNode = async (state: AgentState) => {
    const { messages } = state;

    // 调用 LLM
    const response = await model.invoke(messages);

    // 更新状态
    return {
        messages: [response],
        iterations: state.iterations + 1,
    };
};

// 添加节点到图
workflow.addNode('agent', agentNode);
```

### 状态持久化

```typescript
import { MemorySaver } from '@langchain/langgraph';

// 使用内存存储状态
const memory = new MemorySaver();

// 编译图并配置检查点
const app = workflow.compile({
    checkpointer: memory,
});

// 运行工作流并保存状态
const config = { configurable: { thread_id: 'thread-1' } };
const result = await app.invoke(
    { messages: [new HumanMessage('Hello')] },
    config
);
```

---

## 2. 条件分支与循环

条件分支允许根据当前状态动态决定下一步执行路径，循环则可以实现迭代处理。

### 条件边（Conditional Edges）

```typescript
import { START, END } from '@langchain/langgraph';

// 条件路由函数
const shouldContinue = (state: AgentState): string => {
    const { messages, iterations } = state;
    const lastMessage = messages[messages.length - 1];

    // 检查是否包含工具调用
    if (lastMessage.additional_kwargs?.tool_calls) {
        return 'tools'; // 需要调用工具
    }

    // 检查迭代次数
    if (iterations >= 10) {
        return END; // 达到最大迭代次数，结束
    }

    return 'agent'; // 继续代理处理
};

// 添加条件边
workflow.addEdge(START, 'agent');
workflow.addConditionalEdges('agent', shouldContinue, {
    tools: 'tool_executor',
    agent: 'agent',
    [END]: END,
});
workflow.addEdge('tool_executor', 'agent');
```

### 循环实现

```typescript
// 循环处理示例：直到满足条件才退出
const processUntilComplete = async (state: AgentState) => {
    let currentState = state;
    let maxIterations = 20;

    while (maxIterations > 0) {
        // 检查是否完成
        if (currentState.next === 'end') {
            break;
        }

        // 执行处理
        currentState = await processNode(currentState);
        maxIterations--;
    }

    return currentState;
};

// 使用条件边实现循环
const checkCompletion = (state: AgentState): string => {
    if (state.next === 'end' || state.iterations >= 20) {
        return END;
    }
    return 'process';
};

workflow.addConditionalEdges('process', checkCompletion, {
    process: 'process',
    [END]: END,
});
```

// todo-learn

### 多路径分支

```typescript
// 复杂分支逻辑
const routeByIntent = (state: AgentState): string => {
    const lastMessage = state.messages[state.messages.length - 1];
    const content = lastMessage.content.toLowerCase();

    if (content.includes('搜索') || content.includes('查询')) {
        return 'search';
    } else if (content.includes('计算') || content.includes('数学')) {
        return 'calculator';
    } else if (content.includes('生成') || content.includes('创作')) {
        return 'generator';
    } else {
        return 'general';
    }
};

workflow.addConditionalEdges('router', routeByIntent, {
    search: 'search_tool',
    calculator: 'calc_tool',
    generator: 'generate_tool',
    general: 'agent',
});
```

---

## 3. 复杂决策树

决策树用于实现多层次的复杂决策逻辑，可以根据不同条件执行不同的处理路径。

### 多级决策树

```typescript
// 第一级决策：任务类型
const taskTypeRouter = (state: AgentState): string => {
    const intent = analyzeIntent(state.messages);

    if (intent === 'question') return 'qa_flow';
    if (intent === 'action') return 'action_flow';
    if (intent === 'creative') return 'creative_flow';
    return 'default_flow';
};

// 第二级决策：QA 流程中的子决策
const qaSubRouter = (state: AgentState): string => {
    const question = extractQuestion(state.messages);

    if (needsWebSearch(question)) return 'web_search';
    if (needsDatabase(question)) return 'db_query';
    if (needsCalculation(question)) return 'calculator';
    return 'direct_answer';
};

// 构建多级决策树
workflow.addConditionalEdges('entry', taskTypeRouter, {
    qa_flow: 'qa_router',
    action_flow: 'action_router',
    creative_flow: 'creative_router',
    default_flow: 'general_handler',
});

workflow.addConditionalEdges('qa_router', qaSubRouter, {
    web_search: 'search_node',
    db_query: 'db_node',
    calculator: 'calc_node',
    direct_answer: 'answer_node',
});
```

### 动态决策树

```typescript
// 根据上下文动态构建决策路径
const buildDynamicPath = async (state: AgentState) => {
    // 分析当前状态
    const context = await analyzeContext(state);

    // 根据上下文动态决定路径
    if (context.complexity === 'high') {
        return {
            path: ['plan', 'execute', 'review'],
            requiresApproval: true,
        };
    } else {
        return {
            path: ['execute'],
            requiresApproval: false,
        };
    }
};

// 动态路由节点
const dynamicRouter = async (state: AgentState) => {
    const pathConfig = await buildDynamicPath(state);

    return {
        ...state,
        path: pathConfig.path,
        requiresApproval: pathConfig.requiresApproval,
    };
};
```

### 决策树可视化

```typescript
// 记录决策路径用于调试和可视化
interface DecisionLog {
    node: string;
    decision: string;
    reason: string;
    timestamp: number;
}

const decisionLogger = (
    state: AgentState,
    decision: string,
    reason: string
) => {
    const log: DecisionLog = {
        node: state.currentNode || 'unknown',
        decision,
        reason,
        timestamp: Date.now(),
    };

    return {
        ...state,
        decisionLogs: [...(state.decisionLogs || []), log],
    };
};
```

---

## 4. 错误恢复机制

错误恢复机制确保工作流在遇到异常时能够优雅地处理并继续执行，而不是直接失败。

### 基础错误处理

```typescript
import { Annotation } from '@langchain/langgraph';

// 扩展状态以包含错误信息
interface AgentStateWithError extends AgentState {
    errors: Array<{ node: string; error: string; timestamp: number }>;
    retryCount: number;
}

// 带错误处理的节点
const safeNode = async (state: AgentStateWithError) => {
    try {
        // 执行主要逻辑
        const result = await riskyOperation(state);
        return {
            ...state,
            errors: [], // 清除之前的错误
        };
    } catch (error) {
        // 记录错误
        const errorLog = {
            node: 'safeNode',
            error: error.message,
            timestamp: Date.now(),
        };

        return {
            ...state,
            errors: [...(state.errors || []), errorLog],
        };
    }
};
```

### 重试机制

```typescript
// 带重试的节点执行
const retryableNode = async (
    state: AgentStateWithError,
    maxRetries: number = 3
) => {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < maxRetries) {
        try {
            const result = await performOperation(state);
            return {
                ...state,
                retryCount: attempts,
                errors: [],
            };
        } catch (error) {
            lastError = error as Error;
            attempts++;

            // 指数退避
            await new Promise((resolve) =>
                setTimeout(resolve, Math.pow(2, attempts) * 1000)
            );
        }
    }

    // 所有重试都失败，返回错误状态
    return {
        ...state,
        errors: [
            ...(state.errors || []),
            {
                node: 'retryableNode',
                error: `Failed after ${maxRetries} attempts: ${lastError?.message}`,
                timestamp: Date.now(),
            },
        ],
        retryCount: attempts,
    };
};
```

### 错误恢复路由

```typescript
// 根据错误类型决定恢复策略
const errorRecoveryRouter = (state: AgentStateWithError): string => {
    const lastError = state.errors?.[state.errors.length - 1];

    if (!lastError) {
        return 'continue'; // 没有错误，继续执行
    }

    // 根据错误类型选择恢复策略
    if (lastError.error.includes('rate limit')) {
        return 'wait_and_retry'; // 速率限制，等待后重试
    } else if (lastError.error.includes('timeout')) {
        return 'simplify_and_retry'; // 超时，简化任务后重试
    } else if (lastError.error.includes('invalid')) {
        return 'validate_and_retry'; // 无效输入，验证后重试
    } else if (state.retryCount >= 3) {
        return 'fallback'; // 重试次数过多，使用备用方案
    } else {
        return 'retry'; // 默认重试
    }
};

// 添加错误恢复边
workflow.addConditionalEdges('error_handler', errorRecoveryRouter, {
    continue: 'next_node',
    wait_and_retry: 'wait_node',
    simplify_and_retry: 'simplify_node',
    validate_and_retry: 'validate_node',
    retry: 'retry_node',
    fallback: 'fallback_node',
});
```

### 回退（Fallback）机制

```typescript
// 备用处理节点
const fallbackNode = async (state: AgentStateWithError) => {
    // 使用更简单、更可靠的方法
    const simplifiedResult = await simplifiedOperation(state);

    return {
        ...state,
        messages: [
            ...state.messages,
            new AIMessage(
                `由于遇到技术问题，我使用了简化方法：${simplifiedResult}`
            ),
        ],
        errors: [], // 清除错误，继续执行
    };
};

// 降级处理
const degradedOperation = async (state: AgentStateWithError) => {
    try {
        // 尝试完整功能
        return await fullFeatureOperation(state);
    } catch (error) {
        // 降级到基础功能
        console.warn('降级到基础功能', error);
        return await basicFeatureOperation(state);
    }
};
```

### 检查点与状态恢复

```typescript
import { MemorySaver } from '@langchain/langgraph';

const memory = new MemorySaver();

// 在关键节点设置检查点
const checkpointNode = async (state: AgentStateWithError) => {
    // 执行操作前保存状态
    await memory.put('checkpoint', state);

    try {
        const result = await riskyOperation(state);
        return result;
    } catch (error) {
        // 恢复到最后一次检查点
        const savedState = await memory.get('checkpoint');
        return {
            ...savedState,
            errors: [
                ...(savedState.errors || []),
                {
                    node: 'checkpointNode',
                    error: error.message,
                    timestamp: Date.now(),
                },
            ],
        };
    }
};
```

---

## 5. 完整示例：智能客服工作流

结合以上概念，构建一个完整的智能客服工作流示例：

```typescript
import { StateGraph, END, START } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { MemorySaver } from '@langchain/langgraph';

// 定义状态
interface CustomerServiceState {
    messages: BaseMessage[];
    intent: string | null;
    requiresHuman: boolean;
    retryCount: number;
    errors: Array<{ node: string; error: string }>;
}

// 初始化模型
const model = new ChatOpenAI({
    modelName: 'gpt-4',
    temperature: 0.7,
});

// 创建状态图
const workflow = new StateGraph<CustomerServiceState>({
    channels: {
        messages: {
            reducer: (x, y) => x.concat(y),
            default: () => [],
        },
        intent: { default: () => null },
        requiresHuman: { default: () => false },
        retryCount: { default: () => 0 },
        errors: { default: () => [] },
    },
});

// 1. 意图识别节点
const intentRecognition = async (state: CustomerServiceState) => {
    try {
        const lastMessage = state.messages[state.messages.length - 1];
        const response = await model.invoke([
            new SystemMessage('识别用户意图：问题咨询、投诉、建议、其他'),
            lastMessage,
        ]);

        const intent = extractIntent(response.content);
        return { intent };
    } catch (error) {
        return {
            errors: [
                ...state.errors,
                { node: 'intentRecognition', error: error.message },
            ],
            intent: 'unknown',
        };
    }
};

// 2. 路由节点
const routeByIntent = (state: CustomerServiceState): string => {
    if (state.requiresHuman) return 'human_agent';
    if (state.intent === 'complaint') return 'complaint_handler';
    if (state.intent === 'question') return 'qa_handler';
    if (state.intent === 'suggestion') return 'suggestion_handler';
    return 'general_handler';
};

// 3. QA 处理节点
const qaHandler = async (state: CustomerServiceState) => {
    try {
        const response = await model.invoke([
            ...state.messages,
            new SystemMessage('作为客服助手，友好地回答用户问题'),
        ]);
        return { messages: [response] };
    } catch (error) {
        if (state.retryCount < 2) {
            return { retryCount: state.retryCount + 1 };
        }
        return {
            requiresHuman: true,
            errors: [
                ...state.errors,
                { node: 'qaHandler', error: error.message },
            ],
        };
    }
};

// 4. 错误恢复节点
const errorRecovery = (state: CustomerServiceState): string => {
    if (state.errors.length === 0) return 'continue';
    if (state.retryCount >= 3) return 'escalate';
    return 'retry';
};

// 构建工作流
workflow.addNode('intent_recognition', intentRecognition);
workflow.addNode('qa_handler', qaHandler);
workflow.addNode('complaint_handler', complaintHandler);
workflow.addNode('suggestion_handler', suggestionHandler);
workflow.addNode('general_handler', generalHandler);
workflow.addNode('human_agent', humanAgentNode);
workflow.addNode('error_recovery', errorRecoveryNode);

workflow.addEdge(START, 'intent_recognition');
workflow.addConditionalEdges('intent_recognition', routeByIntent, {
    qa_handler: 'qa_handler',
    complaint_handler: 'complaint_handler',
    suggestion_handler: 'suggestion_handler',
    general_handler: 'general_handler',
    human_agent: 'human_agent',
});

workflow.addConditionalEdges('qa_handler', errorRecovery, {
    continue: END,
    retry: 'qa_handler',
    escalate: 'human_agent',
});

// 编译并运行
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const result = await app.invoke(
    {
        messages: [new HumanMessage('我的订单什么时候能到？')],
    },
    { configurable: { thread_id: 'customer-123' } }
);
```

---

## 6. 最佳实践

### 1. 状态设计原则

-   **最小化状态**：只保留必要的数据
-   **不可变性**：状态更新应该返回新对象，而不是修改原对象
-   **类型安全**：使用 TypeScript 定义清晰的状态接口

### 2. 节点设计原则

-   **单一职责**：每个节点只做一件事
-   **错误处理**：每个节点都应该有错误处理逻辑
-   **幂等性**：节点应该可以安全地重复执行

### 3. 性能优化

-   **并行执行**：使用 `addEdge` 创建并行路径
-   **缓存结果**：对重复计算进行缓存
-   **批量处理**：合并多个操作减少 API 调用

### 4. 调试技巧

-   **状态检查点**：在关键节点保存状态
-   **日志记录**：记录决策路径和错误信息
-   **可视化**：使用 LangGraph Studio 可视化工作流

---

## 学习资源

-   [LangGraph.js 官方文档](https://js.langchain.com/docs/langgraph)
-   [LangGraph.js API 参考](https://api.js.langchain.com/)
-   [LangGraph.js 教程](https://js.langchain.com/docs/langgraph/tutorials)
-   [LangGraph Studio](https://langchain-ai.github.io/langgraph-studio/) - 可视化工作流编辑器

---

## 总结

LangGraph.js 工作流提供了强大的工具来构建复杂的 AI 应用：

1. **状态机设计**：通过定义状态和状态转换来控制执行流程
2. **条件分支与循环**：实现动态路由和迭代处理
3. **复杂决策树**：支持多层次的决策逻辑
4. **错误恢复机制**：确保工作流的健壮性和可靠性

掌握这些概念后，你可以构建出生产级别的、可控的 AI 应用系统。
