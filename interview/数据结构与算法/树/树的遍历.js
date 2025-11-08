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
const preOrder = root => {
    if (!root) return;
    console.log(root.val);
    preOrder(root.left);
    preOrder(root.right);
};
// preOrder(node1); // 1\2\4\5\3\6\7

const inOrder = root => {
    if (!root) return;
    inOrder(root.left);
    console.log(root.val);
    inOrder(root.right);
};
// inOrder(node1); // 4\2\5\1\6\3\7

const postOrder = root => {
    if (!root) return;
    postOrder(root.left);
    postOrder(root.right);
    console.log(root.val);
};
// postOrder(node1); // 4\5\2\6\7\3\1

// 非递归遍历
const preOrder1 = root => {
    if (!root) return;

    let p = root;
    const stack = [];

    while (p) {
        const left = p.left;
        const right = p.right;

        console.log(p.val);

        right && stack.push(right);
        left && stack.push(left);

        p = stack.pop();
    }
};
// preOrder1(node1); // 1\2\4\5\3\6\7

const inOrder1 = root => {
    if (!root) return;

    let p = root;
    const stack = [];

    // 把整个树一直以根左的方式压栈
    while (p || stack.length) {
        if (p) {
            stack.push(p);
            p = p.left;
        } else {
            p = stack.pop();
            console.log(p.val);
            p = p.right;
        }
    }
};
// inOrder1(node1); // 4\2\5\1\6\3\7

const postOrder1 = root => {
    if (!root) return;

    const stack1 = [root];
    const stack2 = []; // 记录入栈过程后统一输出

    while (stack1.length) {
        const cur = stack1.pop();
        stack2.push(cur);

        if (cur.left) {
            stack1.push(cur.left);
        }

        if (cur.right) {
            stack1.push(cur.right);
        }
    }

    while (stack2.length) {
        console.log(stack2.pop().val);
    }
};
postOrder1(node1); // 4\5\2\6\7\3\1
