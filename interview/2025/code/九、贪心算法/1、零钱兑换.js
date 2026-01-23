// 问题：给定不同面额的硬币 coins 和一个总金额 amount，计算可以凑成总金额所需的最少的硬币个数。
// 如果没有任何一种硬币组合能组成总金额，返回 -1。
// 例如：coins = [1, 2, 5], amount = 11
// 输出：3（11 = 5 + 5 + 1）

// 贪心算法解法
// 核心思路：每次都选择面额最大的硬币，直到无法再选择为止（局部最优 -> 全局最优）
// 注意：贪心算法只在某些特定情况下能得到最优解（任何拆大面额为小面额的操作，只会增加硬币数，且所有余数都能被小面额以最少硬币数填补，局部最优的选择最终必然是全局最优），对于任意面额可能无法得到最优解
// 例如：coins = [1, 3, 4], amount = 6
// 贪心会选择：4 + 1 + 1 = 3 枚硬币
// 但最优解是：3 + 3 = 2 枚硬币
// 时间复杂度：O(n) - n 为硬币种类数（排序 O(n log n) + 遍历 O(n)）
// 空间复杂度：O(1) - 只使用常数级额外空间（注意：使用 [...coins] 复制数组避免修改原数组，实际空间复杂度为 O(n)，但可以优化为 O(1)）
function coinChangeGreedy(coins, amount) {
    if (amount === 0) return 0;
    if (amount < 0) return -1;

    // 将硬币面额从大到小排序，优先使用大面额硬币
    // 使用 [...coins] 复制数组，避免修改原数组
    const sortedCoins = [...coins].sort((a, b) => b - a);
    let count = 0;
    let remaining = amount;

    for (let i = 0; i < sortedCoins.length; i++) {
        const coin = sortedCoins[i];
        // 尽可能多地使用当前面额的硬币
        const numCoins = Math.floor(remaining / coin);
        count += numCoins;
        remaining -= numCoins * coin;

        // 如果已经凑齐，直接返回
        if (remaining === 0) {
            return count;
        }
    }

    // 如果还有剩余金额无法凑齐，返回 -1
    return remaining > 0 ? -1 : count;
}

// 动态规划解法（对比：保证得到最优解）
// 核心思路：dp[i] 表示凑成金额 i 所需的最少硬币数
// 状态转移方程：dp[i] = min(dp[i - coin] + 1) for coin in coins
// 时间复杂度：O(amount * n) - n 为硬币种类数
// 空间复杂度：O(amount) - dp 数组需要 O(amount) 空间
function coinChangeDP(coins, amount) {
    if (amount === 0) return 0;
    if (amount < 0) return -1;

    // dp[i] 表示凑成金额 i 所需的最少硬币数
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0; // 金额为 0 时不需要任何硬币

    // 遍历每个金额
    for (let i = 1; i <= amount; i++) {
        // 尝试使用每种硬币
        for (const coin of coins) {
            if (i >= coin) {
                // 如果使用当前硬币，需要的硬币数 = dp[i - coin] + 1
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    // 如果 dp[amount] 仍然是 Infinity，说明无法凑成
    return dp[amount] === Infinity ? -1 : dp[amount];
}

// 动态规划转移思路：
// 对于任意金额 i，尝试用每一种硬币 coin，看凑出 (i - coin) 的最少硬币数，再加 1（表示用了一枚 coin），取这些方案的最小值。
// 状态转移方程（JavaScript）：dp[i] = Math.min(...coins.filter(coin => i - coin >= 0).map(coin => dp[i - coin] + 1))
// 自顶向下写法即：从总金额向下递归，每次拆解为子问题，结果记忆化避免重复计算。
// 复杂度分析：时间 O(amount * n)，空间 O(amount)，其中 n 为硬币种数。
function coinChangeDP2(coins, amount) {
    if (amount === 0) return 0;
    if (amount < 0) return -1;

    const memo = {};

    const dp = (target) => {
        if (target === 0) return 0;
        if (target < 0) return -1;
        if (memo[target] !== undefined) return memo[target];

        let result = Infinity;
        // 尝试使用每种硬币
        for (const coin of coins) {
            const subResult = dp(target - coin);
            if (subResult !== -1) {
                result = Math.min(result, subResult + 1);
            }
        }

        memo[target] = result === Infinity ? -1 : result;
        return memo[target];
    };

    return dp(amount);
}

// 测试用例
console.log('=== 贪心算法测试 ===');
console.log('测试1（标准货币系统，贪心可行）:');
console.log('coins = [1, 2, 5], amount = 11');
console.log('贪心解法:', coinChangeGreedy([1, 2, 5], 11)); // 3

console.log('\n测试2（贪心无法得到最优解的情况）:');
console.log('coins = [1, 3, 4], amount = 6');
console.log('贪心解法:', coinChangeGreedy([1, 3, 4], 6)); // 3（错误，应该是2）

console.log('\n测试3（无法凑齐）:');
console.log('coins = [2], amount = 3');
console.log('贪心解法:', coinChangeGreedy([2], 3)); // -1

console.log('\n=== 动态规划解法测试（保证最优解）===');
console.log('测试1:');
console.log('coins = [1, 2, 5], amount = 11');
console.log('DP解法1:', coinChangeDP([1, 2, 5], 11)); // 3
console.log('DP解法2:', coinChangeDP2([1, 2, 5], 11)); // 3

console.log('\n测试2（贪心失败的情况，DP正确）:');
console.log('coins = [1, 3, 4], amount = 6');
console.log('DP解法1:', coinChangeDP([1, 3, 4], 6)); // 2（正确）
console.log('DP解法2:', coinChangeDP2([1, 3, 4], 6)); // 2（正确）

console.log('\n测试3:');
console.log('coins = [2], amount = 3');
console.log('DP解法1:', coinChangeDP([2], 3)); // -1
console.log('DP解法2:', coinChangeDP2([2], 3)); // -1
