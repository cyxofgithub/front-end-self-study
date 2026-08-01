## React vs Vue 全面对比

### 1. 核心设计理念

| 维度 | React | Vue |
|------|-------|-----|
| 定位 | 库（Library），只负责 UI 层 | 框架（Framework），提供渐进式解决方案 |
| 编程范式 | 函数式编程为主，不可变数据 | 声明式 + 响应式，可变数据 |
| 设计哲学 | 简单原语 + 社区生态解决问题 | 开箱即用，官方提供路由/状态管理等方案 |

### 2. 响应式机制

**React**：通过 `setState` / `useState` 触发重新渲染，依赖虚拟 DOM diff 找出变化。组件是"快照"，每次渲染都是一次全新的函数调用。需要通过 `useMemo`、`useCallback`、`React.memo` 等手段手动优化。

**Vue**：基于 Proxy 的响应式系统，精确追踪依赖。修改数据时，只有用到该数据的组件会重新渲染，无需手动优化。`ref` / `reactive` 自动收集依赖，组件级别的渲染粒度更细。

### 3. 模板语法 vs JSX

**React (JSX)**：
- JavaScript 的超集，可以在模板中写任意 JS 逻辑
- 灵活性极高，但可能导致模板逻辑与业务逻辑混在一起
- 所有东西都是 JavaScript 表达式

**Vue (SFC 单文件组件)**：
- template / script / style 分离，结构更清晰
- `v-if`、`v-for`、`v-model` 等指令，学习成本低
- 模板编译时能做静态分析优化（静态提升、预字符串化）

### 4. 状态管理

| 维度 | React | Vue |
|------|-------|-----|
| 内置方案 | `useState` + `useReducer` + Context | `ref` / `reactive` + `provide` / `inject` |
| 主流第三方 | Zustand、Redux Toolkit、Jotai | Pinia（官方推荐，取代 Vuex） |
| 不可变数据 | 强要求，必须返回新引用 | 不要求，直接修改即可追踪 |

### 5. 性能优化思路

**React**：
- 手动优化为主：`React.memo`、`useMemo`、`useCallback`、`useTransition`
- 并发渲染（Fiber 架构 + Scheduler）：可中断渲染，时间切片
- 需注意闭包陷阱和过期状态问题

**Vue**：
- 自动优化为主：响应式粒度细，默认就是按需更新
- 编译时优化：静态提升（hoistStatic）、PatchFlag 标记动态节点
- `shallowRef`、`v-once`、`v-memo` 用于特殊场景

### 6. 生态与社区

| 维度 | React | Vue |
|------|-------|-----|
| 社区规模 | 更大，就业市场岗位更多 | 国内活跃，中文生态好 |
| 类型支持 | TypeScript 支持成熟 | Vue 3 + TypeScript 体验大幅提升 |
| 移动端 | React Native | 无官方方案（社区有 uni-app 等） |
| SSR/SSG | Next.js（Vercel 维护） | Nuxt.js |
| UI 库 | Ant Design、MUI、shadcn/ui | Element Plus、Naive UI、Ant Design Vue |

### 7. 学习曲线

- **Vue**：对新手更友好，模板语法接近原生 HTML，API 设计渐进，可以先用 Options API 再用 Composition API
- **React**：心智模型较重，需要理解闭包、不可变数据、Hooks 规则、Fiber 调度等概念

### 8. 选型建议

| 场景 | 推荐 |
|------|------|
| 大型复杂应用、国际化团队 | React（生态丰富、人才池大） |
| 中小团队、国内项目、快速交付 | Vue（开发效率高、上手快） |
| 需要同时做 Web + 移动端 | React（React Native 生态成熟） |
| 已有旧项目技术栈 | 选现有栈，不混用 |
| 企业级后台管理系统 | 两者皆可，看团队熟悉度 |

---

> 更详细的 Diff 算法对比见 [React vs Vue diff 过程与区别](./React%20vs%20Vue%20diff%20过程与区别.md)

**一句话总结**：React 是"给你积木自己搭"的库，灵活但需要更多决策和优化意识；Vue 是"给你一整套方案"的框架，开发体验更顺畅但灵活性受框架约束。Vue 3 的 Composition API 在逻辑复用和组织上已经接近 React Hooks，两者的差异在缩小。
