/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
    const map = new Map();

    for (const num of nums) {
        map.has(num) ? map.set(num, map.get(num) + 1) : map.set(num, 1);
    }

    const sortedArr = [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, k)
        .map((item) => item[0]);
    return sortedArr;
};

// 更好的做法维护一个 k 大小的小根堆

console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2));
