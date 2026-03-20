class ListNode {
    next = null;
    constructor(value = null) {
        this.value = value;
    }

    // 迭代法 复杂度分析：
    // 时间复杂度：O (n + m)，n 和 m 分别为两个链表的长度，需遍历所有节点
    // 空间复杂度：O (1)，仅使用常数级额外空间
    merge(head2) {
        let p1 = this;
        let p2 = head2;
        const head = new ListNode(-1);
        let current = head;

        while (p1 && p2) {
            if (p1.value <= p2.value) {
                current.next = p1;
                p1 = p1.next;
            } else {
                current.next = p2;
                p2 = p2.next;
            }
            current = current.next;
        }

        current.next = p1 ? p1 : p2;

        return head.next;
    }

    // 递归法
    // 时间复杂度：O (n + m)，需访问所有节点
    // 空间复杂度：O (n + m)，额外空间主要来自调用栈的栈帧，递归调用栈的深度最坏为两个链表长度之和
    merge2(head2) {
        const head = new ListNode(-1);

        const traverse = (head1, head2, cur) => {
            if (!head1 || !head2) return (cur.next = head1 ? head1 : head2);

            if (head1.value <= head2.value) {
                cur.next = head1;
                traverse(head1.next, head2, cur.next);
            } else {
                cur.next = head2;
                traverse(head1, head2.next, cur.next);
            }
        };

        traverse(this, head2, head);

        return head.next;
    }
}

const node1 = new ListNode(1);
const node2 = new ListNode(3);
const node3 = new ListNode(5);

node1.next = node2;
node2.next = node3;

const node4 = new ListNode(2);
const node5 = new ListNode(4);

node4.next = node5;

// const result = node4.merge(node1);
// console.log(result);

const result2 = node4.merge2(node1);
console.log(result2);
