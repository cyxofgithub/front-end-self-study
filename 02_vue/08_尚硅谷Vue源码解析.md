# Vue源码解析之虚拟DOM和diff算法

## 01 课程内容介绍

![image-20220222205735903](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220222205735903.png)

## 02 snabbdom 简介和测试环境搭配

### snabbdom

tips：虚拟 dom 的核心库

#### 安装

![image-20220222210231681](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220222210231681.png)

#### 测试环境搭建

![image-20220222210852288](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220222210852288.png)

```js
module.exports = {
    // 入口
    entry: './src/index.js',
    // 出口
    output: {
        // （webpack-dev-server的时候）虚拟打包路径，就是说文件夹不会真正生成，而是在8080端口虚拟生成
        publicPath: 'xuni',
        // 打包出来的文件名，不会真正的物理生成
        filename: 'bundle.js'
    },
    devServer: {
        // 端口号
        port: 8080,
        // 静态资源文件夹
        contentBase: 'www'
    }
};
```

## 03 虚拟Dom和h函数

### 虚拟Dom 概念

![image-20220222212356880](08_尚硅谷Vue源码解析.assets/image-20220222212356880.png)

### diff 是发生在虚拟DOM上的

![image-20220222212621373](08_尚硅谷Vue源码解析.assets/image-20220222212621373.png)

### 本次课研究什么？

![image-20220222212923170](08_尚硅谷Vue源码解析.assets/image-20220222212923170.png)

###  h 函数用来产生虚拟节点

![image-20220222213232613](08_尚硅谷Vue源码解析.assets/image-20220222213232613.png)

### 一个虚拟节点有多些属性

![image-20220222213352521](08_尚硅谷Vue源码解析.assets/image-20220222213352521.png)

```js
import { init } from 'snabbdom/init';
import { classModule } from 'snabbdom/modules/class';
import { propsModule } from 'snabbdom/modules/props';
import { styleModule } from 'snabbdom/modules/style';
import { eventListenersModule } from 'snabbdom/modules/eventlisteners';
import { h } from 'snabbdom/h';

// 创建出patch函数
const patch = init([classModule, propsModule, styleModule, eventListenersModule]);

// 创建虚拟节点
const myVnode1 = h('a', {
    props: {
        href: 'http://www.atguigu.com',
        target: '_blank'
    }
}, '尚硅谷');

// 没有属性的话可以省略第二个参数
const myVnode2 = h('div', '我是一个盒子');

// 有层级的嵌套用数组
const myVnode3 = h('ul', [
    h('li', {}, '苹果'),
    h('li', '西瓜'),
    h('li', [
        h('div', [
            h('p', '哈哈'),
            h('p', '嘻嘻')
        ])
    ]),
    h('li', h('p', '火龙果')) // 单个嵌套可以省略数组
]);

console.log(myVnode3);

// 让虚拟节点上树
const container = document.getElementById('container');
patch(container, myVnode3);
```

![image-20220222215853489](08_尚硅谷Vue源码解析.assets/image-20220222215853489.png)

## 04_手写 h 函数

**vnode.js**

![image-20220222220150837](08_尚硅谷Vue源码解析.assets/image-20220222220150837.png)

**h.js**

```js
import vnode from './vnode.js';

// 编写一个低配版本的h函数，这个函数必须接受3个参数，缺一不可
// 相当于它的重载功能较弱。
// 也就是说，调用的时候形态必须是下面的三种之一：
// 形态① h('div', {}, '文字')
// 形态② h('div', {}, [])
// 形态③ h('div', {}, h())
export default function (sel, data, c) {
    // 检查参数的个数
    if (arguments.length != 3)
        throw new Error('对不起，h函数必须传入3个参数，我们是低配版h函数');
    // 检查参数c的类型
    if (typeof c == 'string' || typeof c == 'number') {
        // 说明现在调用h函数是形态①
        return vnode(sel, data, undefined, c, undefined);
    } else if (Array.isArray(c)) {
        // 说明现在调用h函数是形态②
        let children = [];
        // 遍历c，收集children
        for (let i = 0; i < c.length; i++) {
            // 检查c[i]必须是一个对象，如果不满足
            if (!(typeof c[i] == 'object' && c[i].hasOwnProperty('sel')))
                throw new Error('传入的数组参数中有项不是h函数');
            // 这里不用执行c[i]，因为你的测试语句中已经有了执行
            // 此时只需要收集好就可以了
            children.push(c[i]);
        }
        // 循环结束了，就说明children收集完毕了，此时可以返回虚拟节点了，它有children属性的
        return vnode(sel, data, children, undefined, undefined);
    } else if (typeof c == 'object' && c.hasOwnProperty('sel')) {
        // 说明现在调用h函数是形态③
        // 即，传入的c是唯一的children。不用执行c，因为测试语句中已经执行了c。
        let children = [c];
        return vnode(sel, data, children, undefined, undefined);
    } else {
        throw new Error('传入的第三个参数类型不对');
    }
};
```

