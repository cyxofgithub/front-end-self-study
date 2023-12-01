class Node {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

const node1 = new Node(1);
node1.left = new Node(2);
node1.right = new Node(3);
node1.left.left = new Node(4);
node1.left.right = new Node(5);
node1.right.left = null;
node1.right.right = new Node(7);

class SerializationTree {
    // 遍历方法
    static stringify(root) {
        if (!root) return '';

        const queue = [root];
        let res = '';
        while (queue.length) {
            const cur = queue.shift();
            res += String(cur ? cur.val : '#');

            if (!cur?.left && !cur?.right) {
                continue;
            }
            queue.push(cur.left);
            queue.push(cur.right);
        }

        return res;
    }

    // 遍历方法
    static parse(serializaTree) {
        if (!serializaTree.length) return null;

        const arr = serializaTree.split('');

        let root = new Node(arr.shift());

        const queue = [root];

        while (arr.length) {
            const p = queue.shift();

            if (!p) continue;

            const left = arr.shift();
            const right = arr.shift();
            p.left = left !== '#' ? new Node(left) : null;
            p.right = right !== '#' ? new Node(right) : null;
            queue.push(p.left);
            queue.push(p.right);
        }

        return root;
    }

    // 递归
    static stringify2(root) {
        if (root === null) return '#';
        let res = root.val;
        res += this.stringify2(root.left);
        res += this.stringify2(root.right);

        return res;
    }

    // 递归
    static parse2(serializaTree) {
        const queue = serializaTree.split('');

        return this.process(queue);
    }

    static process(queue) {
        const val = queue.shift();

        if (val === '#') return null;

        const header = new Node(val);

        if (queue.length) {
            header.left = this.process(queue);
            header.right = this.process(queue);
        }

        return header;
    }
}

const string = SerializationTree.stringify(node1);
console.log('🚀 ~ file: 二叉树的序列化和反序列化.js:53 ~ string:', string);
const res = SerializationTree.parse(string);
console.log('🚀 ~ file: 二叉树的序列化和反序列化.js:55 ~ res:', res);

const string2 = SerializationTree.stringify2(node1);
console.log('🚀 ~ file: 二叉树的序列化和反序列化.js:103 ~ string2:', string2);
const res2 = SerializationTree.parse2(string2);
console.log('🚀 ~ file: 二叉树的序列化和反序列化.js:90 ~ res2:', res2);
