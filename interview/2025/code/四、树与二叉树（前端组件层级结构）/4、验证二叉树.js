// 问题：验证一棵二叉树是否为有效的二叉搜索树（BST）。
// 二叉搜索树的定义：
// 1. 节点的左子树只包含小于当前节点的数
// 2. 节点的右子树只包含大于当前节点的数
// 3. 所有左子树和右子树自身必须也是二叉搜索树
// 例如：[5, 1, 4, null, null, 3, 6] 不是有效的BST，因为根节点5的右子树包含节点4，而4 < 5

class TreeNode {
    left = null;
    right = null;
    constructor(val) {
        this.val = val;
    }
}

// 解法一：中序遍历法（递归）
// 核心思路：BST 的中序遍历结果是有序的（升序）。如果中序遍历过程中，当前节点的值小于等于前一个节点的值，则不是BST。
// 时间复杂度：O(n) - 需要遍历所有节点
// 空间复杂度：O(h) - h 为树的高度，递归调用栈的深度
function isValidBST1(root) {
    let prev = -Infinity;

    const inorder = (node) => {
        if (!node) return true;

        // 先遍历左子树
        if (!inorder(node.left)) return false;

        // 中序遍历位置：检查当前节点值是否大于前一个节点值
        if (node.val <= prev) return false;
        prev = node.val;

        // 再遍历右子树
        return inorder(node.right);
    };

    return inorder(root);
}

// 解法二：中序遍历法（非递归）
// 思路：使用栈模拟中序遍历过程，在遍历过程中检查是否有序
// 时间复杂度：O(n)
// 空间复杂度：O(h) - 栈的最大深度为树的高度
function isValidBST2(root) {
    if (!root) return true;

    const stack = [];
    let p = root;
    let prev = -Infinity;

    while (stack.length || p) {
        // 一直向左走到底
        while (p) {
            stack.push(p);
            p = p.left;
        }

        // 弹出节点并检查
        p = stack.pop();
        if (p.val <= prev) return false;
        prev = p.val;

        // 转向右子树
        p = p.right;
    }

    return true;
}

// 解法三：递归上下界法
// 核心思路：为每个节点设置上下界（min, max），递归检查每个节点是否在合理范围内
// 对于左子树，上界是父节点的值；对于右子树，下界是父节点的值
// 时间复杂度：O(n)
// 空间复杂度：O(h) - 递归调用栈的深度
function isValidBST3(root) {
    const validate = (node, min, max) => {
        // 空节点是有效的BST
        if (!node) return true;

        // 检查当前节点值是否在合理范围内
        if (min !== null && node.val <= min) return false;
        if (max !== null && node.val >= max) return false;

        // 递归检查左子树和右子树
        // 左子树的上界是当前节点值，右子树的下界是当前节点值
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    };

    return validate(root, null, null);
}

// 解法四：中序遍历收集到数组后检查
// 思路：先中序遍历收集所有节点值到数组，然后检查数组是否严格递增
// 时间复杂度：O(n) - 遍历一次树 + 遍历一次数组
// 空间复杂度：O(n) - 需要存储所有节点值
function isValidBST4(root) {
    const values = [];

    const inorder = (node) => {
        if (!node) return;
        inorder(node.left);
        values.push(node.val);
        inorder(node.right);
    };

    inorder(root);

    // 检查数组是否严格递增
    for (let i = 1; i < values.length; i++) {
        if (values[i] <= values[i - 1]) return false;
    }

    return true;
}

// 测试用例
// 构建测试树1：有效的BST
//       5
//      / \
//     1   7
//        / \
//       6   8
const node1 = new TreeNode(5);
const node2 = new TreeNode(1);
const node3 = new TreeNode(7);
const node4 = new TreeNode(6);
const node5 = new TreeNode(8);
node1.left = node2;
node1.right = node3;
node3.left = node4;
node3.right = node5;

// 构建测试树2：无效的BST
//       5
//      / \
//     1   4
//        / \
//       3   6
const node6 = new TreeNode(5);
const node7 = new TreeNode(1);
const node8 = new TreeNode(4);
const node9 = new TreeNode(3);
const node10 = new TreeNode(6);
node6.left = node7;
node6.right = node8;
node8.left = node9;
node8.right = node10;

console.log('测试1（有效BST）:');
console.log('解法1:', isValidBST1(node1)); // true
console.log('解法2:', isValidBST2(node1)); // true
console.log('解法3:', isValidBST3(node1)); // true
console.log('解法4:', isValidBST4(node1)); // true

console.log('\n测试2（无效BST）:');
console.log('解法1:', isValidBST1(node6)); // false
console.log('解法2:', isValidBST2(node6)); // false
console.log('解法3:', isValidBST3(node6)); // false
console.log('解法4:', isValidBST4(node6)); // false
