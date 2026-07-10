/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
    const map = new Map();
    map.set(0, 1);
    let preSum = 0;
    let count = 0;

    for (let i = 0; i < nums.length; i++) {
        preSum += nums[i];
        if (map.has(preSum - k)) {
            count += map.get(preSum - k);
        }

        map.set(preSum, (map.get(preSum) || 0) + 1);
    }

    return count;
};

console.log(subarraySum([1, 2, 1, 2, 1], 3));
