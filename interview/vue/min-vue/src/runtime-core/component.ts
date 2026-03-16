import { reactive } from "../reactivity/reactive";
import type { ComponentType, VNode } from "./vnode";

export interface ComponentInstance {
  vnode: VNode;
  type: ComponentType;
  state: Record<string, unknown>;
  render: ((ctx: Record<string, unknown>) => VNode) | null;
  subTree: VNode | null;
  isMounted: boolean;
  update: (() => void) | null;
}

export const createComponentInstance = (vnode: VNode): ComponentInstance => {
  return {
    vnode,
    type: vnode.type as ComponentType,
    state: {},
    render: null,
    subTree: null,
    isMounted: false,
    update: null
  };
};

export const setupComponent = (
  instance: ComponentInstance,
  compile: ((template: string) => (ctx: Record<string, unknown>) => VNode) | null
): void => {
  const component = instance.type;
  const setupResult = component.setup ? component.setup() : {};
  instance.state = reactive(setupResult ?? {});

  if (component.render) {
    instance.render = component.render;
    return;
  }

  if (component.template && compile) {
    instance.render = compile(component.template);
  }
};
