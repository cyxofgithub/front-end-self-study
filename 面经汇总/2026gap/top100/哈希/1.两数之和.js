/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        if (map.has(target - nums[i])) {
            const index = map.get(target - nums[i]);
            return [i, index];
        }
        map.set(nums[i], i);
    }

    return [];
};

twoSum([2, 7, 11, 15], 9);
