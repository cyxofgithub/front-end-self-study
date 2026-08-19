/**
 * SyntheticEvent - 合成事件
 *
 * 对原生事件的轻量包装，抹平浏览器差异（React 同名概念）。
 * React <=16 基于事件池复用对象（事件结束后置空字段），React 17 起已移除事件池；
 * 这里按 17+ 的行为实现：不回收，但保留 nativeEvent 通道。
 */

/**
 * 创建合成事件对象
 *
 * @param {Event} nativeEvent - 浏览器原生事件对象
 * @returns {object} 合成事件
 */
export function createSyntheticEvent(nativeEvent) {
    // 阻止事件沿 Fiber 树继续传播（对应原生的 stopPropagation）
    let propagationStopped = false;

    const syntheticEvent = {
        // 原生事件对象：需要浏览器原生行为时使用（如 stopImmediatePropagation）
        nativeEvent,

        // 常用字段直接从原生事件同步
        type: nativeEvent.type,
        target: nativeEvent.target,
        currentTarget: null, // 派发过程中动态写入，指向当前 handler 所属的 DOM 节点

        // 标准方法：委托在根节点后，preventDefault/stopPropagation
        // 都要透传给原生事件，才能真正影响浏览器行为
        preventDefault() {
            nativeEvent.preventDefault();
        },
        stopPropagation() {
            propagationStopped = true;
            nativeEvent.stopPropagation();
        },

        // 供派发器查询：是否已被某个 handler 叫停
        isPropagationStopped() {
            return propagationStopped;
        },
    };

    return syntheticEvent;
}
