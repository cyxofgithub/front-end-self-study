/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
// 需要维护set
// var combinationSum = function (candidates, target) {
//     const set = new Set();

//     const process = (path, _target) => {
//         if (_target === 0) {
//             const stringPath = JSON.stringify(path.sort((a, b) => a - b));
//             set.add(stringPath);
//             return;
//         }
//         if (_target < 0) return;

//         for (let i = 0; i < candidates.length; i++) {
//             if (candidates[i] <= _target) {
//                 path.push(candidates[i]);
//                 process(path, _target - candidates[i]);
//                 path.pop();
//             }
//         }
//     };

//     process([], target);

//     return [...set].map((item) => JSON.parse(item));
// };

var combinationSum = function (candidates, target) {
    const res = [];
    const backtrack = (start, path, sum) => {
        if (sum === target) {
            res.push([...path]);
            return;
        }
        if (sum > target) return;
        // 从start开始，只往后选，保证组合升序、无重复
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            // 关键步骤！i 不变保证 [2、2、2、2]这样的组合只会出现一次
            backtrack(i, path, sum + candidates[i]);
            path.pop();
        }
    };
    backtrack(0, [], 0);
    return res;
};
console.log(combinationSum([2, 3, 5], 8));
