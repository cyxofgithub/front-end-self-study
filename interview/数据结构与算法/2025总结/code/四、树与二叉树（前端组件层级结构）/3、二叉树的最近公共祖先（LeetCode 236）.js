// 问题：找到两个节点的最近公共祖先。
class Tree {
    left = null;
    right = null;
    constructor(val) {
        this.val = val;
    }
}

// 标准的递归做法
// 时间复杂度：O (n)
// 递归过程中，每个节点会被恰好访问一次（后序遍历的特性）。
// 无论树的结构如何（平衡或倾斜），都需要遍历所有可能包含 p 或 q 的节点，因此总时间复杂度为 O(n)（n 为二叉树的节点总数）。
// 空间复杂度：O (h)（h 为树的深度）
// 空间开销来自递归调用栈，栈的深度等于树的深度 h：
// 最坏情况（斜树，所有节点只有左 / 右孩子）：h = n，空间复杂度为 O(n)；
// 最好情况（平衡二叉树）：h = log2 n，空间复杂度为 O(log n)。
function getAncestor2(root, node1, node2) {
    // 如果一个目标节点就在root，那么root就是结果
    if (!root || root === node1 || root === node2) return root;

    const left = getAncestor2(root.left, node1, node2);
    const right = getAncestor2(root.right, node1, node2);

    // left 和 right 都找到了目标点，说明root就是公共祖先
    if (left && right) {
        return root;
    }

    // 否则存在左或者右子树中
    return left ? left : right;
}

const treeNode1 = new Tree(1);
const treeNode2 = new Tree(2);
const treeNode3 = new Tree(3);
const treeNode4 = new Tree(4);

treeNode1.left = treeNode2;
treeNode2.left = treeNode3;
treeNode3.right = treeNode4;

getAncestor(treeNode1, treeNode4, treeNode3);
console.log(getAncestor2(treeNode1, treeNode4, treeNode3));
