/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
    const res = [];
    const len = nums.length;
    if (len < 3) return res;

    const arr = [...nums].sort((a, b) => a - b);

    for (let i = 0; i < len - 2; i++) {
        const a = arr[i];
        // 剪枝：基准数已经大于0，后面全部正数，不可能和为0
        if (a > 0) break;
        // i去重
        if (i > 0 && a === arr[i - 1]) continue;

        let l = i + 1,
            r = len - 1;
        while (l < r) {
            const b = arr[l],
                c = arr[r];
            const sum = a + b + c;
            if (sum === 0) {
                res.push([a, b, c]);
                // 跳过左侧重复
                while (l < r && arr[l] === b) l++;
                // 跳过右侧重复
                while (l < r && arr[r] === c) r--;
            } else if (sum > 0) {
                r--;
            } else {
                l++;
            }
        }
    }

    return res;
};
console.log(threeSum([-1, 0, 1, 2, -1, -4]));
