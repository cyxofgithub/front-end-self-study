## 13.generator-认识生成器函数

- generator 生成器函数
  - 普通函数，一路到底
  - generator函数，中间可以停，到哪停呢，用 yield 配合，交出执行权
  - yield 有 放弃、退让、退位的意思
  - 需要调用next()方法启动执行，需要遇到 yield 停, 踹一脚走一步
  - generator函数前面加一个 `*` 两边可以有空格，或靠近函数或`function`
  - 背后实际生成多个小函数，实现走走停停

```
function show() {
    console.log('a')
    console.log('b')
}
show() // 普通函数

function *show2() {
    console.log('1')
    yield
    console.log('2')
}

let genObj = show2()

genObj.next() // 1
genObj.next() // 2
genObj.next() // 最后了，没有结果
```