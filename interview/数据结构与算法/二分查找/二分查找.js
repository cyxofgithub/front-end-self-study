// 题目：有序的数组里面找到比目标数大的值(条件是>)，如果有重复给最左侧那个数字(条件成了>=)
// 复杂度：log2N， 8个数最多被二分三次， 4， 2， 1
const arr = [1, 1, 1, 2, 3, 4, 5, 7, 9];
const target = 1;

function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    if (!arr.length) return result;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] > target) {
            result = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return result;
}

console.log(binarySearch(arr, target));
