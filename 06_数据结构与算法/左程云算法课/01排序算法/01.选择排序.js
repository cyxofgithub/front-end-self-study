// 选择排序的思想：
// 第一轮从n个数字中选出最小的数放到第一个位置，
// 第一轮已经得到最小的数字在第一个位置，所以第二轮从n-1个数字中选出最小的数放到第二个为位置
// ... 以此类推直到结束
const arr = [2, 3, 8, 1, 9]

function swap(arr, i, j) {
    arr[i] = arr[i] ^ arr[j];   // a = a ^ b
    arr[j] = arr[i] ^ arr[j];   // b = a ^ b ^ b = a
    arr[i] = arr[i] ^ arr[j];   // a = a ^ b ^ a = b
}

function sort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let min = i;

        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                min = j;
            }
        }

        if (i !== min) {
            swap(arr, i, min);
        }
    }

    return arr;
}

console.log(sort(arr));