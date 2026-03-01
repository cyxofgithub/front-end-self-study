/**
 * Hooks - React Hooks 实现
 *
 * 基于 Fiber 架构实现 useState 和 useEffect
 * Hooks 存储在 Fiber 节点的 memoizedState 上，形成一个链表
 */

import { updateContainer } from '../core/reconciler.js';

// 当前正在工作的 Fiber 节点
let currentlyRenderingFiber = null;
// 当前正在处理的 Hook（工作指针）
let workInProgressHook = null;
// 用于首次渲染时快速链接新节点
let lastHookInWorkInProgress = null;

/**
 * 设置当前正在渲染的 Fiber 节点
 *
 * @param {object} fiber - Fiber 节点
 */
export function setCurrentlyRenderingFiber(fiber) {
    currentlyRenderingFiber = fiber;
    workInProgressHook = fiber.memoizedState;
    lastHookInWorkInProgress = null;
}

/**
 * useState - 状态 Hook
 *
 * @param {any} initialValue - 初始值
 * @returns {[any, function]} [状态值, 更新函数]
 */
export function useState(initialValue) {
    // 获取当前 Hook 节点
    let currentHook = workInProgressHook;

    if (currentHook) {
        // 更新渲染：使用已有的 Hook 节点
        // 处理队列中的所有状态更新
        currentHook.queue.forEach((update) => {
            currentHook.memoizedState =
                typeof update === 'function'
                    ? update(currentHook.memoizedState)
                    : update;
        });
        currentHook.queue = [];
    } else {
        // 首次渲染：创建新的 Hook 节点
        currentHook = {
            memoizedState: initialValue,
            queue: [],
            next: null,
        };

        // 如果是第一个 Hook，设置为链表头
        if (!currentlyRenderingFiber.memoizedState) {
            currentlyRenderingFiber.memoizedState = currentHook;
        } else {
            // 否则链接到上一个 Hook
            lastHookInWorkInProgress.next = currentHook;
        }
        // 更新最后一个 Hook 的引用
        lastHookInWorkInProgress = currentHook;
    }

    // 创建 setState 函数
    const setState = (newState) => {
        currentHook.queue.push(newState);
        // 找到根节点并触发重新渲染
        let rootFiber = currentlyRenderingFiber;
        while (rootFiber.return) {
            rootFiber = rootFiber.return;
        }
        updateContainer(rootFiber);
    };

    // 移动工作指针到下一个 Hook 节点
    workInProgressHook = currentHook.next;

    return [currentHook.memoizedState, setState];
}

/**
 * useEffect - 副作用 Hook
 *
 * @param {function} effect - 副作用函数
 * @param {array} deps - 依赖数组
 */
export function useEffect(effect, deps) {
    // 获取当前 Hook 节点
    let currentHook = workInProgressHook;

    if (currentHook) {
        // 更新渲染：使用已有的 Hook 节点
        // 检查依赖是否变化
        const hasChanged =
            !currentHook.deps ||
            !deps ||
            deps.length !== currentHook.deps.length ||
            !deps.every((dep, i) => dep === currentHook.deps[i]);

        if (hasChanged) {
            // 依赖变化，需要执行 effect
            // 清理函数会在 beforeMutation 阶段执行
            if (currentHook.cleanup) {
                currentlyRenderingFiber.cleanup = currentHook.cleanup;
            }

            // effect 回调会在 layout 阶段执行
            currentlyRenderingFiber.effectCallback = () => {
                const cleanup = effect();
                if (cleanup) {
                    currentHook.cleanup = cleanup;
                }
            };

            currentHook.deps = deps;
        } else {
            // 依赖未变化，清除 effectCallback 避免在 commit 阶段执行
            currentlyRenderingFiber.effectCallback = null;
        }
    } else {
        // 首次渲染：创建新的 Hook 节点
        currentHook = {
            memoizedState: null,
            deps: undefined,
            cleanup: undefined,
            next: null,
        };

        // 链接到链表
        if (!currentlyRenderingFiber.memoizedState) {
            currentlyRenderingFiber.memoizedState = currentHook;
        } else {
            lastHookInWorkInProgress.next = currentHook;
        }
        // 更新最后一个 Hook 的引用
        lastHookInWorkInProgress = currentHook;

        // 首次渲染，执行 effect
        // 目前这里只支持一个effect 实际一个fiber 可以对应多个 effect
        currentlyRenderingFiber.effectCallback = () => {
            const cleanup = effect();
            if (cleanup) {
                currentHook.cleanup = cleanup;
            }
        };

        currentHook.deps = deps;
    }

    // 移动工作指针到下一个 Hook 节点
    workInProgressHook = currentHook.next;
}
