class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

const header1 = new Node(1);
header1.next = new Node(3);
header1.next.next = new Node(5);

// 反转单向链表
function reverseList(header) {
    let pre = null;
    let cur = header;
    let next = null;

    while (cur) {
        next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    console.log(pre);
}

// reverseList(header1);

// 反转双向链表
class DoubleNode {
    constructor(value) {
        this.value = value;
        this.pre = null;
        this.next = null;
    }
}

const header = new DoubleNode(1);
const node2 = new DoubleNode(2);
const node3 = new DoubleNode(3);

header.next = node2;
node2.pre = header;
node2.next = node3;
node3.pre = node2;

function reverseDoubleList(header) {
    let pre = null;
    let cur = header;
    let next = null;

    while (cur) {
        next = cur.next;

        cur.next = pre;
        cur.pre = next;

        pre = cur;
        cur = next;
    }

    console.log(pre);
}
reverseDoubleList(header);

// // 反转双向链表
// class DoubleNode {
//     constructor(value) {
//         this.value = value;
//         this.pre = null;
//         this.next = null;
//     }
// }

// const header = new DoubleNode(1);
// const node2 = new DoubleNode(2);
// const node3 = new DoubleNode(3);

// header.next = node2;
// node2.pre = header;
// node2.next = node3;
// node3.pre = node2;

// function reverseDoubleList(head) {
//     let pre = null;
//     let next = null;

//     while (head) {
//         next = head.next; // 保存下一个节点

//         head.next = pre;
//         head.pre = next; // 反转

//         pre = head; // 保存当前节点
//         head = next; // 移动到下一个节点
//     }

//     console.log(pre);
// }

// reverseDoubleList(header);
