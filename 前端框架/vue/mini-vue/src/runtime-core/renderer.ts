import { ReactiveEffect } from '../reactivity/effect';
import { queueJob } from '../reactivity/scheduler';
import { isFunction, isString } from '../shared';
import {
    createComponentInstance,
    setupComponent,
    type ComponentInstance,
} from './component';
import { Text, type ComponentType, type VNode } from './vnode';

export interface RendererOptions {
    createElement: (tag: string) => Element;
    setElementText: (el: Element, text: string) => void;
    insert: (el: Node, parent: Element) => void;
    insertBefore: (el: Node, parent: Element, anchor: Node | null) => void;
    patchProp: (
        el: Element,
        key: string,
        prevValue: unknown,
        nextValue: unknown
    ) => void;
    remove: (el: Node) => void;
    createText: (text: string) => Text;
    setText: (node: Text, text: string) => void;
}

interface App {
    mount: (container: Element) => void;
}

export const createRenderer = (
    options: RendererOptions,
    compile:
        | ((template: string) => (ctx: Record<string, unknown>) => VNode)
        | null = null
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
                    el: null,
                };
                render(vnode, container);
            },
        };
    };

    const isSameVNodeType = (n1: VNode, n2: VNode): boolean =>
        n1.type === n2.type && n1.key === n2.key;

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

    const processText = (
        n1: VNode | null,
        n2: VNode,
        container: Element
    ): void => {
        if (!n1) {
            const textNode = options.createText(
                (n2.children as string | null) ?? ''
            );
            n2.el = textNode;
            options.insert(textNode, container);
            return;
        }

        const el = n1.el as Text;
        n2.el = el;
        const newText = (n2.children as string | null) ?? '';
        const oldText = (n1.children as string | null) ?? '';
        if (newText !== oldText) {
            options.setText(el, newText);
        }
    };

    const processElement = (
        n1: VNode | null,
        n2: VNode,
        container: Element
    ): void => {
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

        if (typeof vnode.children === 'string') {
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

        if (typeof newChildren === 'string') {
            if (Array.isArray(oldChildren)) {
                oldChildren.forEach(
                    (child) => child.el && options.remove(child.el)
                );
            }
            if (oldChildren !== newChildren) {
                options.setElementText(container, newChildren);
            }
            return;
        }

        if (Array.isArray(newChildren)) {
            if (typeof oldChildren === 'string') {
                options.setElementText(container, '');
                newChildren.forEach((child) => patch(null, child, container));
                return;
            }

            const oldList = Array.isArray(oldChildren) ? oldChildren : [];
            patchKeyedChildren(oldList, newChildren, container);
            return;
        }

        if (typeof oldChildren === 'string') {
            options.setElementText(container, '');
            return;
        }

        if (Array.isArray(oldChildren)) {
            oldChildren.forEach(
                (child) => child.el && options.remove(child.el)
            );
        }
    };

    /**
     * keyed diff -- Vue 3 双端对比算法
     *
     * 输入: oldList (旧 VNode 数组), newList (新 VNode 数组)
     * 目标: 最小化 DOM 操作 (增/删/移动)，按 key + type 复用节点
     *
     * 示例: old [a#1, b#2, c#3, d#4] -> new [a#1, c#3, e#5, b#2, d#4]
     *       步骤 1: 头相同 a#1，跳过
     *       步骤 2: 尾相同 d#4，跳过
     *       步骤 3/4: 不适用
     *       步骤 5: 剩余 old [b#2, c#3] vs new [c#3, e#5, b#2]
     *               -> 复用 c#3,b#2，新挂 e#5，按 LIS 决定最小移动
     */
    const patchKeyedChildren = (
        oldList: VNode[],
        newList: VNode[],
        container: Element
    ): void => {
        let i = 0; // 头部指针 (old/new 共用，因为 step1 同步推进)
        let e1 = oldList.length - 1; // 旧列表尾部指针
        let e2 = newList.length - 1; // 新列表尾部指针

        // ================================================================
        // 1. sync from start -- 从头开始找相同 key+type 的节点
        //    old [a, b, c]     ->  i 停在第一个不匹配的位置
        //    new [a, b, d, e]  ->  相同节点直接 patch 复用 DOM
        // ================================================================
        while (i <= e1 && i <= e2) {
            const n1 = oldList[i];
            const n2 = newList[i];
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container); // key 相同，复用并递归更新子节点
            } else {
                break; // 遇到不同节点，停止同步
            }
            i++;
        }

        // ================================================================
        // 2. sync from end -- 从尾开始找相同 key+type 的节点
        //    old [c, d]        <- e1 停在位置
        //    new [c, d]        <- e2 停在位置
        //    相同节点直接 patch，缩小尾部范围
        // ================================================================
        while (i <= e1 && i <= e2) {
            const n1 = oldList[e1];
            const n2 = newList[e2];
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container);
            } else {
                break;
            }
            e1--;
            e2--;
        }

        // ================================================================
        // 3. mount extra new nodes -- 旧列表已耗尽 (i > e1)，新列表还有剩余
        //    old [a, b]
        //    new [a, b, c, d]  -> 剩余 c, d 需要新挂载
        //    anchor = newList[e2+1].el，即剩余节点之后的第一个已处理节点
        //    如果 anchor 存在 -> insertBefore，否则 -> appendChild
        //    (mountElement 内部会先 appendChild，这里再 insertBefore 纠正位置)
        // ================================================================
        if (i > e1) {
            while (i <= e2) {
                const anchor = newList[e2 + 1]?.el ?? null;
                patch(null, newList[i], container);
                options.insertBefore(newList[i].el!, container, anchor);
                i++;
            }
            return;
        }

        // ================================================================
        // 4. remove extra old nodes -- 新列表已耗尽 (i > e2)，旧列表还有剩余
        //    old [a, b, c, d]
        //    new [a, b]        -> 剩余 c, d 需要删除
        // ================================================================
        if (i > e2) {
            while (i <= e1) {
                if (oldList[i].el) {
                    options.remove(oldList[i].el!);
                }
                i++;
            }
            return;
        }

        // ================================================================
        // 5. unknown sequence -- 头尾同步后中间还有乱序节点
        //    old 剩余 [s1 .. e1], new 剩余 [s2 .. e2]
        //    分三步: 5a 建 key 映射, 5b 遍历旧节点找匹配, 5c 移动/挂载新节点
        // ================================================================
        const s1 = i; // 旧列表中间区域的起始索引
        const s2 = i; // 新列表中间区域的起始索引

        // --- 5a: 为新列表中间区域建立 key -> index 映射 ---
        //         keyToNewIndexMap: { key_3 -> 1, key_5 -> 2, key_2 -> 3 }
        //         只有带 key 的节点才入表，无 key 节点在 5b 用线性搜索匹配
        const keyToNewIndexMap = new Map<PropertyKey, number>();
        for (let j = s2; j <= e2; j++) {
            const key = newList[j].key;
            if (key != null) {
                keyToNewIndexMap.set(key, j);
            }
        }

        const toBePatched = e2 - s2 + 1; // 新列表中间区域长度
        // newIndexToOldIndexMap[k] = 旧节点在 oldList 中的索引，-1 表示新节点(需挂载)
        // 同时也是 getSequence 的输入，LIS 返回不需移动的节点位置
        const newIndexToOldIndexMap = new Array(toBePatched).fill(-1);

        // --- 5b: 遍历旧列表中间区域，找新列表中的匹配 ---
        //         有 key -> 从 keyToNewIndexMap 查 (O(1))
        //         无 key -> 线性搜索新列表中同 type 且未被匹配的节点
        //         找到匹配 -> patch 复用 + 记录 oldIndex
        //         没找到   -> remove 删除旧 DOM 节点
        for (let j = s1; j <= e1; j++) {
            const oldChild = oldList[j];
            let newIndex: number | undefined;

            if (oldChild.key != null) {
                newIndex = keyToNewIndexMap.get(oldChild.key);
            } else {
                // 无 key: 在新列表中找第一个同 type 且未被占用的节点
                for (let k = s2; k <= e2; k++) {
                    if (
                        newIndexToOldIndexMap[k - s2] === -1 &&
                        isSameVNodeType(oldChild, newList[k])
                    ) {
                        newIndex = k;
                        break;
                    }
                }
            }

            if (newIndex === undefined) {
                // 旧节点在新列表中不存在 -> 删除对应 DOM
                if (oldChild.el) {
                    options.remove(oldChild.el!);
                }
            } else {
                // 找到匹配 -> 记录 oldIndex，patch 递归更新
                newIndexToOldIndexMap[newIndex - s2] = j;
                patch(oldChild, newList[newIndex], container);
            }
        }

        // LIS (最长递增子序列): 在 newIndexToOldIndexMap 上计算
        // 返回的是 newIndexToOldIndexMap 的索引数组，这些位置对应的节点无需移动
        // 例: newIndexToOldIndexMap = [2, -1, 1]
        //     getSequence 返回 [0, 2] (值 2 和 1 不在递增序列，实际只返回递增的索引)
        //     递增子序列 = 这些节点在旧列表中的相对顺序已正确，不用移动
        const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap);
        let lastSeqIdx = increasingNewIndexSequence.length - 1;

        // --- 5c: 从右向左遍历新列表中间区域，挂载新节点 / 移动旧节点 ---
        //         从右向左是为了保证 anchor (newList[newIndex+1].el) 已经就位
        //         - newIndexToOldIndexMap[j] === -1 -> 新节点，挂载
        //         - 在 LIS 中 -> 不用移动 (已是正确相对顺序)
        //         - 不在 LIS 中 -> insertBefore 移动到 anchor 前
        for (let j = toBePatched - 1; j >= 0; j--) {
            const newIndex = s2 + j;
            const newChild = newList[newIndex];
            const anchor = newList[newIndex + 1]?.el ?? null; // 下一个兄弟节点作为插入锚点

            if (newIndexToOldIndexMap[j] === -1) {
                // 新节点: 创建 DOM + 插入到 anchor 前
                patch(null, newChild, container);
                options.insertBefore(newChild.el!, container, anchor);
            } else if (
                lastSeqIdx < 0 ||
                j !== increasingNewIndexSequence[lastSeqIdx]
            ) {
                // 复用节点但不在 LIS 中: 移动 DOM 到 anchor 前
                options.insertBefore(newChild.el!, container, anchor);
            } else {
                // 复用节点且在 LIS 中: 位置正确，不需要移动
                lastSeqIdx--;
            }
        }
    };

    const processComponent = (
        n1: VNode | null,
        n2: VNode,
        container: Element
    ): void => {
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
            throw new Error(
                'Component missing render function. Provide render or template.'
            );
        }

        setupRenderEffect(instance, initialVNode, container);
    };

    const updateComponent = (n1: VNode, n2: VNode): void => {
        const instance = (n1 as VNode & { component?: ComponentInstance })
            .component;
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
        const componentUpdateFn = (): void => {
            if (!instance.render) {
                return;
            }

            if (!instance.isMounted) {
                const subTree = instance.render(instance.state);
                patch(null, subTree, container);
                initialVNode.el = subTree.el;
                (
                    initialVNode as VNode & { component?: ComponentInstance }
                ).component = instance;
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
        };

        const componentEffect = new ReactiveEffect(componentUpdateFn, () =>
            queueJob(componentEffect)
        );

        instance.update = () => componentEffect.run();
        instance.update();
    };

    return {
        createApp,
    };
};

const isEvent = (key: string): boolean => /^on[A-Z]/.test(key);

const getSequence = (arr: number[]): number[] => {
    const p = arr.slice();
    const result: number[] = [0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === -1) {
            continue;
        }

        const lastIdx = result[result.length - 1];
        if (arr[i] > arr[lastIdx]) {
            p[i] = lastIdx;
            result.push(i);
            continue;
        }

        let lo = 0;
        let hi = result.length - 1;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (arr[result[mid]] < arr[i]) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }

        if (arr[i] < arr[result[lo]]) {
            if (lo > 0) {
                p[i] = result[lo - 1];
            }
            result[lo] = i;
        }
    }

    let len = result.length;
    let last = result[len - 1];
    while (len-- > 0) {
        result[len] = last;
        last = p[last];
    }

    return result;
};

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
        insertBefore: (el, parent, anchor) => {
            parent.insertBefore(el, anchor);
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

            if (
                nextValue === null ||
                nextValue === undefined ||
                nextValue === false
            ) {
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
        },
    };
};
