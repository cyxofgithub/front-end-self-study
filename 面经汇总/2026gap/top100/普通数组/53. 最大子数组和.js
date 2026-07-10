/**
 * @param {number[]} nums
 * @return {number}
 */
// var maxSubArray = function (nums) {
//     let max = -Infinity;

//     for (let i = 0; i < nums.length; i++) {
//         let count = 0;
//         if (nums[i] <= 0 && nums[i] < max) continue;

//         for (let j = i; j < nums.length; j++) {
//             count += nums[j];
//             max = Math.max(max, count);
//         }
//     }

//     return max;
// };
var maxSubArray = function (nums) {
    let max = -Infinity;
    let pre = 0;

    // 动态转移方程：
    // pre 代表 f(i - 1) 的最大数组值
    // f(i) = Math.max(f(i - 1) + nums[i], nums[i])
    for (let i = 0; i < nums.length; i++) {
        pre = Math.max(pre + nums[i], nums[i]);
        max = Math.max(pre, max);
    }

    return max;
};

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
