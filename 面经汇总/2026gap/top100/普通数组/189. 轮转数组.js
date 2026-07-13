/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
    const n = nums.length;
    k = k % n; // 关键：消除多余旋转
    if (k === 0) return; // 无需旋转直接退出

    // 翻转数组 [i,j]
    const reverse = (i, j) => {
        while (i < j) {
            [nums[i], nums[j]] = [nums[j], nums[i]];
            i++;
            j--;
        }
    };
    reverse(0, n - 1); // 整体反转
    reverse(0, k - 1); // 前k个反转
    reverse(k, n - 1); // 后段反转
};

console.log(rotate([1, 2, 3, 4, 5, 6, 7], 3));
