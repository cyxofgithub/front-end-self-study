class Node {
    constructor(val, next = null, random = null) {
        this.val = val;
        this.next = next;
        this.random = random;
    }
}
class CopyRandomList {
    constructor() {}
    static copy(header) {
        if (!header) return null;

        const map = new Map();

        let p = header;

        while (p !== null) {
            map.set(p, new Node(p.val));
            p = p.next;
        }

        p = header;

        while (p !== null) {
            map.get(p).next = map.get(p.next) ?? null;
            map.get(p).random = map.get(p.random) ?? null;
            p = p.next;
        }
        return map.get(header);
    }

    static copy2(header) {
        if (!header) return null;

        // 复制到下一位
        let p = header;
        while (p != null) {
            p.next = new Node(p.val, p.next, null);
            p = p.next.next;
        }

        // 复制到下一位
        p = header;
        while (p !== null) {
            const newNode = p.next;
            newNode.random = p.random?.next ?? null;
            p = p.next?.next;
        }

        const newHeader = header.next;

        // 分离
        p = header;
        while (p !== null) {
            const newNode = p.next;

            // 这两句顺序不能颠倒，如果颠倒了p.next.next拿到的就是新节点了
            // 可以画一画就知道了
            p.next = p.next.next;
            newNode.next = newNode.next?.next ?? null;

            p = p.next;
        }

        return newHeader;
    }
}

const node1 = new Node(1);
const node2 = new Node(2);
const node3 = new Node(3);
const node4 = new Node(4);
const node5 = new Node(5);
node1.next = node2;
node1.random = node5;

node2.next = node3;
node2.random = node4;

node3.next = node4;
node3.random = node1;

node4.next = node5;

const header = node1;

const res = CopyRandomList.copy(header);
console.log('🚀 ~ file: 复制含有随机指针节点的链表.js:50 ~ res:', res);
const res2 = CopyRandomList.copy2(header);
console.log('🚀 ~ file: 复制含有随机指针节点的链表.js:75 ~ res2:', res2);
