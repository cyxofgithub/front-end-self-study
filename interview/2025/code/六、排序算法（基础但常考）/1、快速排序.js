// 时间复杂度分析：
// 基础版快速排序的时间复杂度：
// 最好情况：O (n log n)（分区均匀）；
// 平均情况：O (n log n)（随机数组大概率平衡）；
// 最坏情况：O (n²)（有序 / 逆序数组，分区极度不平衡）。

// 空间复杂度分析
// 总结
// 基础版快速排序的空间复杂度由 “额外数组空间” 主导（递归栈空间相对可忽略）：
// 最好 / 平均情况：O(n log n)（递归深度O(log n)，每层数组总空间O(n)）；
// 最坏情况：O(n²)（递归深度O(n)，每层数组总空间累加为O(n²)）。
function quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] <= pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort([2, 3, 4, 1, 2]));
