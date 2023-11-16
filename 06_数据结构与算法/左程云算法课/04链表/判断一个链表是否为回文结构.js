/**
 * 思路1:
 * 1、遍历链表入栈，然后出栈，和原链表比较
 * 2、因为栈是先进后出，所以可以实现逆序，链表逆序的值和原链表相同，说明是回文
 */

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

const header1 = new Node(2);
header1.next = new Node(3);
header1.next.next = new Node(3);

console.log(isPalindrome1(header1));

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
