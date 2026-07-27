/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function (root) {
    let ans = 0;
    const process = (node) => {
        if (!node) return 0;

        const left = process(node.left);
        const right = process(node.right);

        // 深度遍历过程中更新值
        ans = Math.max(left + right, ans);

        return Math.max(left, right) + 1;
    };

    process(root);

    return ans;
};
