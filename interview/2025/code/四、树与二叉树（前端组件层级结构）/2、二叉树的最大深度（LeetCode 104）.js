// 问题：逐层遍历二叉树，返回每一层的节点值。
class Tree {
    left = null;
    right = null;
    constructor(val) {
        this.val = val;
    }

    // 递归
    // 时间复杂度：O (n)（必须访问所有节点，与树的结构无关）。
    // 空间复杂度：O (n)（调用栈最深为n）。
    getMaxDeep() {
        let max = 0;

        const traverse = (treeNode, deep) => {
            if (!treeNode) return;

            max = Math.max(max, deep);

            treeNode.left && traverse(treeNode.left, deep + 1);
            treeNode.right && traverse(treeNode.right, deep + 1);
        };

        traverse(this, 1);

        console.log(max);
        return max;
    }

    // 递归优化写法
    getMaxDeep2() {
        const traverse = treeNode => {
            if (!treeNode) return 0;

            const leftDeep = traverse(treeNode.left);
            const rightDeep = traverse(treeNode.right);

            return Math.max(leftDeep, rightDeep) + 1;
        };

        const max = traverse(this);
        console.log('🚀 ~ Tree ~ getMaxDeep3 ~ max:', max);
        return max;
    }

    // 迭代
    // 时间复杂度：O (n)（必须访问所有节点，与树的结构无关）。
    // 空间复杂度：O (n)（由队列的最大存储量决定，最坏情况为树的最大宽度，即 O (n)）。
    getMaxDeep3() {
        const queue = [this];
        let max = 0;

        while (queue.length) {
            max++;

            const curLevelSize = queue.length;

            for (let i = 0; i < curLevelSize; i++) {
                const cur = queue.pop();
                cur.left && queue.push(cur.left);
                cur.right && queue.push(cur.right);
            }
        }

        console.log(max);
        return max;
    }
}

const treeNode1 = new Tree(1);
const treeNode2 = new Tree(2);
const treeNode3 = new Tree(3);

treeNode1.left = treeNode2;
// treeNode2.right = treeNode3;

treeNode1.getMaxDeep();
treeNode1.getMaxDeep2();

treeNode1.getMaxDeep3();
