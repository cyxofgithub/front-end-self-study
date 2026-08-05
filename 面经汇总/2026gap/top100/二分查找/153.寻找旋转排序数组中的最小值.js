/**
 * @param {number[]} nums
 * @return {number}
 */
// 思路1
// var findMin = function (nums) {
//     let l = 0;
//     let r = nums.length - 1;
//     let ans = Infinity;

//     while (l <= r) {
//         const mid = Math.floor((r - l) / 2) + l;

//         // 说明左边有序，左边的值就是左边的最小值，然后更新区间在右边继续探索
//         if (nums[l] <= nums[mid]) {
//             ans = Math.min(ans, nums[l]);
//             l = mid + 1;
//         } else {
//             // 反之
//             ans = Math.min(ans, nums[mid]);
//             r = mid - 1;
//         }
//     }

//     return ans;
// };

// 思路2
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
    let l = 0;
    let r = nums.length - 1;

    while (l < r) {
        const mid = Math.floor((r - l) / 2) + l;

        // 说明右边有序，右边的值就是右边的最小值，然后更新区间在左边继续探索看看有没有更小的
        if (nums[mid] < nums[r]) {
            r = mid;
        } else {
            // 无序说明最小值落在 mid + 1 和 r 之间 可以画图看看
            l = mid + 1;
        }
    }

    return nums[l];
};
