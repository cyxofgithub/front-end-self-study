// 问题：反转单链表。

class ListNode {
    constructor(value = null, next = null) {
        this.value = value;
        this.next = next;
    }

    // 迭代法
    reverse() {
        let pre = null;
        let cur = this;

        while(cur) {
            const next = cur.next;
            cur.next = pre;
            pre = cur;
            cur = next;
        }

        return pre;
    }

    // 递归法
    reverse2() {
        const traverse = (head) => {
            // 终止条件
            if (!head || !head.next) return head;

            // 1. 先递归处理后续节点，得到反转后的新头节点
            const newHead = traverse(head.next);
            
            // 2. 再调整当前节点与后继节点的指向
            const next = head.next;
            next.next = head; // 让后继节点指向自己
            head.next = null; // 断开原指向（避免循环）


            // 3. 返回反转后的新头节点（始终是原链表的最后一个节点）
            return newHead;
        }

        return traverse({...this});
    }
}

const node1 = new ListNode(1);
const node2= new ListNode(2);
const node3 = new ListNode(3);

node1.next = node2;
node2.next = node3;

// const newNode = node1.reverse()
// console.log(newNode);
const newNode2 = node1.reverse2()
console.log(newNode2);


