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
 * @param {number} k
 * @return {number}
 */
// var kthSmallest = function (root, k) {
//     let res = [];
//     const traverse = (node) => {
//         if (!node) return;
//         if (res.length === k) return;

//         const l = node.left;
//         const r = node.right;

//         traverse(l);

//         res.push(node.val);
//         traverse(r);
//     };

//     traverse(root);

//     return res[k - 1];
// };

var kthSmallest = function (root, k) {
    const stack = [];
    let cur = root;
    let count = k;
    while (stack.length || cur) {
        while (cur) {
            stack.push(cur);
            cur = cur.left;
        }

        count--;
        cur = stack.pop();

        if (!count) {
            return cur.val;
        }

        cur = cur.right;
    }
};
