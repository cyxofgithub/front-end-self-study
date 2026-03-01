class DFS {
    static exec(node) {
        if (!node) return;

        const stack = [node];
        const set = new Set([node]);
        console.log(node.val);

        while (stack.length) {
            const cur = stack.pop();
            for (const next of cur.nexts) {
                if (!set.has(next)) {
                    stack.push(cur);
                    stack.push(next);
                    set.add(next);
                    console.log(next.val);
                    break;
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
const node5 = new Node(5);
node1.nexts = [node3, node2];
node3.nexts = [node4];
node4.nexts = [node5];

DFS.exec(node1);
