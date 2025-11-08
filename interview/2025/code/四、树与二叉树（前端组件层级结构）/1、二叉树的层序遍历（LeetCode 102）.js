// 问题：逐层遍历二叉树，返回每一层的节点值。
class Tree {
    left = null;
    right = null;
    constructor(val) {
        this.val = val;
    }

    // 时间复杂度：O (n)（必须访问所有节点，与树的结构无关）。
    // 空间复杂度：O (n)（由队列的最大存储量决定，最坏情况为树的最大宽度，即 O (n)）。
    traverse() {
        const queue = [this];
        const result = [];

        while (queue.length) {
            const size = queue.length;
            const curLevelResult = [];
            for (let i = 0; i < size; i++) {
                const cur = queue.shift();
                curLevelResult.push(cur.val);

                cur.left && queue.push(cur.left);
                cur.right && queue.push(cur.right);
            }
            result.push(curLevelResult);
        }

        return result;
    }
}

const treeNode1 = new Tree(1);
const treeNode2 = new Tree(2);
const treeNode3 = new Tree(3);
const treeNode4 = new Tree(4);

treeNode1.left = treeNode2;
treeNode1.right = treeNode3;
treeNode2.right = treeNode4;

console.log(treeNode1.traverse());
