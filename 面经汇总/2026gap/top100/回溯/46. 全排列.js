/**
 * @param {number[]} nums
 * @return {number[][]}
 */
// var permute = function (nums) {
//     const ans = [];
//     const process = (arr = nums, path = []) => {
//         for (let i = 0; i < arr.length; i++) {
//             const temp = [...arr];
//             temp.splice(i, 1);
//             process(temp, [...path, arr[i]]);
//         }
//         if (path.length === nums.length) return ans.push(path);
//     };

//     process();

//     return ans;
// };

// 优化空间复杂度
var permute = function (nums) {
    const ans = [];
    const process = (s) => {
        if (s === nums.length) return ans.push([...nums]);

        for (let i = s; i < nums.length; i++) {
            // 选择
            [nums[s], nums[i]] = [nums[i], nums[s]];
            permute(s + 1);
            // 撤销选择
            [nums[s], nums[i]] = [nums[i], nums[s]];
        }

        return ans;
    };

    process(0);

    return ans;
};
