// 问题：将二叉树序列化为字符串，再反序列化为树。
// 解法：前序遍历 + 分隔符，递归重建树。
// 注意：空节点的处理。

// 1. 只有根节点的树
// 树结构：根节点为 1，无左、右子树
// 序列化结果：1,#,#
// 2. 只有左子树的树
// 树结构：根 1 → 左孩子 2 → 左孩子 3（2 和 3 均无右子树）
// 序列化结果：1,2,3,#,#,#,#
// 3. 只有右子树的树
// 树结构：根 1 → 右孩子 2 → 右孩子 3（2 和 3 均无左子树）
// 序列化结果：1,#,2,#,3,#,#
// 4. 空树（无任何节点）
// 树结构：没有任何节点
// 序列化结果：#

class Tree {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

const node1 = new Tree(1);
const node2 = new Tree(2);
const node3 = new Tree(3);

node1.left = node2;
node2.left = node3;

// 序列化
// 时间复杂度： o(n)要遍历n个节点
// 空间复杂度：o(n)
function serializationTree(tree) {
    const traverse = (treeNode, result) => {
        if (!treeNode) return result.push('#');

        result.push(treeNode.val);
        traverse(treeNode.left, result);
        traverse(treeNode.right, result);

        return result;
    };

    return traverse(tree, []).join(',');
}

// 时间复杂度： o(n) 要遍历n个节点
// 空间复杂度： o(n);
function deserializationTree(chars, nums) {
    if (!chars.length || chars[nums[0]] === '#') {
        return null;
    }

    const base = new Tree(chars[nums[0]]);
    nums[0] += 1;

    base.left = deserializationTree(chars, nums);
    base.right = deserializationTree(chars, nums);

    return base;
}

const result = serializationTree(node1);
console.log(result);
console.log(deserializationTree(result.split(','), [0]));
