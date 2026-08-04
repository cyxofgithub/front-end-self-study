/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
    let l = 0;
    let r = nums.length - 1;

    while (l <= r) {
        const mid = Math.floor((r - l) / 2) + l;

        if (nums[mid] === target) return mid;

        if (nums[mid] >= nums[l]) {
            // 左边有序
            // 说明值在左区间
            if (nums[mid] > target && nums[l] <= target) {
                r = mid - 1;
            } else {
                l = mid + 1;
            }
        } else {
            // 右边有序
            // 说明值在右区间
            if (nums[mid] < target && nums[r] >= target) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
    }

    return -1;
};

console.log(search([4, 5, 6, 7, 0, 1, 2], 0));
