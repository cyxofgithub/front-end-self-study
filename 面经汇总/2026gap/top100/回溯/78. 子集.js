/**
 * @param {number[]} nums
 * @return {number[][]}
 */
// var subsets = function (nums) {
//     const ans = [[]];

//     const helper = (start = 0, path = []) => {
//         for (let i = start; i < nums.length; i++) {
//             path.push(nums[i]);
//             ans.push([...path]);
//             helper(i + 1, path);
//             path.pop();
//         }
//     };

//     helper();

//     return ans;
// };

// 迭代法
// 🚀 ~ subsets ~ temp: [ [] ]
// 🚀 ~ subsets ~ temp: [ [], [ 1 ] ]
// 🚀 ~ subsets ~ temp: [ [], [ 1 ], [ 2 ], [ 1, 2 ] ]
var subsets = function (nums) {
    let res = [[]];
    for (const num of nums) {
        const temp = [...res];
        console.log('🚀 ~ subsets ~ temp:', temp);
        for (const item of temp) {
            res.push([...item, num]);
        }
    }
    return res;
};

console.log(subsets([1, 2, 3]));
