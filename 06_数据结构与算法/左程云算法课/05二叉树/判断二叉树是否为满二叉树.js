// 左树和右树的高度差不超过1
class Node {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

const node1 = new Node(2);
const node2 = new Node(1);
const node3 = new Node(3);
const node4 = new Node(3);
const node5 = new Node(3);
const node6 = new Node(3);
const node7 = new Node(3);
node1.left = node2;
node1.right = node3;
node2.left = node4;
node2.right = node5;
node3.left = node6;
node3.right = node7;

// 非叶子节点都是有左右子树的
// 也就是说节点数 n ，高度是 x 的话， n = 2 的 x 次方 -1
class ReturnType {
    constructor(nodes, height) {
        this.nodes = nodes;
        this.height = height;
    }
}
class FullBinaryTree {
    static isFBT(header) {
        if (!header) return false;

        const data = this.process(header);

        return data.nodes === (1 << data.height) - 1;
    }

    static process(cur) {
        if (!cur) {
            return new ReturnType(0, 0);
        }

        const leftData = this.process(cur.left);
        const rightData = this.process(cur.right);

        return new ReturnType(
            leftData.nodes + rightData.nodes + 1,
            Math.max(leftData.height, rightData.height) + 1
        );
    }
}

console.log(FullBinaryTree.isFBT(node1));
