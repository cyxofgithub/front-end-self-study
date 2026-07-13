/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
    const len = nums.length;
    const res = new Array(len);

    // 1. 左遍历：res[i] = i左侧全部乘积
    let leftProd = 1;
    for (let i = 0; i < len; i++) {
        res[i] = leftProd;
        leftProd *= nums[i];
    }

    // 2. 右遍历：rightProd 保存i右侧全部乘积，相乘得到结果
    let rightProd = 1;
    for (let i = len - 1; i >= 0; i--) {
        res[i] *= rightProd;
        rightProd *= nums[i];
    }

    return res;
};

console.log(productExceptSelf([1, 2, 3, 4]));
