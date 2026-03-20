## vue 批量更新原理

Vue在面对多个连续的状态（数据）修改时，是如何把这些变化“合并”起来，只执行一次DOM更新，而不是每次修改都触发一次更新的——核心是通过「Watcher队列去重 + 异步批量执行」来实现合并，这也是Vue性能优化的核心逻辑之一。

### 核心实现逻辑：三步完成状态变化合并
Vue合并连续状态变化的核心在`queueWatcher`方法（Vue2源码），整个过程可以拆解为3个关键步骤，结合简化版源码能更直观理解：

#### 步骤1：数据变化触发Watcher，进入入队流程
当你修改Vue的响应式数据（如`this.a=1; this.a=2; this.b=3`），会触发数据的`setter`，进而通知对应的`Watcher`（每个组件/计算属性对应一个Watcher）：
- 每个Watcher都有唯一的`id`，这是去重的关键；
- 触发Watcher后，不会立即执行更新，而是调用`queueWatcher`将Watcher加入队列。

#### 步骤2：queueWatcher核心——入队+去重（合并的关键）
`queueWatcher`的核心作用是：**确保同一个Watcher只在队列中出现一次**，即使连续触发多次，也只会保留一个，从而实现“多次状态变化合并为一次更新”。

以下是`queueWatcher`的简化版核心代码：
```javascript
// 存储待执行的Watcher队列
const queue = [];
// 用于快速判断Watcher是否已入队（去重）
const has = {};
// 标志位：是否已创建异步任务（避免重复创建）
let waiting = false;

/**
 * 将Watcher加入队列（去重）
 * @param {Watcher} watcher - 待执行的Watcher实例
 */
function queueWatcher(watcher) {
  const id = watcher.id;

  // 核心：去重——如果该Watcher已在队列中，直接返回，不重复添加
  if (!has[id]) {
    has[id] = true; // 标记为已入队
    queue.push(watcher); // 加入队列

    // 只创建一次异步任务，避免多次调用nextTick
    if (!waiting) {
      waiting = true;
      // 通过nextTick创建微任务，批量执行队列中的Watcher
      nextTick(flushSchedulerQueue);
    }
  }
}
```

#### 步骤3：flushSchedulerQueue——异步批量执行更新
`flushSchedulerQueue`是最终执行更新的函数，会在`nextTick`的微任务中执行，核心是遍历队列中的所有Watcher，执行diff和DOM更新：
```javascript
function flushSchedulerQueue() {
  // 1. 排序：保证父组件Watcher先执行，子组件后执行；用户Watcher先于内置Watcher
  queue.sort((a, b) => a.id - b.id);

  // 2. 遍历执行所有Watcher的更新逻辑（diff + DOM更新）
  for (let i = 0; i < queue.length; i++) {
    const watcher = queue[i];
    watcher.run(); // 执行Watcher的更新：触发组件的diff比对，更新DOM

    // 3. 清除标记，为下一次更新做准备
    has[watcher.id] = null;
  }

  // 4. 重置状态
  queue.length = 0;
  has = {};
  waiting = false;
}
```

### 实际场景验证：连续修改数据的合并过程
举个具体例子，你连续修改同一个组件的多个数据：
```vue
<template>
  <p>{{ a }} - {{ b }}</p>
  <button @click="updateData">连续修改数据</button>
</template>

<script>
export default {
  data() { return { a: 1, b: 2 } },
  methods: {
    updateData() {
      // 连续修改3次状态
      this.a = 10; // 触发Watcher，入队（has[id]=true）
      this.a = 20; // 触发Watcher，已入队，直接返回（合并）
      this.b = 30; // 同一组件的Watcher已入队，直接返回（合并）

      // 同步阶段：DOM仍为旧值
      console.log('同步阶段:', this.$refs.p?.textContent); // 1 - 2

      // 微任务阶段：执行flushSchedulerQueue，只更新一次DOM
      this.$nextTick(() => {
        console.log('nextTick:', this.$refs.p?.textContent); // 20 - 30
      });
    }
  }
};
</script>
```

这个例子的完整合并流程：
1. 执行`this.a=10`：触发Watcher，`has[id]`为false，入队并创建微任务；
2. 执行`this.a=20`：触发Watcher，`has[id]`为true，直接返回（合并）；
3. 执行`this.b=30`：触发同一个组件的Watcher，`has[id]`为true，直接返回（合并）；
4. 同步代码执行完后，微任务触发`flushSchedulerQueue`：执行一次Watcher.run()，完成diff和DOM更新；
5. 你的`nextTick`回调执行，拿到最终的更新后DOM。

### 总结
Vue合并多个连续状态变化的核心要点：
1. **去重机制**：通过`has`对象记录Watcher的入队状态，确保同一个Watcher只入队一次，即使连续触发多次也只会执行一次更新；
2. **队列收集**：所有需要更新的Watcher被收集到`queue`队列中，而非立即执行；
3. **异步批量执行**：通过`nextTick`创建单个微任务，等所有同步状态修改完成后，一次性执行队列中的所有Watcher，完成DOM更新。

这三个机制共同保证了“多次连续的状态变化，最终只触发一次DOM更新”，极大减少了不必要的DOM操作，提升了Vue的性能。