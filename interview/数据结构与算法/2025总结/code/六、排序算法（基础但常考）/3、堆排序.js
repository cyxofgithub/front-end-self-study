// 原理：构建大根堆，每次取出堆顶元素。
// 时间复杂度：O (n log n)，空间复杂度 O (1)。
// 扩展：求前 K 个高频元素（LeetCode 347）。

// 调整堆：确保以i为根的子树是大根堆
function heapify(arr, size, i) {
    let largest = i; // 假设当前节点是最大值
    const left = 2 * i + 1; // 左子节点索引
    const right = 2 * i + 2; // 右子节点索引

    // 若左子节点存在且大于当前最大值，更新最大值索引
    if (left < size && arr[left] > arr[largest]) {
        largest = left;
    }

    // 若右子节点存在且大于当前最大值，更新最大值索引
    if (right < size && arr[right] > arr[largest]) {
        largest = right;
    }

    // 若最大值不是当前节点，交换并递归调整子树
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]]; // 交换元素
        heapify(arr, size, largest); // 递归调整被交换的子节点
    }
}

// 大根堆排序主函数
function heapSort(arr) {
    const n = arr.length;
    if (n <= 1) return arr; // 空数组或单元素数组无需排序

    // 1. 构建大根堆（从最后一个非叶子节点向上调整）
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // 2. 排序：反复提取最大值并调整堆
    for (let i = n - 1; i > 0; i--) {
        // 交换堆顶（最大值）与当前堆的最后一个元素
        [arr[0], arr[i]] = [arr[i], arr[0]];
        // 缩小堆范围（排除已排序的末尾元素），并调整新堆顶
        heapify(arr, i, 0);
    }

    return arr;
}

// 测试示例
const testArr = [3, 1, 4, 1, 5, 9, 2, 6];
console.log(heapSort(testArr)); // 输出：[1, 1, 2, 3, 4, 5, 6, 9]
