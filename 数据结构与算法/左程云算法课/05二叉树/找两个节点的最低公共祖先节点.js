class Node {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

const node1 = new Node(1);
const node2 = new Node(2);
const node3 = new Node(3);
const node4 = new Node(4);
const node5 = new Node(5);

node1.left = node2;
node1.right = node3;

node2.left = node4;
node2.right = node5;

class FindLowestAncestor {
    static getLowestAncestor(root, node1, node2) {
        const faterMap = new Map();
        this.process(root, faterMap);

        const set1 = new Set();

        let p1 = node1;

        // 生成一个父级链条
        while (p1) {
            set1.add(p1);
            p1 = faterMap.get(p1);
        }

        let p2 = node2;

        // 沿着 p2 向上找，最先找到和 p1 父亲链匹配的就是最低公共祖先节点
        while (p2) {
            if (set1.has(p2)) {
                return p2;
            }

            p2 = faterMap.get(p2);
        }

        return null;
    }

    static process(cur, faterMap) {
        if (!cur) return;

        cur.left && faterMap.set(cur.left, cur);
        cur.right && faterMap.set(cur.right, cur);

        this.process(cur.left, faterMap);
        this.process(cur.right, faterMap);
    }

    static getLowestAncestor2(root, node1, node2) {
        // basecase
        // 如果根为空返回空
        // 只要当前根节点是p和q中的任意一个，就返回（因为不能比这个更深了，再深p和q中的一个就没了）
        if (!root || root === node1 || root === node2) return root;

        const left = this.getLowestAncestor2(root.left, node1, node2);
        const right = this.getLowestAncestor2(root.right, node1, node2);

        // 左右都没有
        if (!left && !right) return null;

        // 左右都找到节点说明根就是祖先，这句可以代入最边缘的叶子结点思考一下
        if (left && right) return root;

        // 其中一边找到，说明两个节点同在右或同在左
        return left ? left : right;
    }
}

console.log(FindLowestAncestor.getLowestAncestor(node1, node4, node5));
console.log(FindLowestAncestor.getLowestAncestor2(node1, node4, node5));
