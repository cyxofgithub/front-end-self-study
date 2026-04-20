// 给定一个整数数组 a，其中1 ≤ a[i] ≤ n （n为数组长度）, 其中有些元素出现两次而其他元素出现一次。
// 找到所有出现两次的元素。
// 你可以不用到任何额外空间并在O(n)时间复杂度内解决这个问题吗？

// 思路：把“数值 value”映射到“下标 value-1”，并用该位置的正负号记录是否出现过。
// 例如 value=3 -> idx=2。若 arr[2] 已经是负数，说明 3 之前出现过，当前就是重复值。
function findDuplicateNumbersInPlace(arr = [2, 1, 2, 6, 3, 3, 3, 4]) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        // 元素可能已经被我们改成负数，所以要取绝对值恢复原本的数值。
        const idx = Math.abs(arr[i]) - 1;
        if (arr[idx] < 0) {
            // 对应位置已经被标记过，说明当前值是第二次出现。
            result.push(Math.abs(arr[i]));
        } else {
            // 第一次出现：把对应位置改成负数作为“已出现”标记。
            arr[idx] = -arr[idx];
        }
    }
    // 注意：该方法会原地修改输入数组。
    return [...new Set(result)];
}

console.log(findDuplicateNumbersInPlace());
