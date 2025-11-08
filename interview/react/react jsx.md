## react jsx

### 什么是 jsx

实际上，它只是为 React.createElement() 函数提供语法糖，为我们提供了在 JavaScript 中使用类 HTML 模板语法的能力。

```javascript
// babel 转换前
return (
    <div>
        <h1>Count: {count}</h1>
    </div>
);

// babel 转换后
return /*#__PURE__*/ React.createElement(
    "div",
    null,
    /*#__PURE__*/ React.createElement("h1", null, "Count: ", count)
);
```

### jsx 转换成真实 dom 的过程

前面我们提到 jsx 经过 babel 转换后会转换成 React.createElement 的形式，React.createElement 其被调用时会传⼊标签类型 type，标签属性 props 及若干子元素 children，作用是生成一个虚拟 Dom 对象，如下所示：

```javascript
function createElement(type, config, ...children) {
    if (config) {
        delete config.__self;
        delete config.__source;
    }
    // ! 源码中做了详细处理，⽐如过滤掉key、ref等
    const props = {
        ...config,
        children: children.map((child) =>
            typeof child === "object" ? child : createTextNode(child)
        ),
    };
    return {
        type,
        props,
    };
}
function createTextNode(text) {
    return {
        type: TEXT,
        props: {
            children: [],
            nodeValue: text,
        },
    };
}
```

得到 虚拟 dom 后可以通过 ReactDom.render 渲染到真实的节点上，使用方式如下：

```javascript
ReactDOM.render(element, container[, callback])
```

render 实现如下：

```javascript
function render(vnode, container) {
    console.log("vnode", vnode); // 虚拟DOM对象
    // vnode _> node
    const node = createNode(vnode, container);
    container.appendChild(node);
}

// 创建真实DOM节点
function createNode(vnode, parentNode) {
    let node = null;
    const { type, props } = vnode;
    if (type === TEXT) {
        node = document.createTextNode("");
    } else if (typeof type === "string") {
        node = document.createElement(type);
    } else if (typeof type === "function") {
        node = type.isReactComponent
            ? updateClassComponent(vnode, parentNode)
            : updateFunctionComponent(vnode, parentNode);
    } else {
        node = document.createDocumentFragment();
    }
    reconcileChildren(props.children, node);
    updateNode(node, props);
    return node;
}

// 遍历下子vnode，然后把子vnode->真实DOM节点，再插入父node中
function reconcileChildren(children, node) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (Array.isArray(child)) {
            for (let j = 0; j < child.length; j++) {
                render(child[j], node);
            }
        } else {
            render(child, node);
        }
    }
}
function updateNode(node, nextVal) {
    Object.keys(nextVal)
        .filter((k) => k !== "children")
        .forEach((k) => {
            if (k.slice(0, 2) === "on") {
                let eventName = k.slice(2).toLocaleLowerCase();
                node.addEventListener(eventName, nextVal[k]);
            } else {
                node[k] = nextVal[k];
            }
        });
}

// 返回真实dom节点
// 执行函数
function updateFunctionComponent(vnode, parentNode) {
    const { type, props } = vnode;
    let vvnode = type(props);
    const node = createNode(vvnode, parentNode);
    return node;
}

// 返回真实dom节点
// 先实例化，再执行render函数
function updateClassComponent(vnode, parentNode) {
    const { type, props } = vnode;
    let cmp = new type(props);
    const vvnode = cmp.render();
    const node = createNode(vvnode, parentNode);
    return node;
}
export default {
    render,
};
```

### 总结

其渲染流程如下所示：

1、使用 React.createElement 或 JSX 编写 React 组件，实际上所有的 JSX 代码最后都会转换成 React.createElement(...) ，Babel 帮助我们完成了这个转换的过程。
2、createElement 函数对 key 和 ref 等特殊的 props 进行处理，并获取 defaultProps 对默认 props 进行赋值，并且对传入的孩子节点进行处理，最终构造成一个虚拟 DOM 对象
3、ReactDOM.render 将生成好的虚拟 DOM 渲染到指定容器上，其中采用了批处理、事务等机制并且对特定浏览器进行了性能优化，最终转换为真实 DOM
