/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function (nums) {
    const set = new Set(nums);
    let result = nums.length ? 1 : 0;
    for (const num of nums) {
        // 该数不能作为开头
        if (set.has(num - 1)) continue;

        let subReuslt = 1;
        let next = num;
        while (set.has(next + 1)) {
            next = next + 1;
            subReuslt++;
        }

        result = Math.max(result, subReuslt);
    }

    console.log(result);
    return result;
};
longestConsecutive([100, 4, 200, 1, 3, 2]);
