## 题目

给定数组 arr，arr 中所有的值都为正数且不重复。每个值代表一种面值的货币，每种面值的货币可以使用任意张，再给定一个整数 aim，代表要找的钱数，求组成 aim 的最少货币数。

## 解法 1

```javascript
class ExchangeMoney {
    static exec(arr, aim) {
        if (arr === null || !arr.length || aim < 0) return -1;

        return this.process(arr, 0, aim);
    }

    // 当前考虑的面值是 arr[i], 还剩 aim 的钱需要找
    // 如果返回 -1，说明自由使用 arr[i...N-1]面值的情况下，无论如何也无法找零rest
    // 如果返回不是 -1，代表自由使用 arr[i...N-1]面值的情况下，找零rest需要的最少张树
    static process(arr, i, aim) {
        if (i === arr.length) {
            return aim === 0 ? 0 : -1;
        }
        let res = -1;
        for (let k = 0; arr[i] * k <= aim; k++) {
            const count = arr[i] * k;
            const next = this.process(arr, i + 1, aim - count);

            if (next !== -1) {
                const num = k + next;
                res = res === -1 ? num : Math.min(res, num);
            }
        }

        return res;
    }
}

console.log(ExchangeMoney.exec([5, 2, 3], 20));
```
