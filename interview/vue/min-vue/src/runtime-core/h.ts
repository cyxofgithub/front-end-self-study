import { createVNode, type VNode } from "./vnode";

export const h = (
  type: VNode["type"],
  props?: Record<string, unknown> | null,
  children?: VNode["children"]
): VNode => createVNode(type, props ?? null, children ?? null);
