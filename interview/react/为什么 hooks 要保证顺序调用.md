## 为什么 hooks 要保证顺序调用

```javascript
const { render } = require("react-dom");
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
