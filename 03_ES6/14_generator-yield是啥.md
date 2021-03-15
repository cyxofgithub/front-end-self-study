## 14.generator-yield是啥

- `yield`
  - 既可传参，又可以返回
  - 第一个`next()`传参无效，只用来启动
- 如果函数前漏掉 `*`
  - 就是普通函数
  - 如果有`yield`会报错， `ReferenceError: yield is not defined`
  - yield 只能在Generator函数内部使用

```
function * show() {
    console.log('1')
    var a = yield
    console.log('2')
    console.log(a)
}
// yield 传参
var gen = show()
gen.next() // 1
gen.next() // 2 和 undefined 因为没有传参，yield没有返回值
var gen = show()
gen.next(10) // 1 第一次执行到yield，但没有执行赋值
gen.next(20) // 2 和 20

function* show2() {
    console.log('1')
    yield 10
    console.log('2')
}
// yield 返回
var gen = show2()
var res1 = gen.next()
console.log(res1) // { value: 10, done: false } 
// done 表示还没有执行结束
var res2 = gen.next()
console.log(res2)
// { value: undefined, done: true } 最后的value需要return返回
```