// 题目：数组中的所有数都不同请找出一个局部最小值

const arr = [9, 7, 5, 7];

function getAns(arr) {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        let mid = Math.floor(left + ((right - left) >> 1));
        if (arr[mid] > arr[mid - 1]) {
            right = mid - 1;
        } else if (arr[mid] > arr[mid + 1]) {
            left = mid + 1;
        } else {
            return arr[mid];
        }
    }

    return arr[left];
}

console.log(getAns(arr));
