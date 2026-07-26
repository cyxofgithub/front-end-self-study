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
// var maxDepth = function (root) {
//     if (!root) return 0;

//     return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
// };

var maxDepth = function (root) {
    if (!root) return 0;

    let dep = 0;
    let stack = [root];

    while (stack.length) {
        dep++;
        const next = [];

        while (stack.length) {
            const cur = stack.pop();
            cur.left && next.push(cur.left);
            cur.right && next.push(cur.right);
        }

        stack = next;
    }

    return dep;
};
