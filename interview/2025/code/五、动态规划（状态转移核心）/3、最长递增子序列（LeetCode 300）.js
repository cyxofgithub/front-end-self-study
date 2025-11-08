// 问题：找到数组中的最长递增子序列长度。
// 例如对于输入 [2, 3, 1, 2, 3, 4, 2, 8]：
// 最长递增子序列是 [1, 2, 3, 4, 8]，长度为 5；

// 动态规划解法
// 解析：初始化每个字符串的最长递增子序列长度都是1
// 核心思路：定义 dp[i] 表示以 nums[i] 为结尾的最长递增子序列长度。对于每个 i，遍历其之前的所有元素 j（j < i），若 nums[j] < nums[i]，则 dp[i] 可更新为 dp[j] + 1（即把 nums[i] 接在 nums[j] 结尾的子序列后）。最终取 dp 数组的最大值。
// 时间复杂度： o(n2) 两层循环最多就是 n
// 空间复杂度： o(n)
function getMaxLength(arr) {
    const dep = Array.from({ length: arr.length }).fill(1);
    let result = 1;

    for (let i = 1; i < arr.length; i++) {
        // 思路：遍历到第i个数字时如果比结果就是前面i-1个数字的最大结果
        for (let j = 0; j < i; j++) {
            if (arr[i] > arr[j]) {
                dep[i] = Math.max(dep[i], dep[j] + 1);
            }
        }

        result = Math.max(dep[i], result);
    }
    return result;
}

// 解法二：贪心 + 二分查找（O (n log n) 时间复杂度）
// tails 数组的作用：它不直接存储最长递增子序列，而是存储「每种长度的递增子序列的最小结尾元素」。例如 tails = [1,2,3,4,8] 表示：
// 长度 1 的子序列，最小结尾是 1；
// 长度 2 的子序列，最小结尾是 2；
// ...
// 长度 5 的子序列，最小结尾是 8。
// 因此只要后面的数字比8大那就说明它的子序列长度是 6
function getMaxLength2(arr) {
    const tails = [];

    for (let i = 0; i < arr.length; i++) {
        let left = 0;
        let right = tails.length;

        while (left < right) {
            const mid = Math.floor((left + right) / 2);

            if (arr[i] > tails[mid]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        if (left === tails.length) {
            tails.push(arr[i]);
        } else {
            tails[left] = arr[i];
        }
    }

    return tails.length;
}

console.log(getMaxLength([2, 3, 1, 2, 3, 4, 2, 8]));
console.log(getMaxLength2([2, 3, 1, 2, 3, 4, 2, 8]));
