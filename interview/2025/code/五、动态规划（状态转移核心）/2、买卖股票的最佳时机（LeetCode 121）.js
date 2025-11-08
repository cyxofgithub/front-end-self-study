// 问题：给定股价数组，求最大利润。
// 解法：贪心算法，记录当前最小价格。
// 股价数组：[7, 1, 5, 3, 6, 4]
// 分析可能的交易：
// 第 1 天买入（7 元），之后任何一天卖出都亏损（比如第 2 天卖亏 6 元，第 3 天卖亏 2 元），利润为负。
// 第 2 天买入（1 元），第 3 天卖出赚 4 元（5-1），第 5 天卖出赚 5 元（6-1），这是最大的。
// 其他时机买入的利润都比 “第 2 天买，第 5 天卖” 低。
// 因此最大利润是 5。

// 暴力解
function getMaxProhit(arr = []) {
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
        const buy = arr[i];

        for (let j = i + 1; j < arr.length; j++) {
            result = Math.max(arr[j] - buy, result);
        }
    }

    return result;
}

// 贪心算法优化
// 思路：我只有买入最低的价格才有可能博取最大的利润
// 局部最优解->全局最优解
// 理解这道题可以想象一下k线图，低点与高点的高度差，肯定在更低的点才有可能获取更大的高度差

// 时间复杂度 o(n);
// 空间复杂度 o(1)
function getMaxProhit2(arr = []) {
    let maxProfit = 0;
    let minPrice = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < minPrice) {
            minPrice = arr[i];
        } else {
            maxProfit = Math.max(arr[i] - minPrice, maxProfit);
        }
    }

    return maxProfit;
}

console.log(getMaxProhit([7, 1, 5, 3, 6, 4]));
console.log(getMaxProhit2([7, 1, 5, 3, 6, 4]));
