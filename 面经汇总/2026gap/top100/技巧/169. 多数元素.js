/**
 * @param {number[]} nums
 * @return {number}
 */
// 排序法
// var majorityElement = function (nums) {
//     const index = Math.floor(nums.length / 2);

//     return nums.sort((a, b) => a - b)[index];
// };

// 摩尔投票法
var majorityElement = function (nums) {
    let candidate = null;
    let count = 0;

    for (const num of nums) {
        if (count === 0) {
            candidate = num;
        }

        count = count + (num === candidate ? 1 : -1);
    }

    return candidate;
};
