## 题目

![Alt text](image.png)

## 暴力解法

思路：
1、尝试用 5 块的货币 0 张、1 张、2 张...
2、用这种方式不断尝试

```javascript
const arr = [5, 10, 25, 1];
const aim = 15;

function getAns(arr, aim) {
    if (aim === 0) return 0;

    return process(arr, aim, 0);
}

function process(arr, aim, i) {
    let res = 0;

    if (aim < 0) {
        return res;
    }

    if (aim === 0) {
        res++;
        return res;
    }

    for (let j = 0; arr[i] * j <= aim; j++) {
        res += process(arr, aim - arr[i] * j, i + 1);
    }

    return res;
}

console.log(getAns(arr, aim));
```
