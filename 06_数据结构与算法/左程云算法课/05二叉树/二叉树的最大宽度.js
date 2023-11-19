// 二叉树最大宽度
// 思路1：利用队列层序遍历每个节点，用一个 map 记录每一个节点对应的层号
// 在遍历层的时候，用一个变量记忆这一层的结点数
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

function maxWidth(node) {
    if (!node) return 0;

    const map = new Map();
    map.set(node, 1);
    let curLevel = 1;
    let curLevelNodes = 0;
    const queue = [node];
    let maxWidth = 1;

    while (queue.length) {
        const curNode = queue.shift();

        if (curLevel === map.get(curNode)) {
            curLevelNodes++;
        } else {
            maxWidth = Math.max(maxWidth, curLevelNodes);
            curLevelNodes = 1;
            curLevel++;
        }

        if (curNode.left) {
            queue.push(curNode.left);
            map.set(curNode.left, curLevel + 1);
        }

        if (curNode.right) {
            queue.push(curNode.right);
            map.set(curNode.right, curLevel + 1);
        }
    }

    return Math.max(maxWidth, curLevelNodes);
}

console.log(maxWidth(node1));

// 思路2：利用层序遍历，记录当前层的结束点，和下一层的结束点(最新进队列的就是)
// 如果遍历到当前层的结束点就另起一层，利用这两个节点就知道一层的开始和结束
// 从而去统计一层的结点数

function maxWidth2(node) {
    if (!node) return 0;

    let curLevelEnd = node;
    let nextLevelEnd = null;
    const queue = [node];
    let maxWidth = 1;
    let curLevelNodes = 1;

    while (queue.length) {
        const curNode = queue.shift();

        if (curNode.left) {
            queue.push(curNode.left);
            nextLevelEnd = curNode.left;
        }

        if (curNode.right) {
            queue.push(curNode.right);
            nextLevelEnd = curNode.right;
        }

        if (curNode === curLevelEnd) {
            curLevelNodes++;
            maxWidth = Math.max(maxWidth, curLevelNodes);
            curLevelEnd = nextLevelEnd;
            curLevelNodes = 0;
        } else {
            curLevelNodes++;
        }
    }

    return maxWidth;
}

console.log(maxWidth2(node1));
