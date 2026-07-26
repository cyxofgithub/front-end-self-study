import { buildTree } from './treeNode.mjs';
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
// 层序 + 回文判断
// var isSymmetric = function (root) {
//     if (!root) return false;

//     let stack = [root];

//     while (stack.length) {
//         const next = [];

//         let count = stack.length;

//         // 层序
//         while (count > 0) {
//             count--;
//             const cur = stack.pop();
//             cur && next.push(cur.left);
//             cur && next.push(cur.right);
//         }

//         let left = 0;
//         let right = next.length - 1;

//         // 回文
//         while (left < right) {
//             if (next[left]?.val !== next[right]?.val) return false;
//             left++;
//             right--;
//         }

//         stack = next;
//     }

//     return true;
// };

var isSymmetric = function (root) {
    // 左子树、右子树互为镜像
    const check = (l, r) => {
        if (!l && !r) return true;
        if (!l || !r) return false;

        return (
            l.val === r.val && check(l.left, r.right) && check(l.right, r.left)
        );
    };

    return check(root.left, root.right);
};

console.log(isSymmetric(buildTree([1, 2, 2, null, 3, null, 3])));
