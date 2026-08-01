/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
    let max = 0;

    for (let i = 0; i < nums.length; i++) {
        // 维护能跳到的最远距离
        max = Math.max(max, nums[i] + i);

        // 能到达的最远距离如果大于最后的索引值说明ok
        if (max >= nums.length - 1) return true;

        // 最大距离连现在的都跳不过去就没有继续遍历的必要了
        if (max <= i) return false;
    }

    return false;
};
