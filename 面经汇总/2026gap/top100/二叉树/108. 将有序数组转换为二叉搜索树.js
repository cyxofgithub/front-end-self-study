/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
// var sortedArrayToBST = function (nums) {
//     if (!nums.length) return null;

//     const midIndex = Math.floor(nums.length / 2);
//     const left = nums.slice(0, midIndex);
//     const mid = nums[midIndex];
//     const right = nums.slice(midIndex + 1);

//     const root = new TreeNode(nums[midIndex]);

//     root.left = sortedArrayToBST(left);
//     root.right = sortedArrayToBST(right);

//     return root;
// };

var sortedArrayToBST = function (nums) {
    if (!nums.length) return null;

    const process = (nums, l, r) => {
        if (l > r) return null;

        const mid = Math.floor((l + r) / 2);
        const root = new TreeNode(nums[mid]);
        root.left = process(nums, l, mid - 1);
        root.right = process(nums, mid + 1, r);

        return root;
    };

    return process(nums, 0, nums.length - 1);
};
