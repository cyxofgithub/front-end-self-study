/**
 * EventSystem - 事件系统（事件委托的核心）
 *
 * 对应 React 源码的 ReactDOMEventListener.js / DOMPluginEventSystem.js。
 *
 * 两个职责：
 * 1. 注册：应用挂载时在【根容器】上为每种事件各绑一个原生监听器（全应用只有几十个）
 * 2. 派发：事件冒泡到根容器时，从目标节点沿 Fiber 树向上收集同类型 handler 依次执行
 *
 * 依赖一张 DOM 节点 -> Fiber 节点的映射表：commit 阶段创建 DOM 时登记（listenToAllSupportedEvents 之外，
 * React 实际用内部属性 node[internalInstanceKey] 实现同样的效果）。
 */

import { createSyntheticEvent } from './SyntheticEvent.js';

// 支持的事件类型：props 里 onXxx -> 原生事件 xxx
const SUPPORTED_EVENTS = ['click', 'dblclick', 'mousedown', 'mouseup', 'input', 'keydown'];

/**
 * DOM -> Fiber / props 的登记，对应 React 源码 ReactDOMComponentTree.js。
 *
 * React 把 Fiber 指针和最新 props 作为 expando 属性直接挂在 DOM 节点上
 * （key 带 $ + 随机后缀，微前端多版本共存时互不踩踏；这里用固定 $mini 后缀演示）。
 * 派发时从节点直接读，不用查表 —— 也不依赖可能过期的 fiber.props（双缓冲下
 * DOM 上挂的 Fiber 可能仍指向上棵树，而 props expando 在 commitUpdate 里必然刷新）。
 */
const internalInstanceKey = '__reactFiber$mini';
const internalPropsKey = '__reactProps$mini';

/**
 * precacheFiberNode - 在 DOM 节点上登记 Fiber 指针
 *
 * 创建 DOM 时调用一次（对应源码 createInstance 内的 precacheFiberNode）。
 *
 * @param {object} fiber - Fiber 节点
 * @param {HTMLElement} domNode - DOM 节点
 */
export function precacheFiberNode(fiber, domNode) {
    domNode[internalInstanceKey] = fiber;
}

/**
 * updateFiberProps - 在 DOM 节点上登记最新 props
 *
 * 创建 DOM 时与每次 commitUpdate 时调用（保证派发读到的永远是已提交的 props）。
 *
 * @param {HTMLElement} domNode - DOM 节点
 * @param {object} props - 最新 props
 */
export function updateFiberProps(domNode, props) {
    domNode[internalPropsKey] = props;
}

/**
 * getFiberFromDOM - 从 DOM 节点反查 Fiber 节点
 *
 * @param {HTMLElement} dom - DOM 节点
 * @returns {object|null} Fiber 节点
 */
export function getFiberFromDOM(dom) {
    return dom?.[internalInstanceKey] || null;
}

/**
 * getFiberPropsFromDOM - 读取 DOM 节点上登记的最新 props
 *
 * @param {HTMLElement} dom - DOM 节点
 * @returns {object|null} props
 */
export function getFiberPropsFromDOM(dom) {
    return dom?.[internalPropsKey] || null;
}

// 根容器（initEventSystem 时记录，派发时从这里开始找目标）
let rootContainer = null;
// 防止重复绑定（render 可能被调用多次）
let initializedContainer = null;

/**
 * initEventSystem - 初始化事件系统
 *
 * 在根容器上为每种支持的事件绑定一个原生监听器。
 * 整个应用生命周期只执行一次，这就是「事件委托」的注册侧。
 *
 * React 17+ 绑定在 createRoot 的容器上（React 16 绑在 document 上）。
 *
 * @param {HTMLElement} container - 根容器 DOM 节点
 */
export function initEventSystem(container) {
    if (initializedContainer === container) return; // 幂等：同一容器只初始化一次
    initializedContainer = container;
    rootContainer = container;
    SUPPORTED_EVENTS.forEach((eventType) => {
        // 统一绑在冒泡阶段（capture 事件在派发阶段模拟，见 dispatchEvent）
        container.addEventListener(eventType, dispatchEvent, false);
    });
}

/**
 * isEventName - 判断 props key 是否为事件 prop（onXxx 驼峰形式）
 *
 * @param {string} name - props 键名
 * @returns {boolean}
 */
export function isEventName(name) {
    return /^on[A-Z]/.test(name);
}

/**
 * dispatchEvent - 统一派发器（注册在根容器上的那个监听器）
 *
 * 原生事件冒泡到根容器后进入这里：
 * 1. 通过 e.target 反查目标 Fiber
 * 2. 沿 return 指针向上收集路径上所有节点的 onClick / onClickCapture
 * 3. 构造合成事件，按 捕获 -> 冒泡 的顺序执行
 *
 * @param {Event} nativeEvent - 原生事件对象
 */
function dispatchEvent(nativeEvent) {
    const targetDOM = nativeEvent.target;
    const targetFiber = getFiberFromDOM(targetDOM);

    if (!targetFiber) {
        // 事件目标不属于本应用（如根容器外的节点冒泡进来），直接忽略
        return;
    }

    const eventName = nativeEvent.type;
    // 原生 click -> 合成 props 里的 onClick / onClickCapture
    const capitalized = eventName.charAt(0).toUpperCase() + eventName.slice(1);
    const bubbleKey = 'on' + capitalized;
    const captureKey = bubbleKey + 'Capture';

    // 沿 Fiber 树向上收集两条执行路径
    // bubblingPath: 从目标到根（冒泡顺序，直接用）
    // capturingPath: 从根到目标（收集时倒序记录）
    const bubblingPath = [];
    const capturingPath = [];

    let fiber = targetFiber;
    while (fiber) {
        // host 节点读 props expando（已提交的最新值，对应源码 getListener）；
        // 函数组件没有 stateNode，props expando 不挂在它身上，直接读 fiber.props
        const props = fiber.stateNode
            ? getFiberPropsFromDOM(fiber.stateNode) ?? fiber.props
            : fiber.props;
        const handler = props?.[bubbleKey];
        const captureHandler = props?.[captureKey];
        if (handler) {
            bubblingPath.push({ fiber, handler });
        }
        if (captureHandler) {
            capturingPath.push({ fiber, captureHandler });
        }
        fiber = fiber.return;
    }

    // 构造合成事件（整条路径共享同一个对象，等价于 React 的一次派发一个 SyntheticEvent）
    const syntheticEvent = createSyntheticEvent(nativeEvent);

    // 1. 模拟捕获阶段：从根到目标
    for (let i = capturingPath.length - 1; i >= 0; i--) {
        const { fiber, captureHandler } = capturingPath[i];
        syntheticEvent.currentTarget = fiber.stateNode;
        captureHandler(syntheticEvent);
        if (syntheticEvent.isPropagationStopped()) break;
    }

    // 2. 模拟冒泡阶段：从目标到根
    for (const { fiber, handler } of bubblingPath) {
        syntheticEvent.currentTarget = fiber.stateNode;
        handler(syntheticEvent);
        if (syntheticEvent.isPropagationStopped()) break;
    }
}
