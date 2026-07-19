/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
// var coinChange = function (coins, amount) {
//     if (amount === 0) return 0;

//     const dp = new Array(amount + 1).fill(-1);

//     for (const coin of coins) {
//         dp[coin] = 1;
//     }

//     for (let i = 1; i <= amount; i++) {
//         if (coins.includes(i)) continue;

//         let min = Number.MAX_VALUE;
//         for (const coin of coins) {
//             if (i - coin > 0 && dp[i - coin] > 0) {
//                 min = Math.min(dp[i - coin], min);
//             }
//         }
//         dp[i] = dp[i] === -1 && min !== Number.MAX_VALUE ? min + 1 : dp[i];
//     }

//     return dp[amount];
// };

var coinChange = function (coins, amount) {
    // dp[i] = 凑成金额i的最少硬币数
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // 金额0不需要硬币

    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            // 只有i >= coin才可以选这个硬币
            if (i >= coin) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    // 如果仍然是无穷大，说明无法拼凑
    return dp[amount] === Infinity ? -1 : dp[amount];
};

console.log(coinChange([2], 3));
