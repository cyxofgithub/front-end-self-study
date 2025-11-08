// 选择排序的思想：
// 第一轮从n个数字中选出最小的数放到第一个位置，
// 第一轮已经得到最小的数字在第一个位置，所以第二轮从n-1个数字中选出最小的数放到第二个为位置
// ... 以此类推直到结束

const arr = [1, 23, 24, 44, 11, 22];
function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
function sort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let index = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[index] > arr[j]) {
                index = j;
            }
        }

        if (index !== i) {
            swap(arr, index, i);
        }
    }

    return arr;
}

console.log(sort(arr));
