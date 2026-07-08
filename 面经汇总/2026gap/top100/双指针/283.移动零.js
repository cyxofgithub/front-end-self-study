/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
    if (nums.length <= 1) return nums;

    let i = 0;
    let j = 0;

    while (i < nums.length) {
        if (nums[i] !== 0) {
            swap(nums, i, j);
            j++;
        }

        i++;
    }

    return nums;
};

function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

console.log(moveZeroes([0, 1, 0, 3, 12]));
