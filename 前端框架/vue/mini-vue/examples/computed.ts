/**
 * computed 使用示例
 *
 * computed 是懒计算的响应式引用，具有以下特性：
 * 1. 懒求值（lazy）—— 只有被访问时才计算
 * 2. 缓存 —— 依赖不变时返回缓存值，不重复计算
 * 3. 可追踪 —— 在 effect 中使用时会自动收集依赖
 * 4. 可写（optional）—— 支持 get/set 形式的可写计算属性
 */
import { reactive, computed, effect } from "../src";

// ==================== 示例 1：基本 computed ====================
const state = reactive({ price: 100, quantity: 2 });

// computed 接收一个 getter 函数，只有读取 .value 时才计算
const total = computed(() => state.price * state.quantity);

console.log("computed 是懒求值的，此时 getter 还没执行过");

// 第一次访问 .value —— 此时才执行 getter
console.log("total.value:", total.value); // 200

// 再次访问 —— 返回缓存值，不重复执行 getter
console.log("total.value (cached):", total.value); // 200

// 修改依赖
state.quantity = 5;
// .value 仍然是缓存值（dirty 标记为 true，但还没重新计算）
console.log("修改 quantity 后访问 total.value:", total.value); // 500 (此时重新计算)

// ==================== 示例 2：computed 用在 effect 中 ====================
const state2 = reactive({ firstName: "John", lastName: "Doe" });

const fullName = computed(() => `${state2.firstName} ${state2.lastName}`);

// effect 中读取 computed.value —— computed 的依赖变化 → effect 重新执行
effect(() => {
  console.log("effect: fullName =", fullName.value);
});

// 修改依赖 → computed 标记为 dirty → effect 重新执行 → 读取时重新计算
state2.firstName = "Jane";
// effect 输出: "effect: fullName = Jane Doe"

// ==================== 示例 3：可写 computed（get + set）====================
const state3 = reactive({ firstName: "Hello", lastName: "World" });

const fullName2 = computed({
  get: () => `${state3.firstName} ${state3.lastName}`,
  set: (value: string) => {
    const [first, last] = value.split(" ");
    state3.firstName = first;
    state3.lastName = last;
  },
});

console.log("fullName2.value:", fullName2.value); // "Hello World"

fullName2.set("Mini Vue");

console.log("after set('Mini Vue'):");
console.log("  state3.firstName:", state3.firstName); // "Mini"
console.log("  state3.lastName:", state3.lastName); // "Vue"
console.log("  fullName2.value:", fullName2.value); // "Mini Vue"

// ==================== 示例 4：链式 computed ====================
const numbers = reactive({ value: 5 });

const doubled = computed(() => numbers.value * 2);
const quadrupled = computed(() => doubled.value * 2);
const formatted = computed(() => `结果: ${quadrupled.value}`);

effect(() => {
  console.log("formatted:", formatted.value);
});

// 修改一次 numbers.value
numbers.value = 10;
// 链式触发: numbers.value 变 → doubled dirty → quadrupled dirty → formatted dirty → effect 重跑
// 输出: "formatted: 结果: 40"

// ==================== DOM 示例 ====================
const app = document.querySelector("#app");
if (app) {
  const demoState = reactive({ count: 0 });

  const double = computed(() => demoState.count * 2);
  const isLarge = computed(() => demoState.count > 5);

  let html = `
    <div class="card">
      <h3>computed 示例</h3>
      <p>count: <span class="value" id="count">0</span></p>
      <p>double (computed): <span class="value" id="double">0</span></p>
      <p>isLarge (computed): <span class="value" id="isLarge">false</span></p>
      <button id="inc">count++</button>
      <button id="dec">count--</button>
    </div>
    <div class="card">
      <h3>原理说明</h3>
      <ul>
        <li>computed 初始化时 <code>_dirty = true</code></li>
        <li>首次读 .value 执行 getter 并缓存，标记 <code>_dirty = false</code></li>
        <li>依赖变化时 scheduler 标记 <code>_dirty = true</code> 并通知外层 effect</li>
        <li>外层 effect 重跑读取 .value 时才重新计算</li>
      </ul>
    </div>
  `;
  app.innerHTML = html;

  const incBtn = document.getElementById("inc");
  const decBtn = document.getElementById("dec");
  const countEl = document.getElementById("count");
  const doubleEl = document.getElementById("double");
  const isLargeEl = document.getElementById("isLarge");

  effect(() => {
    if (countEl) countEl.textContent = String(demoState.count);
  });
  effect(() => {
    if (doubleEl) doubleEl.textContent = String(double.value);
  });
  effect(() => {
    if (isLargeEl) isLargeEl.textContent = String(isLarge.value);
  });

  incBtn?.addEventListener("click", () => {
    demoState.count++;
  });
  decBtn?.addEventListener("click", () => {
    demoState.count--;
  });
}
