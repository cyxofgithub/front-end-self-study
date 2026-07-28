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
 * @return {number[][]}
 */
var levelOrder = function (root) {
    if (!root) return [];

    const stack = [root];
    const ans = [];

    while (stack.length) {
        let size = stack.length;
        const subAns = [];
        while (size) {
            size--;
            const cur = stack.shift();
            subAns.push(cur.val);
            cur.left && stack.push(cur.left);
            cur.right && stack.push(cur.right);
        }
        ans.push(subAns);
    }

    return ans;
};
