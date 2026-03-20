class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

const header1 = new Node(1);
const node2 = new Node(2);
const node3 = new Node(3);
const node4 = new Node(4);
const node5 = new Node(5);
header1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node5;
node5.next = node3; // 回环

// 问题1：该链表是否有回环，获取入环节点
// 思路1：用一个 set 记录遍历过的节点，一个节点出现两次说明有回环且是回环入口，缺点是要用额外的空间
function getCircleEntry1(header) {
    const set = new Set();

    let cur = header;

    while (cur) {
        if (set.has(cur)) {
            return cur;
        }

        set.add(cur);
        cur = cur.next;
    }

    return null;
}
// console.log(getCircleEntry1(header1));

// 思路2：用快慢指针的方法，你追我赶，追上了说明是有回环的，快指针为空说明没有回环
// 思路2：当找到回环后让快指针从头部开始走，慢指针还是在回环里，两个人都一直以同样的速度走相遇的时候就是回环的入口
function getCircleEntry2(header) {
    let p1 = header;
    let p2 = header;

    while (p2) {
        p1 = p1.next;
        p2 = p2.next?.next;

        if (p1 === p2) {
            p2 = header;

            while (p1) {
                if (p1 === p2) {
                    return p1;
                }

                p1 = p1.next;
                p2 = p2.next;
            }
        }
    }

    return null;
}

console.log(getCircleEntry2(header1));
