// 题目：数组中的所有数都不同请找出一个局部最小值

// 局部单调性：
// 如果 arr[mid] > arr[mid-1]，说明在 mid 左侧存在一个局部最小值，因为从 mid 向左移动，元素值在减小，最终会遇到一个局部最小值。
// 同理，如果 arr[mid] > arr[mid+1]，说明在 mid 右侧存在一个局部最小值，因为从 mid 向右移动，元素值在减小，最终会遇到一个局部最小值。
const arr = [9, 7, 5, 7];

function getLocalMinNum(arr) {
    const n = arr.length;

    let left = 0;
    let right = n - 1;

    // 边界
    if (n < 1) {
        return null;
    }

    if (n === 1 || arr[0] < arr[1]) {
        return arr[0];
    }

    if (arr[n - 1] < arr[n - 2]) {
        return arr[n - 1];
    }

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] > arr[mid - 1]) {
            right = mid - 1;
        } else if (arr[mid] > arr[mid + 1]) {
            left = mid + 1;
        } else {
            return arr[mid];
        }
    }

    return null;
}

console.log(getLocalMinNum(arr));
