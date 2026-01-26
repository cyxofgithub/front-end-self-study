// 时间复杂度：o(nlogn)  merge循环n次*递归深度logn
// 空间复杂度：好 o(n) merge占用n(每次merge后释放空间所以不用*)+递归深度的中间变量logn
// 归并排序的空间复杂度为 O(n)，这是其与快速排序（优化版空间复杂度 O (log n)）的核心区别。虽然空间开销较高，但换来的是时间复杂度的稳定性和排序的稳定性（相等元素相对位置不变）。
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const arr = [];
    let p1 = 0;
    let p2 = 0;

    while (p1 < left.length && p2 < right.length) {
        if (left[p1] <= right[p2]) {
            arr.push(left[p1]);
            p1++;
        } else {
            arr.push(right[p2]);
            p2++;
        }
    }

    if (left.length > right.length) {
        while (p1 < left.length) {
            arr.push(left[p1]);
            p1++;
        }
    } else {
        while (p2 < right.length) {
            arr.push(right[p2]);
            p2++;
        }
    }

    return arr;
}

console.log(mergeSort([2, 3, 4, 12]));
