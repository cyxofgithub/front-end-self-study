## XMLHttpRequest readyState

`readyState` 是 `XMLHttpRequest` 对象的属性，表示请求所处的状态阶段。

### 五个状态码

| 值 | 常量 | 含义 |
|---|---|---|
| 0 | `UNSENT` | `open()` 尚未调用 |
| 1 | `OPENED` | `open()` 已调用 |
| 2 | `HEADERS_RECEIVED` | `send()` 已调用，已收到响应头和状态码 |
| 3 | `LOADING` | 正在接收响应体，`responseText` 部分可用 |
| 4 | `DONE` | 请求完成，响应数据完全就绪 |

### 状态流转

```
UNSENT(0) --open()--> OPENED(1) --send()--> HEADERS_RECEIVED(2) --数据到达--> LOADING(3) --传输完毕--> DONE(4)
```

- `onreadystatechange` 在每次 `readyState` 变化时触发（除 0→1 外）
- 实际开发中通常只关心 `readyState === 4`，再配合 `status === 200` 判断成功

### 示例

```js
const xhr = new XMLHttpRequest();
xhr.open("GET", "/api/data");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
xhr.send();
```
