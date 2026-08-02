/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
    if (nums.length === 0) return null;
    // 随机基准下标
    const pivotIndex = Math.floor(Math.random() * nums.length);
    const pivotVal = nums[pivotIndex];

    const l = []; // 存放 > pivotVal 的值（大数）
    const r = []; // 存放 < pivotVal 的值（小数）
    let equalCount = 0; // 等于 pivotVal 的元素数量（含pivot自己）

    for (const num of nums) {
        if (num > pivotVal) {
            l.push(num);
        } else if (num < pivotVal) {
            r.push(num);
        } else {
            equalCount++;
        }
    }

    // 第k大在大数l里
    if (k <= l.length) {
        return findKthLargest(l, k);
    }
    // 第k大落在等于pivot的区间里，直接返回答案
    else if (k <= l.length + equalCount) {
        return pivotVal;
    }
    // 第k大在小数r里，扣除前面大数+相等元素的数量
    else {
        return findKthLargest(r, k - l.length - equalCount);
    }
};

console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2));
