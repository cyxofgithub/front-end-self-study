/**
 * @param {number[]} nums
 * @return {number}
 */

// 但凡求子序列、子串、递增 / 递减、不连续选取类 DP：
// 子串（连续）：天然以 i 结尾，很常用；
// 子序列（不连续）：很难用「前 i 个全局最优」做状态，优先选用 dp[i] = 以i结尾的合法序列最优值；
// 原因：子序列可以选择性抛弃前面元素，必须固定结尾才能建立递推关系。
var lengthOfLIS = function (nums) {
    if (!nums.length) return 0;

    // dp[i] 代表以 i 为结尾的最长
    const dp = new Array(nums.length).fill(1);
    let max = 1;

    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }

        max = Math.max(dp[i], max);
    }

    return max;
};

// 4
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));
