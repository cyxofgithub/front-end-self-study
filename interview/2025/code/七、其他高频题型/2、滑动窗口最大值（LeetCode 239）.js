// 问题：给定数组和窗口大小，求每个窗口的最大值。

// 暴力解
function getMaxValue(arr, size) {
    const n = arr.length;
    const result = [];
    for (let i = 0; i <= n - size; i++) {
        let max = arr[i];

        for (let j = i + 1; j < i + size; j++) {
            max = Math.max(arr[j], max);
        }

        result.push(max);
    }
    return result;
}

// 单调队列解法
function getMaxValue2(arr, size) {
    const n = arr.length;
    const result = [];
    const queue = [];
    for (let i = 0; i < n; i++) {
        // 移除窗口外元素
        // 为什么从队首判断就可以？因为元素都是从队尾进入的，所以队首就是索引最小的元素
        while (queue.length && queue[0] <= i - size) {
            queue.shift();
        }

        // 维持队列递减特性
        while (queue.length && arr[queue[queue.length - 1]] <= arr[i]) {
            queue.pop();
        }

        queue.push(i);

        // 窗口形成后
        if (i >= size - 1) {
            result.push(arr[queue[0]]);
        }
    }
    return result;
}
console.log(getMaxValue([1, 3, -1, -3, 5, 3, 6, 7], 3));
console.log(getMaxValue2([1, 3, -1, -3, 5, 3, 6, 7], 3));
