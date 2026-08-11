/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function (nums) {
    // 1、先找末尾降序部分
    let i = nums.length - 2;

    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    // 2、从降序序列中找一个尽可能小但要大于断点的值
    for (let j = nums.length - 1; j > i && i >= 0; j--) {
        if (nums[i] < nums[j]) {
            [nums[i], nums[j]] = [nums[j], nums[i]];
            break;
        }
    }

    // 3、反转降序部分(变成升序，这样值更小)
    let l = i + 1;
    let r = nums.length - 1;

    while (l < r) {
        [nums[l], nums[r]] = [nums[r], nums[l]];
        l++;
        r--;
    }
};

console.log(nextPermutation([3, 2, 1]));
