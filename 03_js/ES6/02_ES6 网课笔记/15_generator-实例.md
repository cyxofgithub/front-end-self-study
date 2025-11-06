## 15.generator-实例

- 对于多个异步请求
- Promise 适合一次读一组
- generator 适合逻辑性的

```
// 带逻辑-generator
runner(function * () {
    let userData = yield $.ajax({url: 'getUserData'})

    if (userData.type == 'VIP') {
        let items = yield $.ajax({url: 'getVIPItems'})
    } else {
        let items = yield $.ajax({url: 'getItems'})
    }
})
// yield 实例，用同步方式写异步
server.use(function * () {
    let data = yield db.query(`select * from user_table`)
    this.body = data
})
```