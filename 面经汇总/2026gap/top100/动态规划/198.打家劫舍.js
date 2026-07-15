/**
 * @param {number[]} nums
 * @return {number}
 */
// var rob = function (nums) {
//     const dp = new Array(nums.length + 1).fill(0);

//     dp[0] = 0;
//     dp[1] = nums[0];

//     for (let i = 2; i <= nums.length; i++) {
//         dp[i] = Math.max(dp[i - 2] + nums[i - 1], dp[i - 1]);
//     }

//     return dp[nums.length];
// };

var rob = function (nums) {
    if (!nums.length) return 0;
    if (nums.length === 1) return nums[0];

    let first = nums[0];
    let second = Math.max(nums[0], nums[1]);

    for (let i = 2; i < nums.length; i++) {
        let temp = second;
        second = Math.max(first + nums[i], second);
        first = temp;
    }

    return second;
};

console.log(rob([1, 2, 3, 1]));
