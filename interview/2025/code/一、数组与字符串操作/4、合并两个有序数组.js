// ### 4、合并两个有序数组（LeetCode 88）

// 问题：将两个有序数组合并为一个有序数组。
// 无需额外空间

function mergeSortedArr(arr1, arr2) {
    let p1 = arr1.length - 1;
    let p2 = arr2.length - 1;
    let p3 = arr1.length + arr2.length - 1;

    while (p1 >= 0 && p2 >= 0) {
        if (arr1[p1] >= arr2[p2]) {
            arr1[p3] = arr1[p1];
            p1--;
        } else {
            arr1[p3] = arr2[p2];
            p2--;
        }
        p3--;
    }

    // 若nums2还有剩余元素，直接复制到nums1头部（nums1剩余元素已在正确位置）
    while (p2 > 0) {
        arr1[p3] = arr2[p2];
        p2--;
        p3--;
    }

    return arr1;
}

console.log(mergeSortedArr([1, 2, 3, 4, 5, 7], [1, 2, 4, 6, 9]));