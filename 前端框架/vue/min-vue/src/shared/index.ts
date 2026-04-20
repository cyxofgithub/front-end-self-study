export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object";

export const isFunction = (value: unknown): value is (...args: unknown[]) => unknown =>
  typeof value === "function";

export const isString = (value: unknown): value is string => typeof value === "string";

export const hasOwn = (target: object, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(target, key);
