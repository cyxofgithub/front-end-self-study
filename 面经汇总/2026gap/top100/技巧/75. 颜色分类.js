/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
// var sortColors = function (nums) {
//     for (let i = 0; i < nums.length; i++) {
//         for (let j = 1; j < nums.length - i; j++) {
//             if (nums[j - 1] >= nums[j]) {
//                 [nums[j - 1], nums[j]] = [nums[j], nums[j - 1]];
//             }
//         }
//     }

//     return nums;
// };

// 双指针
var sortColors = function (nums) {
    let p0 = 0;
    let p2 = nums.length - 1;

    for (let i = 0; i <= p2; i++) {
        // 先找 2 很重要，因为 2 换过去后 nums[i] 可能是 0 下面再判断 0 做交换就没问题
        while (nums[i] === 2 && i < p2) {
            [nums[i], nums[p2]] = [nums[p2], nums[i]];
            p2--;
        }

        if (nums[i] === 0) {
            [nums[i], nums[p0]] = [nums[p0], nums[i]];
            p0++;
        }
    }
};

console.log(sortColors([1, 2, 0]));
