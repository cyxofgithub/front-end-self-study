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
node1.right.left = new Node(6);
node1.right.right = new Node(7);

// 递归遍历
const preOrder = (root) => {
    if (!root) return;
    console.log(root.val);
    preOrder(root.left);
    preOrder(root.right);
};
// preOrder(node1); // 1\2\4\5\3\6\7

const inOrder = (root) => {
    if (!root) return;
    inOrder(root.left);
    console.log(root.val);
    inOrder(root.right);
};
// inOrder(node1); // 4\2\5\1\6\3\7

const postOrder = (root) => {
    if (!root) return;
    postOrder(root.left);
    postOrder(root.right);
    console.log(root.val);
};
// postOrder(node1); // 4\5\2\6\7\3\1

// 非递归遍历
const preOrder1 = (root) => {
    if (!root) return;
    const stack = [root];

    while (stack.length) {
        const curNode = stack.pop();
        console.log(curNode.val);

        // 先右后左的方式压栈出栈就优先拿到左节点
        if (curNode.right) {
            stack.push(curNode.right);
        }

        if (curNode.left) {
            stack.push(curNode.left);
        }
    }
};
// preOrder1(node1); // 1\2\4\5\3\6\7

const inOrder1 = (root) => {
    if (!root) return;
    let header = root;

    const stack = [];

    while (header || stack.length) {
        // 可以把整颗树看成只有左树，不断以头左的方式入栈
        if (header) {
            stack.push(header);
            header = header.left;
        } else {
            header = stack.pop();
            console.log(header.val);
            header = header.right;
        }
    }
};
inOrder1(node1); // 4\2\5\1\6\3\7
