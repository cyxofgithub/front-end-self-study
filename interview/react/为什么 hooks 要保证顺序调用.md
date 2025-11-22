## 为什么 hooks 要保证顺序调用

```javascript
const { render } = require('react-dom');
let memoriedStates = [];
let lastIndex = 0;
function useState(initialState) {
    memoriedStates[lastIndex] = memoriedStates[lastIndex] || initialState;
    function setState(newState) {
        memoriedStates[lastIndex] = newState;
        // 状态更新完毕，调用render函数。重新更新视图
        render();
    }
    // 返回最新状态和更新函数，注意index要前进
    return [memoriedStates[lastIndex++], setState];
}
```

以 useState 的实现为例，每次重新 render 的时候会根据调用顺序去获取当前的值，如果顺序错误了，值也会错乱

### 为什么这么设计？

React 不直接用“一个 hook 和一个状态对象”做映射（比如 Map<hook, state>），而是用“顺序”来对应 state，下标递增拿 state，这样做的原因：

1. hooks 本质是函数调用，不能像 class/对象那样有实例和 identity（引用地址）；hook 只是“调用时的代码片段”，没有真正的“hook 实例对象”可作为 key。
2. 顺序式设计简单，性能也好，不需要为每个 hook 单独管理标识符。
