const arr = [2, 6, 4, 2, 3, 2, 1, 34, 1];

function quickSort(arr, left, right) {
    // 让数组分成两部分，左边的值比右边的值小
    const partition = (left, right, arr) => {
        let pivotIndex = Math.floor(left + Math.random() * (right - left + 1)); // 随机法避免o(n²)的时间复杂度

        swap(arr, pivotIndex, right); // 把随机数即基准值先放到最后的位置，然后比它小的数就可以很简单的放在它的前面
        let index = left;
        for (let i = index; i < right; i++) {
            if (arr[i] < arr[right]) {
                swap(arr, i, index); // 让值和基准值的未来位置交换，值都贴靠者中间值
                index++;
            }
        }
        swap(arr, index, right); // 基准值当前位置和交换过的最后一个数位置交换就是它应该有的位置
        return index;
    };

    if (left < right) {
        const pivotIndex = partition(left, right, arr);
        quickSort(arr, pivotIndex + 1, right);
        quickSort(arr, left, pivotIndex - 1);
    }

    return arr;
}

function swap(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

console.log(quickSort(arr, 0, arr.length - 1));
