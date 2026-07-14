/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
    if (n <= 2) return n;

    let a = 0,
        b = 1,
        c = 2;

    for (let i = 3; i <= n; i++) {
        a = b;
        b = c;
        c = a + b;
    }

    return c;
};

// var climbStairs = function (n) {
//     if (n <= 2) return n;
//     const dp = [0, 1, 2];

//     for (let i = 3; i <= n; i++) {
//         dp[i] = dp[i - 1] + dp[i - 2];
//     }

//     return dp[n];
// };

console.log(climbStairs(44));
