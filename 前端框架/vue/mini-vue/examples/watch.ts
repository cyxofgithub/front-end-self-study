/**
 * watch 使用示例
 *
 * watch 用于监听响应式数据的变化并执行副作用，具有以下特性：
 * 1. 监听 getter 函数 —— watch(() => state.count, callback)
 * 2. 监听 reactive 对象 —— watch(state, callback)，默认深度监听
 * 3. immediate —— 立即执行一次 callback
 * 4. 返回 stop 函数 —— 停止监听
 * 5. onCleanup —— 清理上一次副作用（如取消请求）
 */
import { reactive, watch } from "../src";

// ==================== 示例 1：监听 getter ====================
const state = reactive({ count: 0 });

// watch 接收 getter 函数，依赖变化时执行 callback
// callback 签名: (newValue, oldValue, onCleanup) => void
watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(`count: ${oldVal} → ${newVal}`);
  }
);

state.count = 1;
// 输出: "count: 0 → 1"

state.count = 5;
// 输出: "count: 1 → 5"

// ==================== 示例 2：immediate 立即执行 ====================
const state2 = reactive({ name: "Vue" });

watch(
  () => state2.name,
  (newVal, oldVal) => {
    console.log(`name: ${oldVal} → ${newVal}`);
  },
  { immediate: true }
);
// 立即输出: "name: undefined → Vue"

state2.name = "Mini Vue";
// 输出: "name: Vue → Mini Vue"

// ==================== 示例 3：深度监听 reactive 对象 ====================
const state3 = reactive({
  user: {
    profile: {
      age: 25
    }
  }
});

watch(state3, (newVal, oldVal) => {
  console.log("深层属性变化被检测到");
  console.log("new age:", (newVal as any).user.profile.age);
});

state3.user.profile.age = 26;
// 输出: "深层属性变化被检测到"

// ==================== 示例 4：stop 停止监听 ====================
const state4 = reactive({ value: 0 });

const stop = watch(
  () => state4.value,
  (newVal, oldVal) => {
    console.log(`value: ${oldVal} → ${newVal}`);
  }
);

state4.value = 1;
// 输出: "value: 0 → 1"

stop();

state4.value = 2;
// 不会输出 —— 已停止监听

// ==================== 示例 5：onCleanup 清理副作用 ====================
const state5 = reactive({ keyword: "" });

watch(
  () => state5.keyword,
  (newVal, oldVal, onCleanup) => {
    let cancelled = false;
    onCleanup(() => {
      cancelled = true;
    });

    // 模拟异步请求
    const timer = setTimeout(() => {
      if (!cancelled) {
        console.log("搜索完成:", newVal);
      }
    }, 200);

    // 返回清理函数也是可以的，但 onCleanup 更规范
    return () => clearTimeout(timer);
  }
);

state5.keyword = "v";
state5.keyword = "vu";
state5.keyword = "vue";
// 只有最后一条 "vue" 会输出 "搜索完成"

// ==================== DOM 示例 ====================
const app = document.querySelector("#app");
if (app) {
  const demoState = reactive({
    keyword: "",
    count: 0
  });

  let html = `
    <div class="card">
      <h3>getter watch 示例</h3>
      <p>count: <span id="countVal">0</span></p>
      <button id="incBtn">count++</button>
      <div class="log" id="countLog"><p>日志：等待变化...</p></div>
    </div>
    <div class="card">
      <h3>deep watch 示例</h3>
      <p>keyword: <input id="keywordInput" type="text" placeholder="输入搜索关键词" /></p>
      <p>当前值: <span id="keywordVal"></span></p>
      <div class="log" id="keywordLog"><p>日志：等待输入...</p></div>
    </div>
    <div class="card">
      <h3>原理说明</h3>
      <ul>
        <li>watch 内部创建 <code>ReactiveEffect</code>，用 scheduler 作为 job</li>
        <li>依赖变化 → scheduler 执行 → 重新运行 getter 获取新值 → 调用 callback</li>
        <li>immediate: true → 首次立即执行 job，oldValue 为 undefined</li>
        <li>deep 选项 → getter 中递归访问所有属性来收集深层依赖</li>
      </ul>
    </div>
  `;
  app.innerHTML = html;

  const countLog = document.getElementById("countLog");
  const keywordLog = document.getElementById("keywordLog");

  let countCallCount = 0;
  watch(
    () => demoState.count,
    (newVal, oldVal) => {
      countCallCount++;
      const p = document.createElement("p");
      p.textContent = `[${countCallCount}] count: ${oldVal} → ${newVal}`;
      if (countLog) {
        countLog.appendChild(p);
      }
    }
  );

  let keywordTimer: ReturnType<typeof setTimeout>;
  watch(
    () => demoState.keyword,
    (newVal, oldVal, onCleanup) => {
      // 注册清理函数：下次 keyword 变化或组件卸载时调用
      onCleanup(() => {
        clearTimeout(keywordTimer);
      });

      // 模拟防抖搜索
      keywordTimer = setTimeout(() => {
        const p = document.createElement("p");
        p.textContent = `搜索: "${newVal}"`;
        if (keywordLog) {
          keywordLog.appendChild(p);
        }
      }, 500);
    }
  );

  document.getElementById("incBtn")?.addEventListener("click", () => {
    demoState.count++;
  });

  const keywordInput = document.getElementById("keywordInput") as HTMLInputElement;
  const keywordVal = document.getElementById("keywordVal");
  keywordInput?.addEventListener("input", () => {
    demoState.keyword = keywordInput.value;
    if (keywordVal) keywordVal.textContent = keywordInput.value;
  });
}
