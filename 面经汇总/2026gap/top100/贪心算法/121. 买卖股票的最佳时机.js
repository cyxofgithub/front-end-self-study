/**
 * @param {number[]} prices
 * @return {number}
 */
// var maxProfit = function (prices) {
//     let max = 0;
//     for (let i = 0; i < prices.length; i++) {
//         for (let j = i; j < prices.length; i++) {
//             max = Math.max(prices[j] - prices[i], max);
//         }
//     }

//     return max;
// };

var maxProfit = function (prices) {
    let max = 0;
    let min = Infinity;

    for (const price of prices) {
        // 保持持有的价格最低
        if (min > price) {
            min = price;
        } else {
            // 不断计算在什么时候卖出更好
            max = Math.max(price - min, max);
        }
    }

    return max;
};
