// 任何一个节点有右无左，返回 false
// 如果遇到第一个节点有左无右，那么它后续的节点都应该是叶子节点，否则不是完全二叉树

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
node2.right = node5;

class BinaryComplteTree {
    static isBCT(header) {
        if (!header) return false;

        const stack = [header];
        let needIsLeaf = false;

        while (stack.length) {
            const cur = stack.shift();

            // 不满足叶子结点的条件，false
            if (needIsLeaf && (cur.left || cur.right)) return false;

            // 有右无左
            if (!cur.left && cur.right) {
                return false;
            }

            // 有左无右，后续应该是叶子结点
            if (cur.left && !cur.right) {
                needIsLeaf = true;
                stack.push(cur.left);
            }

            if (cur.left && cur.right) {
                stack.push(cur.left);
                stack.push(cur.right);
            }
        }

        return true;
    }
}

console.log(BinaryComplteTree.isBCT(node1));
