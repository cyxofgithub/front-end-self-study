/**
 * Mini-React 主入口
 *
 * 提供 render 函数，用于将组件渲染到 DOM
 */

import { createElement } from './core/createElement.js';
import { createRootFiber, TAG } from './core/fiber.js';
import { updateContainer } from './core/reconciler.js';
import { initEventSystem } from './events/eventSystem.js';

/**
 * render - 渲染函数
 *
 * 将组件渲染到指定的 DOM 容器中
 *
 * @param {object} element - 虚拟 DOM 元素
 * @param {HTMLElement} container - DOM 容器
 *
 * @example
 * const App = () => createElement('div', null, 'Hello World');
 * render(createElement(App), document.getElementById('root'));
 */
export function render(element, container) {
    // 初始化事件系统：在根容器上为每种支持的事件绑定一个监听器（幂等）
    initEventSystem(container);

    // 创建根 Fiber 节点
    const rootFiber = createRootFiber(container);

    // 创建根节点的子节点（实际要渲染的内容）
    // 注意：保留 container 属性，不要覆盖整个 props
    rootFiber.props = {
        ...rootFiber.props,
        children: [element],
    };

    // 开始协调和渲染
    updateContainer(rootFiber);
}

// 导出 createElement，方便使用
export { createElement };

// 导出 hooks，方便使用
export { useState, useEffect } from './hooks/hooks.js';
