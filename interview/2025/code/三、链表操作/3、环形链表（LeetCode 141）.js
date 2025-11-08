// 问题：判断链表是否有环。
class ListNode {
    next = null;
    constructor(value = null) {
        this.value = value;
    }
    // 时间复杂度：O(n)
    // 空间复杂度：O(n)
    hasCircle() {
        let p = this;
        const set = new Set();

        while (p) {
            if (set.has(p)) {
                return true;
            }

            set.add(p);
            p = p.next;
        }

        return false;
    }

    // 快慢指针
    // 时间复杂度：O(n)，快慢指针相遇最多O(n)，找入口最多O(n)。
    // 空间复杂度：O(1)，仅使用常数个指针变量。
    hasCircle2() {
        if (!this.next || !this) return false;

        let p1 = this;
        let p2 = this;

        while (p1 && p2) {
            p1 = p1.next;
            p2 = p2.next?.next || null;
            if (p1 === p2) return true;
        }

        return false;
    }
}

const node1 = new ListNode(1);
const node2 = new ListNode(1);
const node3 = new ListNode(1);
node1.next = node2;
node2.next = node3;
node3.next = node2;

console.log(node1.hasCircle());
console.log(node1.hasCircle2());
