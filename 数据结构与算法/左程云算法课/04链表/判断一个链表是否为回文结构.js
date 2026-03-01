class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

const header1 = new Node(1);
header1.next = new Node(3);
header1.next.next = new Node(3);
header1.next.next.next = new Node(1);

// abcdef
// abcffa
/**
 * 思路1:
 * 1、遍历链表入栈，然后出栈，和原链表比较
 * 2、因为栈是先进后出，所以可以实现逆序，链表逆序的值和原链表相同，说明是回文
 */
function isPalindrome1(head) {
    const stack = [];
    let cur = head;
    while (cur) {
        stack.push(cur.value);
        cur = cur.next;
    }
    cur = head;
    while (cur) {
        if (cur.value !== stack.pop()) {
            return false;
        }
        cur = cur.next;
    }
    return true;
}

// console.log(isPalindrome1(header1));

/** 思路2：
 * 1、用快慢指针确定中点和结束位置
 * 2、从结束位置和开始位置向中间遍历，一直相等说明为回文
 * 3、这样就不用申请额外的栈空间
 */
function isPalindrome2(head) {
    if (!head || !head.next) return true;

    let slow = head;
    let quick = head;
    let pivot = null;
    let end = null;

    // 快慢指针确定中点
    while (quick && quick.next) {
        slow = slow.next;
        quick = quick.next.next;
    }

    // 反转后半部分链表
    let pre = null;
    let cur = slow;
    while (cur) {
        const next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }

    let p1 = head;
    let p2 = pre;

    while (p2) {
        if (p1.value !== p2.value) {
            return false;
        }

        p1 = p1.next;
        p2 = p2.next;
    }

    return true;
}
console.log(isPalindrome2(header1));
