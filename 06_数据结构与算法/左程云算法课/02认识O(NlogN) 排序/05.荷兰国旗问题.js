const arr = [2, 6, 4, 2];
const num = 5;

function swap(arr, i, j) {
    arr[i] = arr[i] ^ arr[j];
    arr[j] = arr[i] ^ arr[j];
    arr[i] = arr[i] ^ arr[j];
}

function splitNum(arr, num) {
    let minArea = 0;
    let maxArea = arr.length - 1;
    let p1 = 0;

    while (p1 !== maxArea) {
        if (arr[p1] < num) {
            // 小于的数放在小于区域上
            p1 !== minArea && swap(arr, p1, minArea);
            minArea++;
            p1++;
        } else if (arr[p1] === num) {
            p1++;
        } else {
            // 大于的数放在大于区域上
            p1 !== maxArea && swap(arr, p1, maxArea);
            maxArea--;
            // 为什么遍历指针不往右移?
            // 因为这个刚调换位置的数我们还没经过判断，指针是从左往右走的，对于右边的数我们还没经过判断
        }
    }
    console.log(arr);
}

splitNum(arr, num);
