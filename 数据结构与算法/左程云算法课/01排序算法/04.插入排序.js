// 先让 0-1 有序，然后 0 - 2 有序
// 以此到 0 - i，这样所有的数字就都有序了
// 算法最糟糕情况是 o(n²)

const arr = [2, 3, 8, 1, 9];

function swap(arr, i, j) {
    arr[i] = arr[i] ^ arr[j]; // a = a ^ b
    arr[j] = arr[i] ^ arr[j]; // b = a ^ b ^ b = a
    arr[i] = arr[i] ^ arr[j]; // a = a ^ b ^ a = b
}

function sort(arr) {
    for (let i = 1; i < arr.length; i++) {
        // 比前一个数大且没越界，就要交换，然后交换后的位置就是j--，如果条件不满足说明这个序列已经是有序了不用再比了
        for (let j = i; j >= 1 && arr[j - 1] > arr[j]; j--) {
            swap(arr, j - 1, j);
        }
    }

    console.log(arr);
}

sort(arr);
