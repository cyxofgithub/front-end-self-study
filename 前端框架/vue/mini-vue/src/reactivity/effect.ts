type Dep = Set<ReactiveEffect>;
type KeyToDepMap = Map<PropertyKey, Dep>;
const targetMap = new WeakMap<object, KeyToDepMap>();

let activeEffect: ReactiveEffect | undefined;

export class ReactiveEffect {
  public deps: Dep[] = [];
  public active = true;
  public scheduler?: () => void;
  private readonly fn: () => unknown;

  constructor(fn: () => unknown, scheduler?: () => void) {
    this.fn = fn;
    this.scheduler = scheduler;
  }

  run(): unknown {
    if (!this.active) {
      return this.fn();
    }

    activeEffect = this;
    const result = this.fn();
    activeEffect = undefined;
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
