## map 和 forEach 遍历能改原始对象不

能，测试代码：

```javascript
const arr = [{ a: 1 }];

// arr.forEach((item) => {
//     item.a = 123;
// });

arr.map(item => {
    item.a = 123;
});

console.log(arr);
```
