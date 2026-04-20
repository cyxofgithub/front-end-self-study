import { track, trigger } from "./effect";
import { isObject } from "../shared";

const reactiveMap = new WeakMap<object, object>();
const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive"
}

const createReactiveObject = <T extends object>(target: T): T => {
  if (!isObject(target)) {
    return target;
  }

  if ((target as Record<string, unknown>)[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  const existingProxy = reactiveMap.get(target) as T | undefined;
  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, {
    get(targetObject, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
      }
      const value = Reflect.get(targetObject, key, receiver);
      track(targetObject, key);
      return isObject(value) ? reactive(value) : value;
    },
    set(targetObject, key, value, receiver) {
      const oldValue = Reflect.get(targetObject, key, receiver);
      const result = Reflect.set(targetObject, key, value, receiver);
      if (oldValue !== value) {
        trigger(targetObject, key);
      }
      return result;
    }
  });

  reactiveMap.set(target, proxy);
  return proxy;
};

export const reactive = <T extends object>(target: T): T => createReactiveObject(target);
