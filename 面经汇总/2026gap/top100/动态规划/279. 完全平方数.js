/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function (n) {
    // dp[i] 表示 i 的最少解
    const dp = new Array(n + 1).fill(0);
    dp[0] = 0;

    for (let i = 1; i <= n; i++) {
        let min = Number.MAX_VALUE;
        for (let j = 1; j * j <= i; j++) {
            min = Math.min(min, dp[i - j * j]);
        }
        dp[i] = min + 1;
    }

    return dp[n];
};

console.log(numSquares(12));
