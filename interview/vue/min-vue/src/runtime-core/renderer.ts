import { effect } from "../reactivity/effect";
import { isFunction, isString } from "../shared";
import { createComponentInstance, setupComponent, type ComponentInstance } from "./component";
import { Text, type ComponentType, type VNode } from "./vnode";

export interface RendererOptions {
  createElement: (tag: string) => Element;
  setElementText: (el: Element, text: string) => void;
  insert: (el: Node, parent: Element) => void;
  patchProp: (el: Element, key: string, prevValue: unknown, nextValue: unknown) => void;
  remove: (el: Node) => void;
  createText: (text: string) => Text;
  setText: (node: Text, text: string) => void;
}

interface App {
  mount: (container: Element) => void;
}

export const createRenderer = (
  options: RendererOptions,
  compile: ((template: string) => (ctx: Record<string, unknown>) => VNode) | null = null
) => {
  const render = (vnode: VNode, container: Element): void => {
    patch(null, vnode, container);
  };

  const createApp = (rootComponent: ComponentType): App => {
    return {
      mount(container: Element) {
        const vnode: VNode = {
          type: rootComponent,
          props: null,
          children: null,
          el: null
        };
        render(vnode, container);
      }
    };
  };

  const patch = (n1: VNode | null, n2: VNode, container: Element): void => {
    if (n1 && n1.type !== n2.type) {
      if (n1.el) {
        options.remove(n1.el);
      }
      n1 = null;
    }

    const { type } = n2;
    if (type === Text) {
      processText(n1, n2, container);
      return;
    }

    if (isString(type)) {
      processElement(n1, n2, container);
      return;
    }

    processComponent(n1, n2, container);
  };

  const processText = (n1: VNode | null, n2: VNode, container: Element): void => {
    if (!n1) {
      const textNode = options.createText((n2.children as string | null) ?? "");
      n2.el = textNode;
      options.insert(textNode, container);
      return;
    }

    const el = n1.el as Text;
    n2.el = el;
    const newText = (n2.children as string | null) ?? "";
    const oldText = (n1.children as string | null) ?? "";
    if (newText !== oldText) {
      options.setText(el, newText);
    }
  };

  const processElement = (n1: VNode | null, n2: VNode, container: Element): void => {
    if (!n1) {
      mountElement(n2, container);
      return;
    }
    patchElement(n1, n2, container);
  };

  const mountElement = (vnode: VNode, container: Element): void => {
    const el = options.createElement(vnode.type as string);
    vnode.el = el;

    const props = vnode.props ?? {};
    Object.keys(props).forEach((key) => {
      options.patchProp(el, key, null, props[key]);
    });

    if (typeof vnode.children === "string") {
      options.setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => patch(null, child, el));
    }

    options.insert(el, container);
  };

  const patchElement = (n1: VNode, n2: VNode, container: Element): void => {
    const el = n1.el as Element;
    n2.el = el;
    patchProps(el, n1.props ?? {}, n2.props ?? {});
    patchChildren(n1, n2, el, container);
  };

  const patchProps = (
    el: Element,
    oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>
  ): void => {
    Object.keys(newProps).forEach((key) => {
      const prev = oldProps[key];
      const next = newProps[key];
      if (prev !== next) {
        options.patchProp(el, key, prev, next);
      }
    });

    Object.keys(oldProps).forEach((key) => {
      if (!(key in newProps)) {
        options.patchProp(el, key, oldProps[key], null);
      }
    });
  };

  const patchChildren = (
    n1: VNode,
    n2: VNode,
    container: Element,
    _parentContainer: Element
  ): void => {
    const oldChildren = n1.children;
    const newChildren = n2.children;

    if (typeof newChildren === "string") {
      if (Array.isArray(oldChildren)) {
        oldChildren.forEach((child) => child.el && options.remove(child.el));
      }
      if (oldChildren !== newChildren) {
        options.setElementText(container, newChildren);
      }
      return;
    }

    if (Array.isArray(newChildren)) {
      if (typeof oldChildren === "string") {
        options.setElementText(container, "");
        newChildren.forEach((child) => patch(null, child, container));
        return;
      }

      const oldList = Array.isArray(oldChildren) ? oldChildren : [];
      const commonLength = Math.min(oldList.length, newChildren.length);

      for (let index = 0; index < commonLength; index += 1) {
        patch(oldList[index], newChildren[index], container);
      }

      if (newChildren.length > oldList.length) {
        newChildren.slice(commonLength).forEach((child) => patch(null, child, container));
      } else if (oldList.length > newChildren.length) {
        oldList.slice(commonLength).forEach((child) => child.el && options.remove(child.el));
      }
      return;
    }

    if (typeof oldChildren === "string") {
      options.setElementText(container, "");
      return;
    }

    if (Array.isArray(oldChildren)) {
      oldChildren.forEach((child) => child.el && options.remove(child.el));
    }
  };

  const processComponent = (n1: VNode | null, n2: VNode, container: Element): void => {
    if (!n1) {
      mountComponent(n2, container);
      return;
    }
    updateComponent(n1, n2);
  };

  const mountComponent = (initialVNode: VNode, container: Element): void => {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance, compile);

    if (!instance.render) {
      throw new Error("Component missing render function. Provide render or template.");
    }

    setupRenderEffect(instance, initialVNode, container);
  };

  const updateComponent = (n1: VNode, n2: VNode): void => {
    const instance = (n1 as VNode & { component?: ComponentInstance }).component;
    if (!instance) {
      return;
    }
    (n2 as VNode & { component?: ComponentInstance }).component = instance;
    instance.vnode = n2;
    instance.update?.();
  };

  const setupRenderEffect = (
    instance: ComponentInstance,
    initialVNode: VNode,
    container: Element
  ): void => {
    instance.update = () => {
      effect(() => {
        if (!instance.render) {
          return;
        }

        if (!instance.isMounted) {
          const subTree = instance.render(instance.state);
          patch(null, subTree, container);
          initialVNode.el = subTree.el;
          (initialVNode as VNode & { component?: ComponentInstance }).component = instance;
          instance.subTree = subTree;
          instance.isMounted = true;
          return;
        }

        const prevTree = instance.subTree;
        const nextTree = instance.render(instance.state);
        if (prevTree) {
          patch(prevTree, nextTree, container);
        } else {
          patch(null, nextTree, container);
        }
        instance.subTree = nextTree;
      });
    };

    instance.update();
  };

  return {
    createApp
  };
};

