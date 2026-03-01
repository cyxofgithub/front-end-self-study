// 用递归从数组中找到最大值
const generateArr = require('./07.对数器');

const arr = generateArr(100, 100);

console.log('arr---', arr);

function getMaxValue(arr, left, right) {
    if (left === right) {
        return arr[left];
    }

    const mid = left + ((right - left) >> 1);

    const leftMax = getMaxValue(arr, left, mid);
    const rightMax = getMaxValue(arr, mid + 1, right);

    return Math.max(leftMax, rightMax);
}

console.log(getMaxValue(arr, 0, arr.length - 1));
