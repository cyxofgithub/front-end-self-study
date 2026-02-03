/**
 * createElement - 创建虚拟 DOM 对象
 * 
 * 将 JSX 转换为虚拟 DOM 对象，格式：{type, props, children}
 * 
 * @param {string|Function} type - 元素类型（如 'div'）或组件函数
 * @param {object} props - 元素属性
 * @param {...any} children - 子元素
 * @returns {object} 虚拟 DOM 对象
 * 
 * @example
 * createElement('div', {id: 'app'}, 'Hello', createElement('span', null, 'World'))
 * // {type: 'div', props: {id: 'app', children: ['Hello', {type: 'span', props: {children: ['World']}}]}}
 */
export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 将 children 扁平化处理，文本节点转为字符串
      children: children.map(child =>
        typeof child === 'object' 
          ? child 
          : createTextElement(child)
      ),
    },
  };
}

/**
 * createTextElement - 创建文本节点
 * 
 * 将文本内容包装为虚拟 DOM 对象
 * 
 * @param {string|number} text - 文本内容
 * @returns {object} 文本节点的虚拟 DOM 对象
 */
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
