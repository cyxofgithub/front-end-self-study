## 11.json

- JSON 格式
  - JavaScript Object Notation 的缩写，是一种用于数据交换的文本格式
  - JSON 是 JS对象 的严格子集
  - JSON 的标准写法
  - 只能用双引号
  - 所有的key都必须用双引号包起来
- JSON 对象
  - JSON 对象是 JavaScript 的原生对象，用来处理 JSON 格式数据，有两个静态方法
  - JSON.parse(string) ：接受一个 **JSON 字符串**并将其转换成一个 JavaScript **对象**。
  - JSON.stringify(obj) ：接受一个 JavaScript **对象**并将其转换为一个 **JSON 字符串**。

```
var json = {a: 12, b: 5}
var str = 'hi,' + JSON.stringify(json)
var url = 'http://www.xx.com/' + encodeURIComponent(JSON.stringify(json))
console.log(str)
console.log(url)

var str = '{"a": 12, "b": 4, "c": "abc"}'
var json = JSON.parse(str)
console.log(json)
hi,{"a":12,"b":5}
http://www.xx.com/%7B%22a%22%3A12%2C%22b%22%3A5%7D
{ a: 12, b: 4, c: 'abc' }
```

- 对象（object）
  - 是 JavaScript 语言的核心概念，也是最重要的数据类型
  - 对象就是一组“键值对”（key-value）的集合，是一种无序的复合数据集合
  - 对象的所有键名都是字符串, 所以加不加引号都可以
  - 如果键名是数值，会被自动转为字符串
  - 对象的每一个键名又称为“属性”（property），它的“键值”可以是任何数据类型
  - 如果一个属性的值为函数，通常把这个属性称为“方法”，它可以像函数那样调用
  - in 运算符用于检查对象是否包含某个属性（注意，检查的是键名，不是键值
  - for...in循环用来遍历一个对象的全部属性
- 对象 简写
  - key-value 一样时可以简写
  - 里面函数可以简写, 去掉

```
var a = 12, b = 5
// key-value 一样时可以简写
console.log({a:a, b:b})
console.log({a, b})
console.log({a, b, c:"c"})

// 里面函数可以简写, 去掉
show:function(){
}
show(){
}
```