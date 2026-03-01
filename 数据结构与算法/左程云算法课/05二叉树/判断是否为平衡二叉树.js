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

node1.left = node2;
node1.right = node3;
node2.left = node4;
node4.right = node5;

class ReturnType {
    constructor(isBBT, height) {
        this.isBBT = isBBT;
        this.height = height;
    }
}
class BinaryBalanceTree {
    static isBBT(header) {
        if (!header) return false;

        return this.process(header).isBBT;
    }

    static process(cur) {
        if (!cur) return new ReturnType(true, 0);

        const { isBBT: isBBT1, height: height1 } = this.process(cur.left);
        const { isBBT: isBBT2, height: height2 } = this.process(cur.right);
        const heigthDiff = Math.abs(height1 - height2);

        return new ReturnType(
            isBBT1 && isBBT2 && heigthDiff <= 1,
            Math.max(height1, height2) + 1
        );
    }
}

console.log(BinaryBalanceTree.isBBT(node1));
