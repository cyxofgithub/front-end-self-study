// 你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。
// 这个地方所有的房屋都围成一圈，这意味着第一个房屋和最后一个房屋是紧挨着的。
// 同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
// 给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下，能够偷窃到的最高金额。

// 思路：环形意味着首尾不能同时偷，拆成两种情况取最大值：
// 1. 偷 [0, n-2]（不偷最后一间）
// 2. 偷 [1, n-1]（不偷第一间）
function maxRobberyInCircle(arr = [2, 1, 2, 6, 3, 3, 4]) {
    if (arr.length === 0) return 0;
    if (arr.length === 1) return arr[0];

    function maxRobberyLinearRange(nums, start, end) {
        // prev 表示到 i-2 为止的最优解，curr 表示到 i-1 为止的最优解
        let prev = 0,
            curr = 0;
        for (let i = start; i <= end; i++) {
            // 逐个遍历即可，不需要 i += 2：
            // 1) 不偷第 i 间：沿用 curr（即 i-1 的最优）
            // 2) 偷第 i 间：只能接 prev + nums[i]（即 i-2 的最优 + 当前金额）
            // 通过 max 自动避免“偷相邻”。
            const next = Math.max(curr, prev + nums[i]);
            // 窗口右移一位：更新为下一轮的 (i-2, i-1)
            prev = curr;
            curr = next;
        }
        return curr;
    }

    return Math.max(
        maxRobberyLinearRange(arr, 0, arr.length - 2),
        maxRobberyLinearRange(arr, 1, arr.length - 1)
    );
}

maxRobberyInCircle();