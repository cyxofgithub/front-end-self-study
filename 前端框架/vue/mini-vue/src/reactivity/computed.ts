import { ReactiveEffect, activeEffect } from './effect';

type Dep = Set<ReactiveEffect>;

class ComputedRefImpl<T> {
  private _value!: T;
  private _dirty = true;
  private _effect: ReactiveEffect;
  public dep: Dep = new Set();
  public set?: (value: T) => void;

  constructor(getter: () => T) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        this.dep.forEach((effect) => {
          if (effect.scheduler) {
            effect.scheduler();
          } else {
            effect.run();
          }
        });
      }
    });
  }

  get value(): T {
    if (activeEffect) {
      if (!this.dep.has(activeEffect)) {
        this.dep.add(activeEffect);
        activeEffect.deps.push(this.dep);
      }
    }

    if (this._dirty) {
      this._value = this._effect.run() as T;
      this._dirty = false;
    }

    return this._value;
  }
}

export function computed<T>(getter: () => T): ComputedRefImpl<T>;
export function computed<T>(
  options: { get: () => T; set: (value: T) => void }
): ComputedRefImpl<T>;
export function computed<T>(
  getterOrOptions: (() => T) | { get: () => T; set: (value: T) => void }
): ComputedRefImpl<T> {
  let getter: () => T;

  if (typeof getterOrOptions === 'function') {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
  }

  const ref = new ComputedRefImpl<T>(getter);

  if (typeof getterOrOptions !== 'function' && getterOrOptions.set) {
    ref.set = getterOrOptions.set;
  }

  return ref;
}
