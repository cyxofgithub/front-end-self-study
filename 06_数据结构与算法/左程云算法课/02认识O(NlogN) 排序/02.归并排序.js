const arr = [1, 5, 8, 1, 6, 7, 20];

function process(arr) {
    if (arr.length < 2) {
        return arr;
    }

    const left = 0;
    const right = arr.length - 1;
    // 在数组slice切割的时候用这个会报错，
    // 比如 left 为0，rigth 为1，会切成 arr[0] 和arr[0]、arr[1]这个时候后者又重复了
    // const mid = left + ((right - left) >> 1);
    const mid = Math.floor(arr.length / 2);

    const leftArr = process(arr.slice(0, mid));
    const rightArr = process(arr.slice(mid));

    return merge(leftArr, rightArr);
}

function merge(left, right) {
    const length = right.length + left.length;
    const helper = new Array(length);
    let p1 = 0;
    let p2 = 0;
    let i = 0;

    while (p1 < left.length && p2 < right.length) {
        helper[i++] = left[p1] < right[p2] ? left[p1++] : right[p2++];
    }

    while (p1 < left.length) {
        helper[i++] = left[p1++];
    }

    while (p2 < right.length) {
        helper[i++] = right[p2++];
    }

    return helper;
}

console.log(process(arr));