## 05_感受 diff 算法

![image-20220222223913479](08_尚硅谷Vue源码解析.assets/image-20220222223913479.png)

```js
// 得到盒子和按钮
const container = document.getElementById('container');
const btn = document.getElementById('btn');

// 创建出patch函数
const patch = init([classModule, propsModule, styleModule, eventListenersModule]);

const vnode1 = h('ul', {}, [
    h('li', { key: 'A' }, 'A'),
    h('li', { key: 'B' }, 'B'),
    h('li', { key: 'C' }, 'C'),
    h('li', { key: 'D' }, 'D')
]);

patch(container, vnode1);

const vnode2 = h('ul', {}, [
    h('li', { key: 'D' }, 'D'),
    h('li', { key: 'A' }, 'A'),
    h('li', { key: 'C' }, 'C'),
    h('li', { key: 'B' }, 'B')
]);

// 点击按钮时，将vnode1变为vnode2
btn.onclick = function () {
    patch(vnode1, vnode2); // 因为 key 相同内容也没有变化，diff 算法后节点只是移动位置
};
```

## 06 diff处理新旧节点不是同一个节点时

### patch 函数执行流程

![image-20220223212947760](08_尚硅谷Vue源码解析.assets/image-20220223212947760.png)

![image-20220223211803510](08_尚硅谷Vue源码解析.assets/image-20220223211803510.png)

### 如何定义同一个节点

![image-20220223213254114](08_尚硅谷Vue源码解析.assets/image-20220223213254114.png)

### 创建节点时，所有子节点需要递归创建

![image-20220223213639253](08_尚硅谷Vue源码解析.assets/image-20220223213639253.png)

## 07_手写第一次上树时

createElement.js

![image-20220223215432260](08_尚硅谷Vue源码解析.assets/image-20220223215432260.png)

## 08_手写递归创建子节点

createElement.js

```js
export default function createElement(vnode) {
    // console.log('目的是把虚拟节点', vnode, '真正变为DOM');
    // 创建一个DOM节点，这个节点现在还是孤儿节点
    let domNode = document.createElement(vnode.sel);
    // 有子节点还是有文本？？
    if (vnode.text != '' && (vnode.children == undefined || vnode.children.length == 0))     {
        // 它内部是文字
        domNode.innerText = vnode.text;
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
        // 它内部是子节点，就要递归创建节点
        for (let i = 0; i < vnode.children.length; i++) {
            // 得到当前这个children
            let ch = vnode.children[i];
            // 创建出它的DOM，一旦调用createElement意味着：创建出DOM了，并且它的elm属性指向了创建出的DOM，但是还没有上树，是一个孤儿节点。
            let chDOM = createElement(ch);
            // 上树
            domNode.appendChild(chDOM);
        }
    }
    // 补充elm属性
    vnode.elm = domNode;
   
    // 返回elm，elm属性是一个纯DOM对象
    return vnode.elm;
};
```

patch.js

```js
import vnode from './vnode.js';
import createElement from './createElement.js';
import patchVnode from './patchVnode.js'

export default function patch(oldVnode, newVnode) {
    // 判断传入的第一个参数，是DOM节点还是虚拟节点？
    if (oldVnode.sel == '' || oldVnode.sel == undefined) {
        // 传入的第一个参数是DOM节点，此时要包装为虚拟节点
        oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode);
    }

    // 判断oldVnode和newVnode是不是同一个节点
    if (oldVnode.key == newVnode.key && oldVnode.sel == newVnode.sel) {
        console.log('是同一个节点');
        patchVnode(oldVnode, newVnode);
    } else {
        console.log('不是同一个节点，暴力插入新的，删除旧的');
        let newVnodeElm = createElement(newVnode);
        
        // 插入到老节点之前
        if (oldVnode.elm.parentNode && newVnodeElm) {
            oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm);
        }
        // 删除老节点
        oldVnode.elm.parentNode.removeChild(oldVnode.elm);
    }
};
```

