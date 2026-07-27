import { ReactiveEffect } from './effect';
import { isObject, isFunction } from '../shared';

export function watch(
  source: (() => unknown) | object | (() => unknown)[],
  callback: (
    newValue: unknown,
    oldValue: unknown,
    onCleanup: (fn: () => void) => void
  ) => void,
  options?: { deep?: boolean; immediate?: boolean }
): () => void {
  let getter: () => unknown;
  let oldValue: unknown;
  let cleanup: (() => void) | undefined;

  if (isFunction(source)) {
    getter = source;
  } else if (Array.isArray(source)) {
    getter = () =>
      source.map((s) => (isFunction(s) ? s() : traverse(s)));
  } else if (isObject(source)) {
    getter = () => traverse(source);
  } else {
    return () => {};
  }

  if (options?.deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }

  const onCleanup = (fn: () => void) => {
    cleanup = fn;
  };

  const job = () => {
    const newValue = effect.run();
    if (cleanup) {
      cleanup();
    }
    callback(newValue, oldValue, onCleanup);
    oldValue = newValue;
  };

  const effect = new ReactiveEffect(getter as () => unknown, job);

  if (options?.immediate) {
    job();
  } else {
    oldValue = effect.run();
  }

  return () => effect.stop();
}

function traverse(value: unknown, seen = new Set<unknown>()): unknown {
  if (!isObject(value) || seen.has(value)) return value;
  seen.add(value);
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else {
    for (const key in value as object) {
      traverse((value as Record<string, unknown>)[key], seen);
    }
  }
  return value;
}
