type Dep = Set<ReactiveEffect>;
type KeyToDepMap = Map<PropertyKey, Dep>;
const targetMap = new WeakMap<object, KeyToDepMap>();

export let activeEffect: ReactiveEffect | undefined;

export class ReactiveEffect {
  public deps: Dep[] = [];
  public active = true;
  /**
   * scheduler 是可选的调度函数。当依赖变化时 trigger 会优先调用 scheduler
   * 而不是直接 run()，由 scheduler 决定何时以及如何执行 fn。
   *
   * 不同场景下的用法：
   * - effect(fn)：无 scheduler，trigger 直接 run(fn)
   * - watch(source, cb)：scheduler = job，job 内先 run(getter) 取新值，再调 cb
   * - computed(getter)：scheduler = 标记 dirty + 通知外层 effect，懒求值不立即算
   * - renderer：scheduler = () => queueJob(effect)，将更新推入异步队列批量处理
   */
  public scheduler?: () => void;
  /**
   * fn 是需要被追踪依赖并重新执行的函数。在 run() 执行期间，
   * activeEffect 指向当前 effect，fn 内部读取的响应式数据都会通过 track
   * 将这个 effect 收集为依赖。
   *
   * 不同场景下 fn 的含义：
   * - effect(fn)：fn 直接是副作用逻辑（渲染、DOM 操作等）
   * - watch(source, cb)：fn 是 getter（读取监听数据），cb 在 scheduler 里
   * - computed(getter)：fn 是 getter（计算逻辑），结果缓存到 _value
   */
  private readonly fn: () => unknown;

  /**
   * @param fn     依赖追踪期间执行的函数，同时也是 trigger 默认调用的目标
   * @param scheduler 可选；存在时 trigger 优先调 scheduler 而非直接 run(fn)
   */
  constructor(fn: () => unknown, scheduler?: () => void) {
    this.fn = fn;
    this.scheduler = scheduler;
  }

  run(): unknown {
    if (!this.active) {
      return this.fn();
    }

    const prevEffect = activeEffect;
    activeEffect = this;
    const result = this.fn();
    activeEffect = prevEffect;
    return result;
  }

  stop(): void {
    if (!this.active) {
      return;
    }
    this.deps.forEach((dep) => dep.delete(this));
    this.deps.length = 0;
    this.active = false;
  }
}

export const effect = (fn: () => unknown, scheduler?: () => void): (() => void) => {
  const reactiveEffect = new ReactiveEffect(fn, scheduler);
  reactiveEffect.run();
  return () => reactiveEffect.stop();
};

export const track = (target: object, key: PropertyKey): void => {
  if (!activeEffect) {
    return;
  }

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
};

export const trigger = (target: object, key: PropertyKey): void => {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  const dep = depsMap.get(key);
  if (!dep) {
    return;
  }

  dep.forEach((reactiveEffect) => {
    if (reactiveEffect.scheduler) {
      reactiveEffect.scheduler();
    } else {
      reactiveEffect.run();
    }
  });
};
