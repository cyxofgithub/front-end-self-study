class TreeNode {
    constructor(val, left = null, right = null, parent = null) {
        this.val = val;
        this.left = left;
        this.right = right;
        this.parent = parent;
    }
}

const root = new TreeNode(1);
const left = new TreeNode(2);
const right = new TreeNode(3);

left.parent = root;
right.parent = root;

root.left = left;
root.right = right;

class FindTheSuccesorNode {
    static findSuccesorNode(node) {
        if (!node) return null;

        if (node.right) {
            return this.getMostLeftNode(node.right);
        }

        let cur = node;
        let parent = node.parent;

        // 代入中序遍历思考
        while (parent !== null && parent.left !== cur) {
            cur = parent;
            parent = parent.parent;
        }

        return parent;
    }

    static getMostLeftNode(node) {
        if (!node) return null;

        let p = node;

        while (p.left) {
            p = p.left;
        }

        return p;
    }
}

console.log(FindTheSuccesorNode.findSuccesorNode(root));
