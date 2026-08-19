/**
 * Reconciler - 协调器
 *
 * 负责协调阶段的工作：
 * - beginWork: 处理当前 Fiber 节点
 * - completeWork: 完成当前节点的工作
 * - reconcileChildren: 协调子节点
 * - performUnitOfWork: 执行单个工作单元（深度优先遍历）
 */

import { TAG, EFFECT_TAG, createFiber } from './fiber.js';
import { scheduleWork } from './scheduler.js';
import { commitRoot } from './commit.js';
import { setCurrentlyRenderingFiber } from '../hooks/hooks.js';
import { isEventName, precacheFiberNode, updateFiberProps } from '../events/eventSystem.js';

// 当前正在工作的根 Fiber
let workInProgressRoot = null;
// 下一个要处理的 Fiber 节点
let nextUnitOfWork = null;
// 需要删除的节点列表
let deletions = [];

// 导出 deletions，供外部使用
export function getDeletions() {
    return deletions;
}

/**
 * 设置当前工作的根节点并开始协调
 *
 * @param {object} fiber - 根 Fiber 节点
 */
export function updateContainer(fiber) {
    workInProgressRoot = fiber;
    nextUnitOfWork = fiber;

    scheduleWork(fiber, performUnitOfWork);
}

/**
 * performUnitOfWork - 执行单个工作单元
 *
 * 这是 scheduler 调用的函数，执行深度优先遍历：
 * 1. beginWork: 处理当前节点，返回第一个子节点
 * 2. 如果有子节点，继续处理子节点
 * 3. 如果没有子节点，completeWork: 完成当前节点，然后处理兄弟节点
 * 4. 如果没有兄弟节点，回到父节点继续 completeWork
 *
 * @param {object} fiber - 当前 Fiber 节点
 * @returns {object|null} 下一个要处理的 Fiber 节点
 */
export function performUnitOfWork(fiber) {
    // beginWork: 处理当前节点
    const next = beginWork(fiber);

    // 1、如果 beginWork 返回了子节点，继续处理子节点
    if (next) {
        return next;
    }

    // 如果没有子节点，completeWork 完成当前节点
    // 然后尝试处理兄弟节点或返回父节点
    let current = fiber;
    while (current) {
        completeWork(current);

        // 2、如果有兄弟节点，处理兄弟节点
        if (current.sibling) {
            return current.sibling;
        }

        // 3、否则回到父节点继续 completeWork
        current = current.return;
    }

    // 4、所有节点都处理完了，返回 null
    return null;
}

/**
 * beginWork - 开始处理当前 Fiber 节点
 *
 * 根据节点类型执行不同的处理逻辑：
 * - HOST_COMPONENT: 原生 DOM 元素，直接返回子节点
 * - FUNCTION_COMPONENT: 函数式组件，执行函数获取子节点
 *
 * @param {object} fiber - 当前 Fiber 节点
 * @returns {object|null} 第一个子节点
 */
function beginWork(fiber) {
    if (fiber.tag === TAG.FUNCTION_COMPONENT) {
        // 函数式组件：执行函数获取子节点
        return updateFunctionComponent(fiber);
    } else if (fiber.tag === TAG.HOST_COMPONENT) {
        // 原生 DOM 元素：直接返回子节点（在 reconcileChildren 中处理）
        return updateHostComponent(fiber);
    } else if (fiber.tag === TAG.HOST_ROOT) {
        // 根节点：协调子节点
        return updateHostRoot(fiber);
    }

    return null;
}

/**
 * updateFunctionComponent - 更新函数式组件
 *
 * @param {object} fiber - 函数式组件的 Fiber 节点
 * @returns {object|null} 第一个子节点
 */
function updateFunctionComponent(fiber) {
    const { type, props } = fiber;

    // 设置当前正在渲染的 Fiber，用于 Hooks
    setCurrentlyRenderingFiber(fiber);

    // 执行函数组件，获取子节点（虚拟 DOM）
    const childElement = type(props);
    const children = childElement ? [childElement] : [];

    // 协调子节点，生成 Fiber 节点
    reconcileChildren(fiber, children);

    // 返回第一个子节点
    return fiber.child;
}

/**
 * updateHostRoot - 更新根节点
 *
 * @param {object} fiber - 根 Fiber 节点
 * @returns {object|null} 第一个子节点
 */
function updateHostRoot(fiber) {
    // 根节点只需要协调子节点，不需要创建 DOM 节点
    const children = fiber.props?.children || [];
    // 确保 children 是数组
    const childrenArray = Array.isArray(children)
        ? children
        : [children].filter(Boolean);

    reconcileChildren(fiber, childrenArray);

    // 返回第一个子节点
    return fiber.child;
}

/**
 * updateHostComponent - 更新原生 DOM 元素
 *
 * @param {object} fiber - 原生 DOM 元素的 Fiber 节点
 * @returns {object|null} 第一个子节点
 */
function updateHostComponent(fiber) {
    // 协调子节点
    if (!fiber.stateNode) {
        // 首次渲染，创建 DOM 节点
        fiber.stateNode = createDOMNode(fiber);
    }

    const children = fiber.props?.children || [];
    // 确保 children 是数组
    const childrenArray = Array.isArray(children)
        ? children
        : [children].filter(Boolean);
    reconcileChildren(fiber, childrenArray);

    // 返回第一个子节点
    return fiber.child;
}

