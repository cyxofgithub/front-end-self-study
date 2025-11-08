class BFS {
    static exec(node) {
        if (!node) return;

        const stack = [node];
        const set = new Set();

        while (stack.length) {
            const cur = stack.pop();

            set.add(cur);
            console.log(cur.val);

            for (const next of cur.nexts) {
                if (!set.has(next)) {
                    stack.unshift(next);
                }
            }
        }
    }
}

const { Node } = require('./实现图的结构');
const node1 = new Node(1);
const node2 = new Node(2);
const node3 = new Node(3);
const node4 = new Node(4);
node1.nexts = [node2, node3];
node3.nexts = [node4];

BFS.exec(node1);
