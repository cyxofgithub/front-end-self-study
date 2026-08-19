/**
 * Commit - 提交阶段
 *
 * 将协调阶段计算出的更新应用到实际的 DOM 上
 * 分为三个子阶段：
 * 1. beforeMutation: 执行 useEffect 清理函数
 * 2. mutation: 执行 DOM 操作（PLACEMENT、UPDATE、DELETION）
 * 3. layout: 执行 useEffect 回调
 */

import { EFFECT_TAG, TAG } from './fiber.js';
import { isEventName, updateFiberProps } from '../events/eventSystem.js';

/**
 * commitRoot - 提交根节点
 *
 * @param {object} rootFiber - 根 Fiber 节点
 * @param {array} deletions - 需要删除的节点列表
 */
export function commitRoot(rootFiber, deletions) {
    // beforeMutation 阶段：执行 useEffect 清理函数
    commitBeforeMutationEffects(rootFiber);

    // mutation 阶段：执行 DOM 操作
    deletions.forEach(commitDeletion);
    commitMutationEffects(rootFiber);

    // layout 阶段：执行 useEffect 回调
    commitLayoutEffects(rootFiber);

    // 提交完成后，将当前树设置为 alternate
    rootFiber.alternate = rootFiber;
}

/**
 * commitBeforeMutationEffects - beforeMutation 阶段
 *
 * 执行 useEffect 清理函数
 *
 * @param {object} fiber - Fiber 节点
 */
function commitBeforeMutationEffects(fiber) {
    if (!fiber) return;

    // 遍历 effects 链表
    if (fiber.effects) {
        fiber.effects.forEach((effect) => {
            if (effect.tag === TAG.FUNCTION_COMPONENT && effect.cleanups) {
                effect.cleanups.forEach((cleanup) => cleanup());
            }
        });
    }

    // 递归处理子节点和兄弟节点
    commitBeforeMutationEffects(fiber.child);
    commitBeforeMutationEffects(fiber.sibling);
}

/**
 * commitMutationEffects - mutation 阶段
 *
 * 执行 DOM 操作：PLACEMENT、UPDATE、DELETION
 *
 * @param {object} fiber - Fiber 节点
 */
function commitMutationEffects(fiber) {
    if (!fiber) return;

    // 处理当前节点
    commitWork(fiber);

    // 递归处理子节点和兄弟节点
    commitMutationEffects(fiber.child);
    commitMutationEffects(fiber.sibling);
}

/**
 * commitWork - 提交单个节点
 *
 * @param {object} fiber - Fiber 节点
 */
function commitWork(fiber) {
    if (!fiber) return;

    const { effectTag, return: parentFiber } = fiber;

    if (effectTag === EFFECT_TAG.PLACEMENT) {
        // 新增节点
        commitPlacement(fiber, parentFiber);
    } else if (effectTag === EFFECT_TAG.UPDATE) {
        // 更新节点
        commitUpdate(fiber);
    }
}

/**
 * commitPlacement - 处理新增节点
 *
 * @param {object} fiber - Fiber 节点
 * @param {object} parentFiber - 父 Fiber 节点
 */
function commitPlacement(fiber, parentFiber) {
    // 函数式组件没有 DOM 节点，跳过
    if (fiber.tag !== TAG.HOST_COMPONENT) {
        return;
    }

    const parentDOM = getParentDOM(parentFiber);
    const dom = fiber.stateNode;

    if (parentDOM && dom) {
        // 纯 DOM 操作，零登记 —— Fiber/props expando 已在 createDOMNode（createInstance）登记
        parentDOM.appendChild(dom);
    }
}

/**
 * commitUpdate - 处理更新节点
 *
 * @param {object} fiber - Fiber 节点
 */
function commitUpdate(fiber) {
    if (fiber.tag === TAG.HOST_COMPONENT) {
        const dom = fiber.stateNode;
        const oldProps = fiber.alternate?.props || {};
        const newProps = fiber.props;

        // 先刷新 props expando 再改 DOM（源码 commitUpdate 顺序）：
        // 保证事件派发读到的永远是已提交的最新 handler
        updateFiberProps(dom, newProps);

        // 文本节点需要特殊处理 nodeValue
        if (fiber.type === 'TEXT_ELEMENT') {
            if (oldProps.nodeValue !== newProps.nodeValue) {
                dom.nodeValue = newProps.nodeValue;
            }
        } else {
            // 其他 DOM 元素更新属性
            updateDOMProperties(dom, oldProps, newProps);
        }
    }
}

/**
 * commitDeletion - 处理删除节点
 *
 * @param {object} fiber - Fiber 节点
 */
function commitDeletion(fiber) {
    if (fiber.tag === TAG.HOST_COMPONENT) {
        const parentDOM = getParentDOM(fiber.return);
        const dom = fiber.stateNode;

        if (parentDOM && dom) {
            parentDOM.removeChild(dom);
        }
    } else {
        // 函数式组件：递归删除子节点
        let child = fiber.child;
        while (child) {
            commitDeletion(child);
            child = child.sibling;
        }
    }
}

/**
 * commitLayoutEffects - layout 阶段
 *
 * 执行 useEffect 回调
 *
 * @param {object} fiber - Fiber 节点
 */
function commitLayoutEffects(fiber) {
    if (!fiber) return;

    // 遍历 effects 链表
    if (fiber.effects) {
        fiber.effects.forEach((effect) => {
            if (
                effect.tag === TAG.FUNCTION_COMPONENT &&
                effect.effectCallbacks
            ) {
                effect.effectCallbacks.forEach((callback) => callback());
            }
        });
    }

    // 递归处理子节点和兄弟节点
    commitLayoutEffects(fiber.child);
    commitLayoutEffects(fiber.sibling);
}

/**
 * getParentDOM - 获取父节点的 DOM
 *
 * @param {object} fiber - Fiber 节点
 * @returns {HTMLElement|null} 父 DOM 节点
 */
function getParentDOM(fiber) {
    if (!fiber) return null;

    if (fiber.tag === TAG.HOST_COMPONENT) {
        return fiber.stateNode;
    } else if (fiber.tag === TAG.HOST_ROOT) {
        return fiber.props.container;
    }

    // 函数式组件：向上查找
    return getParentDOM(fiber.return);
}

/**
 * updateDOMProperties - 更新 DOM 属性
 *
 * 事件 props 不在此处理：委托方案下 handler 只存于 Fiber props，
 * 派发时实时读取，无需对 DOM 做增删监听。
 *
 * @param {HTMLElement} dom - DOM 元素
 * @param {object} prevProps - 旧属性
 * @param {object} nextProps - 新属性
 */
function updateDOMProperties(dom, prevProps, nextProps) {
    // 移除旧属性
    Object.keys(prevProps).forEach((name) => {
        if (name !== 'children' && name !== 'nodeValue' && !isEventName(name)) {
            dom.removeAttribute(name);
        }
    });

    // 添加新属性
    Object.keys(nextProps).forEach((name) => {
        if (name !== 'children' && name !== 'nodeValue' && !isEventName(name)) {
            dom[name] = nextProps[name];
        }
    });
}