/**
 * shallowEqual - 浅比较两个对象是否相等
 *
 * @param {object} obj1 - 第一个对象
 * @param {object} obj2 - 第二个对象
 * @returns {boolean} 是否相等
 */
function shallowEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }

    if (
        !obj1 ||
        !obj2 ||
        typeof obj1 !== 'object' ||
        typeof obj2 !== 'object'
    ) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

/**
 * reconcileChildren - 协调子节点
 *
 * 对比新旧子节点，生成新的 Fiber 节点，并建立父子、兄弟关系
 *
 * @param {object} fiber - 当前 Fiber 节点
 * @param {array} children - 子节点数组（虚拟 DOM）
 */
function reconcileChildren(fiber, children) {
    let oldFiber = fiber.alternate?.child;
    let prevSibling = null;

    // 确保 children 是数组
    const childrenArray = Array.isArray(children)
        ? children
        : [children].filter(Boolean);

    // 遍历子节点
    childrenArray.forEach((child, index) => {
        if (!child) return; // 跳过 null/undefined

        let newFiber = null;
        const sameType = oldFiber && child && oldFiber.type === child.type;

        if (sameType) {
            // 类型相同，需要比较 props 是否发生变化
            const oldProps = oldFiber.props || {};
            const newProps = child.props || {};
            const propsChanged = !shallowEqual(oldProps, newProps);

            // 复用节点，只有当 props 发生变化时才标记为 UPDATE
            newFiber = {
                ...oldFiber,
                props: child.props,
                alternate: oldFiber,
                effectTag: propsChanged ? EFFECT_TAG.UPDATE : null,
                return: fiber,
            };
        } else {
            // 类型不同，创建新节点，标记为 PLACEMENT
            if (child) {
                newFiber = createFiberFromElement(child);
                newFiber.effectTag = EFFECT_TAG.PLACEMENT;
                newFiber.return = fiber;
            }

            // 如果旧节点存在但新节点不存在，标记旧节点为 DELETION
            if (oldFiber) {
                oldFiber.effectTag = EFFECT_TAG.DELETION;
                deletions.push(oldFiber);
            }
        }

        // 移动到下一个旧节点
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }

        // 建立兄弟关系
        if (index === 0) {
            fiber.child = newFiber;
        } else if (prevSibling) {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
    });

    // 处理剩余的旧节点（需要删除）
    while (oldFiber) {
        oldFiber.effectTag = EFFECT_TAG.DELETION;
        deletions.push(oldFiber);
        oldFiber = oldFiber.sibling;
    }
}

/**
 * createFiberFromElement - 从虚拟 DOM 元素创建 Fiber 节点
 *
 * @param {object} element - 虚拟 DOM 元素
 * @returns {object} Fiber 节点
 */
function createFiberFromElement(element) {
    if (!element || typeof element !== 'object') {
        return null;
    }

    if (typeof element.type === 'function') {
        // 函数式组件
        return createFiber(TAG.FUNCTION_COMPONENT, element.type, element.props);
    } else if (element.type === 'TEXT_ELEMENT') {
        // 文本节点
        return createFiber(TAG.HOST_COMPONENT, 'TEXT_ELEMENT', element.props);
    } else {
        // 原生 DOM 元素
        return createFiber(TAG.HOST_COMPONENT, element.type, element.props);
    }
}

/**
 * createDOMNode - 创建 DOM 节点
 *
 * 对应源码 createInstance：创建时一次性登记 Fiber 指针与 props（事件派发的反查依据）。
 * 之后插入 DOM（appendChild）不再有任何登记 —— 与源码一致：插入是纯 DOM 操作。
 *
 * @param {object} fiber - Fiber 节点
 * @returns {HTMLElement|Text} DOM 节点
 */
function createDOMNode(fiber) {
    if (fiber.type === 'TEXT_ELEMENT') {
        return document.createTextNode(fiber.props?.nodeValue || '');
    }

    const dom = document.createElement(fiber.type);
    // 登记 expando：DOM→Fiber 与 DOM→props（源码在 createInstance 里做同样两步）
    precacheFiberNode(fiber, dom);
    updateFiberProps(dom, fiber.props);
    updateDOMProperties(dom, {}, fiber.props || {});
    return dom;
}

/**
 * updateDOMProperties - 更新 DOM 属性
 *
 * 事件 props（onXxx）不在此处理：handler 只存在 Fiber 的 props 上，
 * 派发时由 eventSystem 从 Fiber 读取最新的 —— 这也是「换 handler 不需要重绑监听器」的原因。
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

/**
 * completeWork - 完成当前节点的工作
 *
 * 1. 收集副作用到 effects 链表
 * 2. 对于原生 DOM 元素，创建 DOM 节点（如果还没有）
 *
 * @param {object} fiber - 当前 Fiber 节点
 */
function completeWork(fiber) {
    // 收集副作用到父节点的 effects 链表
    if (fiber.return) {
        if (!fiber.return.effects) {
            fiber.return.effects = [];
        }
        fiber.return.effects.push(fiber);
    } else {
        // 根节点：所有工作完成，进入提交阶段
        workInProgressRoot.effects = fiber.effects || [];
        workInProgressRoot.effects.push(fiber);
        // 提交所有更改到 DOM
        commitRoot(workInProgressRoot, deletions);

        // 重置
        workInProgressRoot = null;
        nextUnitOfWork = null;
        deletions = [];
    }
}
