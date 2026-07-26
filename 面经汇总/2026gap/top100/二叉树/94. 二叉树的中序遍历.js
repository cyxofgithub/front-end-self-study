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
// var inorderTraversal = function (root) {
//     let ans = [];

//     if (!root) return ans;

//     const process = (node) => {
//         if (!node) return;

//         process(node.left);
//         ans.push(node.val);
//         process(node.right);
//     };

//     process(root);

//     return ans;
// };

var inorderTraversal = function (root) {
    const ans = [];

    if (!root) return ans;

    const stack = [];
    let cur = root;

    // 按递归顺序压栈
    while (cur || stack.length) {
        // 根先进然后先压左边
        while (cur) {
            stack.push(cur);
            cur = cur.left;
        }

        cur = stack.pop();
        ans.push(cur.val);

        // 再转到右边
        cur = cur.right;
    }

    return ans;
};
