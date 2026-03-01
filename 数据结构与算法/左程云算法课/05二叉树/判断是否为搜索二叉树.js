// 左子树都比根小，右子树都比根大就是搜索二叉树
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

node1.left = node2;
node1.right = node3;

class RetrunType {
    constructor(isBST, val) {
        this.isBST = isBST;
        this.val = val;
    }
}
class BinarySearchTree {
    static isBinarySearchTree(header) {
        const info = this.process(header);
        return info.isBST;
    }

    static process(cur) {
        if (!cur) {
            return new RetrunType(true, null);
        }

        const leftInfo = this.process(cur.left);

        if (!leftInfo.isBST) return new RetrunType(false, cur.val);

        if (cur.val <= leftInfo.val && leftInfo.val !== null) {
            return new RetrunType(false, cur.val);
        }

        const rightInfo = this.process(cur.right);

        return new RetrunType(
            rightInfo.val === null
                ? rightInfo.isBST
                : rightInfo.isBST && cur.val < rightInfo.val,
            cur.val
        );
    }

    static pre = Number.MIN_VALUE;
    static isBinarySearchTree2(header) {
        if (!header) return true;

        const leftIsBST = this.isBinarySearchTree2(header.left);

        if (!leftIsBST) return false;

        // 按照这样写，这个逻辑是按中序遍历执行的
        if (header.val <= this.pre) {
            return false;
        } else {
            this.pre = header.val;
        }

        return this.isBinarySearchTree2(header.right);
    }

    // 非递归
    static isBinarySearchTree3(header) {
        const stack = [];
        let p = header;
        let pre = Number.MIN_VALUE;

        while (stack.length || p) {
            if (p) {
                stack.push(p);
                p = p.left;
            } else {
                const cur = stack.pop();

                if (pre >= cur.val) return false;

                pre = cur.val;
                p = cur.right;
            }
        }

        return true;
    }
}

console.log(BinarySearchTree.isBinarySearchTree(node1));
console.log(BinarySearchTree.isBinarySearchTree2(node1));
console.log(BinarySearchTree.isBinarySearchTree3(node1));
