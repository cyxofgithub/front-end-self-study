// 思想：
// 第一个和第二数字比较，如果第二个数字更小就和第一个数字交换位置
// 第二和第三个数比较，如果第三个数字更小就和第二个数字交换位置，一轮下来就能得到一个最大的数字
// 这时剩下的 n - 1 个数字重复这样的操作
const arr = [2, 3, 8, 1, 9]

function swap(arr, i, j) {
    arr[i] = arr[i] ^ arr[j];   // a = a ^ b
    arr[j] = arr[i] ^ arr[j];   // b = a ^ b ^ b = a
    arr[i] = arr[i] ^ arr[j];   // a = a ^ b ^ a = b
}

function sort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr, j, j+1);
            }
        }
    }

    return arr;
}

const ans = sort(arr);

console.log(ans);