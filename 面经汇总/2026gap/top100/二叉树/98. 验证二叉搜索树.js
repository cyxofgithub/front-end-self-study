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
 * @return {boolean}
 */
// var isValidBST = function (root) {
//     const process = (node, min, max) => {
//         if (!node) return true;

//         if (node.val <= min || node.val >= max) return false;

//         return (
//             process(node.left, min, node.val) &&
//             process(node.right, node.val, max)
//         );
//     };

//     return process(root, -Infinity, Infinity);
// };

// 中序遍历如果是按序的说明正常
var isValidBST = function (root) {
    if (!root) return true;

    const stack = [root];
    let cur = root;
    let pre = -Infinity;

    while (stack.length || cur) {
        while (cur) {
            stack.push(cur.left);
            cur = cur.left;
        }

        cur = stack.pop();
        if (cur.val >= pre) return false;
        pre = cur.val;

        cur = cur.right;
    }

    return true;
};
