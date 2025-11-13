import { RAGApplication } from '../rag.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 场景1：知识库问答系统
 *
 * 这个场景演示如何使用 RAG 构建一个知识库问答系统
 * 用户可以基于提供的文档进行问答
 */

async function main() {
    console.log('📚 场景1：知识库问答系统\n');

    // 创建 RAG 应用实例
    const rag = new RAGApplication({
        chunkSize: 500,
        chunkOverlap: 50,
        topK: 3,
    });

    // 示例文档（实际应用中可以从文件加载）
    const documents = [
        {
            name: 'React Hooks 文档',
            content: `
React Hooks 是 React 16.8 引入的新特性，允许你在函数组件中使用状态和其他 React 特性。

useState Hook 用于在函数组件中添加状态。它返回一个数组，包含当前状态值和一个更新状态的函数。

useEffect Hook 用于在函数组件中执行副作用操作，如数据获取、订阅或手动修改 DOM。它相当于 componentDidMount、componentDidUpdate 和 componentWillUnmount 的组合。

useContext Hook 用于在组件树中共享数据，避免通过 props 逐层传递。

useReducer Hook 是 useState 的替代方案，适用于复杂的状态逻辑。它接受一个 reducer 函数和初始状态，返回当前状态和 dispatch 方法。

自定义 Hook 是一个以 "use" 开头的 JavaScript 函数，可以调用其他 Hook。它允许你提取组件逻辑到可重用的函数中。
            `.trim(),
        },
        {
            name: 'Vue 3 文档',
            content: `
Vue 3 是 Vue.js 的最新版本，引入了 Composition API，提供了更好的逻辑复用和代码组织方式。

ref 用于创建响应式的基本类型值。使用 .value 访问和修改值。

reactive 用于创建响应式对象。可以直接访问和修改属性，无需 .value。

computed 用于创建计算属性，基于响应式数据自动更新。

watch 和 watchEffect 用于监听响应式数据的变化并执行副作用。

生命周期钩子包括 onMounted、onUpdated、onUnmounted 等，对应 Vue 2 的生命周期钩子。

组合式函数（Composables）类似于 React Hooks，用于提取和复用逻辑。
            `.trim(),
        },
        {
            name: 'JavaScript 异步编程',
            content: `
Promise 是 JavaScript 中处理异步操作的对象。它有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。

async/await 是 Promise 的语法糖，使异步代码看起来像同步代码。async 函数返回一个 Promise，await 用于等待 Promise 完成。

Promise.all() 用于等待多个 Promise 全部完成，如果有一个失败则整体失败。

Promise.allSettled() 等待所有 Promise 完成，无论成功或失败。

Promise.race() 返回第一个完成的 Promise，无论成功或失败。

错误处理可以使用 try/catch 或 .catch() 方法。
            `.trim(),
        },
    ];

    // 初始化 RAG 应用
    await rag.initialize(documents);

    // 示例问题
    const questions = [
        'React Hooks 是什么？',
        'useState 和 useReducer 有什么区别？',
        'Vue 3 的 ref 和 reactive 有什么区别？',
        '如何使用 async/await 处理异步操作？',
        'Promise.all 和 Promise.race 的区别是什么？',
    ];

    // 逐个回答问题
    for (const question of questions) {
        const result = await rag.ask(question);

        console.log(`\n💡 AI 回答:`);
        console.log(result.answer);
        console.log(`\n📚 参考来源:`);
        result.sources.forEach((source, index) => {
            console.log(
                `  ${index + 1}. [${source.metadata.source}] (相似度: ${(
                    source.score * 100
                ).toFixed(2)}%)`
            );
        });

        console.log('\n' + '-'.repeat(60) + '\n');
    }
}

main().catch(console.error);
