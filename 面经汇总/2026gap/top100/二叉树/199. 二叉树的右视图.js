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
 * @return {number[]}
 */
// var rightSideView = function (root) {
//     if (!root) return [];

//     const stack = [root];
//     const res = [root.val];

//     while (stack.length) {
//         let size = stack.length;
//         while (size) {
//             size--;
//             const cur = stack.shift();
//             cur.left && stack.push(cur.left);
//             cur.right && stack.push(cur.right);
//         }

//         stack.length && res.push(stack[stack.length - 1].val);
//     }

//     return res;
// };

// 深搜 根右左，每一层的最右边
var rightSideView = function (root) {
    const list = [];
    const help = (n, h) => {
        if (!n) return;
        if (list.length < h) {
            list.push(n.val);
        }

        help(n.right, h + 1);
        help(n.left, h + 1);
    };

    help(root, 1);

    return list;
};
