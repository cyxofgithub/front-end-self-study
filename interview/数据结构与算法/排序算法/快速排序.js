// 技术原理解释

// 分治法：快速排序利用分治法将问题分解成更小的子问题，分别解决这些子问题，然后合并结果。
// 分区操作：通过选择基准元素并重新排列数组，使得所有小于基准元素的元素都在基准元素的左边，所有大于基准元素的元素都在基准元素的右边。
// 递归：通过递归调用，将数组不断分割，直到子数组的长度为1或0。
function quickSort(arr) {
    // 如果数组长度小于等于1，直接返回数组
    if (arr.length <= 1) {
        return arr;
    }

    // 选择基准元素，这里选择数组的最后一个元素
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];

    // 分区操作
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    // 递归排序并合并结果
    return [...quickSort(left), pivot, ...quickSort(right)];
}

// 示例数组
const arr = [38, 27, 43, 3, 9, 82, 10];
const sortedArr = quickSort(arr);
console.log('排序后的数组:', sortedArr);
