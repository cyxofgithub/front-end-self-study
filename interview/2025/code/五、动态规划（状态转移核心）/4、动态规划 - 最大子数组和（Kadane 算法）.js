// 问题：找到数组中连续子数组的最大和。
// 例如对于输入 [-2, 1, -3, 4, -1, 2, 1, -5, 4]：
// 最大子数组和是 6，对应子数组 [4, -1, 2, 1]；

// 暴力解
// 思路：枚举所有可能的子数组，计算每个子数组的和，取最大值
// 时间复杂度：O(n³) - 三层循环，外层确定起始位置，中层确定结束位置，内层计算和
// 空间复杂度：O(1)
function maxSubArray1(arr) {
    let maxSum = -Infinity;

    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            let sum = 0;
            for (let k = i; k <= j; k++) {
                sum += arr[k];
            }
            maxSum = Math.max(maxSum, sum);
        }
    }

    return maxSum;
}

// 暴力解优化（减少一层循环）
// 思路：在确定起始位置后，逐步扩展结束位置，累加计算和
// 时间复杂度：O(n²)
// 空间复杂度：O(1)
function maxSubArray2(arr) {
    let maxSum = -Infinity;

    for (let i = 0; i < arr.length; i++) {
        let sum = 0;
        for (let j = i; j < arr.length; j++) {
            sum += arr[j];
            maxSum = Math.max(maxSum, sum);
        }
    }

    return maxSum;
}

// 动态规划解法（Kadane 算法）
// 核心思路：定义 dp[i] 表示以 nums[i] 为结尾的最大子数组和。
// 状态转移方程：dp[i] = max(nums[i], dp[i-1] + nums[i])
// 含义：以当前元素结尾的最大子数组和，要么是当前元素本身（前面的和是负数，不如重新开始），
// 要么是当前元素加上前面的最大子数组和（前面的和是正数，可以继续累加）。
// 时间复杂度：O(n) - 只需遍历一次数组
// 空间复杂度：O(n) - dp 数组需要 O(n) 空间
function maxSubArray3(arr) {
    const dp = [arr[0]];
    let maxSum = arr[0];

    for (let i = 1; i < arr.length; i++) {
        // 如果前面的和是负数，不如重新开始；如果是正数，继续累加
        dp[i] = Math.max(arr[i], dp[i - 1] + arr[i]);
        maxSum = Math.max(maxSum, dp[i]);
    }

    return maxSum;
}

// Kadane 算法优化（空间优化）
// 思路：由于 dp[i] 只依赖于 dp[i-1]，可以用一个变量代替整个 dp 数组
// 时间复杂度：O(n)
// 空间复杂度：O(1) - 只使用常数级额外空间
function maxSubArray4(arr) {
    let maxSum = arr[0];
    let currentSum = arr[0];

    for (let i = 1; i < arr.length; i++) {
        // 如果当前累加和为负数，则重新开始（因为负数只会让后续的和更小）
        // 否则继续累加
        currentSum = Math.max(arr[i], currentSum + arr[i]);
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}

// 贪心算法解法
// 思路：遍历数组，累加元素。如果累加和变为负数，则重置为 0（因为负数只会让后续的和更小）。
// 在累加过程中，始终记录遇到的最大和。
// 时间复杂度：O(n)
// 空间复杂度：O(1)
function maxSubArray5(arr) {
    let maxSum = -Infinity;
    let currentSum = 0;

    for (let i = 0; i < arr.length; i++) {
        currentSum += arr[i];
        maxSum = Math.max(maxSum, currentSum);

        // 如果当前累加和为负数，重置为 0（因为负数只会让后续的和更小）
        if (currentSum < 0) {
            currentSum = 0;
        }
    }

    return maxSum;
}

console.log(maxSubArray1([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray2([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray3([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray4([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray5([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
