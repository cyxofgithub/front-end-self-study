/**
 * 熔断 / 重试 / 超时 / 降级 —— 最小可运行演示
 *
 * 场景：订单服务调用「库存服务」扣库存，库存服务突发故障（前 6 次调用失败，之后恢复）。
 * 重点看输出里熔断器状态怎么流转：CLOSED → OPEN → HALF_OPEN → CLOSED。
 *
 * 运行：node demo.js
 */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── 1. 超时：超过 deadline 就失败，绝不无限等 ─────────────────────────
function withTimeout(fn, ms = 1000) {
  return Promise.race([
    fn(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('调用超时')), ms)),
  ]);
}

// ── 2. 重试：指数退避 + 抖动，限制次数 ────────────────────────────────
async function withRetry(fn, { max = 1, base = 80, jitter = 40 } = {}) {
  for (let attempt = 0; attempt <= max; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === max) throw err; // 最后一次也失败，放弃
      const delay = base * 2 ** attempt + Math.random() * jitter; // 退避 + 抖动
      await sleep(delay);
    }
  }
}

// ── 3. 熔断器：连续失败超阈值就「拉闸」，冷却后放一个探测请求 ─────────
class CircuitBreaker {
  constructor({ failureThreshold = 3, cooldownMs = 1200 } = {}) {
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.state = 'CLOSED'; // CLOSED | OPEN | HALF_OPEN
    this.failures = 0;
    this.openedAt = 0;
  }

  setState(next) {
    if (next !== this.state) {
      console.log(`        └─ 状态迁移：${this.state} → ${next}`);
      this.state = next;
    }
  }

  async call(fn) {
    // OPEN 且还没冷却完 → 快速失败，根本不调下游（这是熔断的价值）
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt < this.cooldownMs) {
        throw new Error('熔断中：快速失败，不调下游');
      }
      this.setState('HALF_OPEN'); // 冷却结束，放一个探测请求
    }

    try {
      const result = await fn();
      this.failures = 0; // 成功就复位
      this.setState('CLOSED');
      return result;
    } catch (err) {
      this.failures++;
      // 探测失败，或连续失败达到阈值 → 拉闸
      if (this.state === 'HALF_OPEN' || this.failures >= this.failureThreshold) {
        this.setState('OPEN');
        this.openedAt = Date.now();
      }
      throw err;
    }
  }
}

// ── 模拟下游：库存服务前 6 次调用失败，之后恢复 ──────────────────────
let callCount = 0;
async function inventoryService() {
  callCount++;
  await sleep(20);
  if (callCount <= 6) throw new Error('库存服务 500 故障');
  return { stock: 10 };
}

// ── 4. 降级：库存不可用时返回兜底结果 ─────────────────────────────────
const fallback = () => ({ stock: -1, note: '已降级：库存服务不可用' });

// ── 组装：一次扣库存 = 熔断( 重试( 超时( 调用 ) ) )，失败则降级 ────────
async function main() {
  const breaker = new CircuitBreaker();
  for (let i = 1; i <= 16; i++) {
    const start = Date.now();
    let result;
    try {
      result = await breaker.call(() => withRetry(() => withTimeout(inventoryService, 1000)));
    } catch (err) {
      result = fallback(); // 熔断或最终失败 → 降级
    }
    console.log(
      `#${String(i).padStart(2)}  耗时 ${String(Date.now() - start).padStart(4)}ms  ` +
        `${JSON.stringify(result)}  熔断器=${breaker.state}`
    );
    await sleep(150);
  }
}

main();
