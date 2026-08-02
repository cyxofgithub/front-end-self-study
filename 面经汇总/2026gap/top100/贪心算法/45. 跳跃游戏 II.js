/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
    let position = nums.length - 1;
    let step = 0;

    while (position > 0) {
        for (let i = 0; i < nums.length; i++) {
            // 每次都找到最快能达到目的地的台阶
            if (nums[i] + i >= position) {
                position = i;
                step++;
                break;
            }
        }
    }

    return step;
};
