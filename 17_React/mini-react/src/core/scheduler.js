/**
 * Scheduler - 任务调度器
 *
 * 使用 React 原生 API 实现时间切片：
 * - MessageChannel: 任务调度
 * - requestAnimationFrame: 获取帧开始时间
 * - performance.now(): 高精度时间戳
 */

// 获取当前时间（高精度）
const getCurrentTime = () => performance.now();

// 每帧允许的 JS 执行时间（5ms，与 React 源码一致）
const YIELD_INTERVAL = 5;

// 当前工作单元
let workInProgress = null;

// MessageChannel 用于任务调度
const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;

let frameStartTime = 0;
let isScheduled = false;

/**
 * shouldYieldToHost - 判断是否需要让出主线程
 *
 * React 默认每一帧只允许 5ms 的 JS 执行，超过则让出主线程
 *
 * @param {number} startTime - 帧开始时间
 * @returns {boolean} 是否需要让出主线程
 */
function shouldYieldToHost(startTime) {
    const timeElapsed = getCurrentTime() - startTime;
    return timeElapsed >= YIELD_INTERVAL;
}

/**
 * performWorkUntilDeadline - 工作循环入口
 *
 * 使用 requestAnimationFrame 获取帧开始时间，然后执行工作循环
 * 这是 React 源码中的实现方式，确保与浏览器渲染帧同步
 *
 * @returns {void}
 */
function performWorkUntilDeadline() {
    // 利用 requestAnimationFrame 保证获取的起始时间是最新一帧
    // rafTime 是下一帧开始的精准时间戳，可以精确对齐浏览器的刷新节奏
    // 在重排重绘，屏幕刷新前执行
    requestAnimationFrame((rafTime) => {
        frameStartTime = rafTime;
        const hasMoreWork = workLoop(frameStartTime);

        // 如果还有工作，通过 MessageChannel 调度下一个任务
        if (hasMoreWork) {
            port.postMessage(null);
        } else {
            isScheduled = false;
        }
    });
}

/**
 * workLoop - 可中断的工作循环
 *
 * 在时间片内执行工作，如果时间用完则让出主线程
 *
 * @param {number} startTime - 帧开始时间
 * @returns {boolean} 是否还有未完成的工作
 */
function workLoop(startTime) {
    while (workInProgress && !shouldYieldToHost(startTime)) {
        // 执行工作单元，返回下一个工作单元
        workInProgress = performUnitOfWork(workInProgress);
    }

    // 返回是否还有工作
    return workInProgress !== null;
}

/**
 * performUnitOfWork - 执行单个工作单元
 *
 * 这个函数由 reconciler 模块实现
 * 这里只是声明，实际实现在 reconciler.js 中
 *
 * @param {object} fiber - 当前 Fiber 节点
 * @returns {object|null} 下一个工作单元
 */
let performUnitOfWork = null;

/**
 * scheduleWork - 调度工作
 *
 * @param {object} fiber - 根 Fiber 节点
 * @param {function} performWork - 执行工作单元的函数
 */
export function scheduleWork(fiber, performWork) {
    workInProgress = fiber;
    performUnitOfWork = performWork;

    // 如果还没有调度，启动调度
    if (!isScheduled) {
        isScheduled = true;
        port.postMessage(null);
    }
}
