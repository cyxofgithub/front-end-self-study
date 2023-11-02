const arr = [1, 5, 8, 1, 6, 7, 20];

let ans = 0;
function process(arr) {
    if (arr.length < 2) {
        return arr;
    }

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
        ans += left[p1] < right[p2] ? left[p1] * (right.length - p2) : 0;
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
process(arr);
console.log(ans);