const isEvent = (key: string): boolean => /^on[A-Z]/.test(key);

export const createDomRendererOptions = (): RendererOptions => {
  const eventStore = new WeakMap<Element, Map<string, EventListener>>();

  return {
    createElement: (tag) => document.createElement(tag),
    setElementText: (el, text) => {
      el.textContent = text;
    },
    insert: (el, parent) => {
      parent.appendChild(el);
    },
    patchProp: (el, key, prevValue, nextValue) => {
      if (isEvent(key)) {
        const eventName = key.slice(2).toLowerCase();
        let events = eventStore.get(el);
        if (!events) {
          events = new Map();
          eventStore.set(el, events);
        }

        const existing = events.get(eventName);
        if (existing) {
          el.removeEventListener(eventName, existing);
          events.delete(eventName);
        }

        if (isFunction(nextValue)) {
          const listener = nextValue as EventListener;
          events.set(eventName, listener);
          el.addEventListener(eventName, listener);
        }
        return;
      }

      if (nextValue === null || nextValue === undefined || nextValue === false) {
        el.removeAttribute(key);
        return;
      }

      el.setAttribute(key, String(nextValue));
    },
    remove: (el) => {
      el.parentNode?.removeChild(el);
    },
    createText: (text) => document.createTextNode(text),
    setText: (node, text) => {
      node.nodeValue = text;
    }
  };
};
