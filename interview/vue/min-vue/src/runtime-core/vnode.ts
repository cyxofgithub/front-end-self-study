import { isString } from "../shared";

export const Text = Symbol("Text");

export interface VNode {
  type: string | ComponentType | typeof Text;
  props: Record<string, unknown> | null;
  children: string | VNode[] | null;
  el: Node | null;
  key?: PropertyKey;
}

export interface ComponentType {
  template?: string;
  setup?: () => Record<string, unknown>;
  render?: (ctx: Record<string, unknown>) => VNode;
}

export const createVNode = (
  type: VNode["type"],
  props: Record<string, unknown> | null = null,
  children: VNode["children"] = null
): VNode => {
  return {
    type,
    props,
    children: normalizeChildren(children),
    el: null,
    key: props?.key as PropertyKey | undefined
  };
};

const normalizeChildren = (children: VNode["children"]): VNode["children"] => {
  if (Array.isArray(children)) {
    return children;
  }
  if (children === null || children === undefined) {
    return null;
  }
  if (isString(children)) {
    return children;
  }
  return String(children);
};
