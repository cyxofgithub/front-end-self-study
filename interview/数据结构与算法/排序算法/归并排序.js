const arr = [1, 5, 8, 1, 6, 7, 20];

// 时间复杂度：o（nlogn） 空间复杂度：o（n）
// 技术原理解释：
// 分治法：归并排序利用分治法将问题分解成更小的子问题，分别解决这些子问题，然后合并结果。
// 递归：通过递归调用，将数组不断分割，直到子数组的长度为1或0。
// 合并：将两个有序的子数组合并成一个有序的数组。

function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);

    const leftArr = mergeSort(arr.slice(0, mid));
    const rightArr = mergeSort(arr.slice(mid));

    return merge(leftArr, rightArr);
}

function merge(left, right) {
    let i = 0;
    let j = 0;
    let sortArr = [];

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            sortArr.push(left[i]);
            i++;
        } else {
            sortArr.push(right[j]);
            j++;
        }
    }

    if (i < left.length) {
        sortArr = sortArr.concat(left.slice(i, left.length));
    }

    if (j < right.length) {
        sortArr = sortArr.concat(right.slice(j, right.length));
    }

    return sortArr;
}

const ans = mergeSort(arr);
console.log('🚀 ~ ans:', ans);

// mergeSort 函数：
// 递归地将数组分割成两个子数组，直到子数组的长度为1或0。
// 分别对左半部分和右半部分进行递归排序。
// 调用 merge 函数将两个有序的子数组合并成一个有序的数组。

// merge 函数：
// 初始化两个指针 i 和 j，分别指向左半部分和右半部分的起始位置。
// 比较左半部分和右半部分的当前元素，将较小的元素添加到 sortedArray 中，并移动相应的指针。
// 处理剩余的元素，将它们添加到 sortedArray 中。
