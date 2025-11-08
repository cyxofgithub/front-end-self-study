## 通过 set 求两个数组的并集

将两个数组转换为 Set，这样可以去除数组中的重复元素，并且可以利用 Set 的高效查找特性。

```javascript
function intersetction(arr1: any[], arr2: any[]) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const result = [...set1].filter(item => set2.has(item));
    console.log('🚀 ~ intersetction ~ result:', result);
}

intersetction([2, 3, 5], [1, 12313, 322, 11, 2, 3]);
```
