/**
 * Fiber 节点类型
 */
export const TAG = {
  HOST_COMPONENT: 'HOST_COMPONENT',      // 原生 DOM 元素（如 div、span）
  FUNCTION_COMPONENT: 'FUNCTION_COMPONENT', // 函数式组件
  HOST_ROOT: 'HOST_ROOT',                // 根节点
};

/**
 * 副作用类型（Effect Tag）
 */
export const EFFECT_TAG = {
  PLACEMENT: 'PLACEMENT',  // 新增节点
  UPDATE: 'UPDATE',        // 更新节点
  DELETION: 'DELETION',    // 删除节点
};

/**
 * 创建 Fiber 节点
 * 
 * @param {string} tag - 节点类型（TAG）
 * @param {string|Function} type - 元素类型或组件函数
 * @param {object} props - 属性
 * @returns {object} Fiber 节点
 */
export function createFiber(tag, type, props) {
  return {
    tag,                    // 节点类型
    type,                   // 元素类型或组件函数
    props,                  // 属性
    stateNode: null,        // 对应的 DOM 节点或组件实例
    child: null,            // 第一个子节点
    sibling: null,          // 下一个兄弟节点
    return: null,           // 父节点
    alternate: null,        // 对应的另一棵树上的节点（用于双缓冲）
    effectTag: null,        // 副作用类型（PLACEMENT、UPDATE、DELETION）
    effects: [],            // 副作用链表
  };
}

/**
 * 创建根 Fiber 节点
 * 
 * @param {HTMLElement} container - DOM 容器
 * @returns {object} 根 Fiber 节点
 */
export function createRootFiber(container) {
  return createFiber(TAG.HOST_ROOT, null, { container });
}
