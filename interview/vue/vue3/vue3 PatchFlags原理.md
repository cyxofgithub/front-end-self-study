## vue3 PatchFlags原理
对动态节点添加标记，只标记出需要更新的部分（如文本、class、style），对比时只处理带标记的节点：

```javascript
// 编译后给动态节点添加标记（1 表示文本更新）
createVNode('span', { class: state.cls }, null, 1 /* TEXT */)

// 对比时只处理有标记的节点
function patch(n1, n2) {
  if (n2.patchFlag) {
    if (n2.patchFlag & 1) {
      // 只更新文本内容
      updateText(n1, n2)
    }
    // 其他标记处理...
  }
}
```