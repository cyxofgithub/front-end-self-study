/**
 * @param {number[]} nums
 * @return {number}
 */
// var singleNumber = function (nums) {
//     const map = new Map();

//     for (let i = 0; i < nums.length; i++) {
//         map.set(nums[i], (map.get(nums[i]) || 0) + 1);
//     }

//     return [...map.entries()].sort((a, b) => a[1] - b[1])[0][0];
// };

// 异或运算 a ^ a = 0 a ^ 0 = a
var singleNumber = function (nums) {
    let target = 0;

    for (const num of nums) {
        target ^= num;
    }

    return target;
};
