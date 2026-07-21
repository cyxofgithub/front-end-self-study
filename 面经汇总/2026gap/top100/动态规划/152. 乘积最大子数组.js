/**
 * @param {number[]} nums
 * @return {number}
 */
// var maxProduct = function (nums) {
//     let max = nums[0];

//     for (let i = 1; i < nums.length; i++) {
//         let temp = 1;
//         let j = i;
//         while (j >= 0) {
//             temp *= nums[j];
//             j--;
//             max = Math.max(temp, max);
//         }
//     }

//     return max;
// };

var maxProduct = function (nums) {
    const n = nums.length;
    // minDp[i] 代表以 i 为结尾的乘积最小值
    // 负数 × 负数 = 正数
    // 前面一个很小的负数最小值，乘上当前负数，反而变成很大的正数。
    const minDp = new Array(n);
    // maxDp[i] 代表以 i 为结尾的乘积最大值
    const maxDp = new Array(n);
    minDp[0] = nums[0];
    maxDp[0] = nums[0];
    let ans = nums[0];

    for (let i = 1; i < n; i++) {
        maxDp[i] = Math.max(
            nums[i],
            maxDp[i - 1] * nums[i],
            minDp[i - 1] * nums[i]
        );

        minDp[i] = Math.min(
            nums[i],
            maxDp[i - 1] * nums[i],
            minDp[i - 1] * nums[i]
        );

        ans = Math.max(ans, maxDp[i]);
    }

    return ans;
};

// 空间优化做法
// var maxProduct = function (nums) {
//     const n = nums.length;
//     const minDp = new Array(n);
//     const maxDp = new Array(n);
//     let min = nums[0];
//     let max = nums[0];
//     let ans = nums[0];

//     for (let i = 1; i < n; i++) {
//         let temp = max;
//         max = Math.max(nums[i], max * nums[i], min * nums[i]);
//         min = Math.min(nums[i], temp * nums[i], min * nums[i]);

//         ans = Math.max(ans, max);
//     }

//     return ans;
// };

console.log(maxProduct([1, 0, -5, 2, 3, -8, -9]));
