const arr = [88, 200, 123, 9, 4, 11, 22, 0, 88];
function getMaxValue(arr, left, right) {
    if (left > right) {
        return null;
    }

    if (left === right) {
        return arr[left];
    }

    const mid = Math.floor((left + right) / 2);
    const leftVal = getMaxValue(arr, left, mid);
    const rightVal = getMaxValue(arr, mid + 1, right);

    return Math.max(leftVal, rightVal);
}

console.log(getMaxValue(arr, 0, arr.length - 1));
