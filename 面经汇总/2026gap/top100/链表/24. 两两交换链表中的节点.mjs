import { buildList, ListNode } from './listNode.mjs';
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
// var swapPairs = function (head) {
//     if (!head || !head.next) return head;

//     const one = head;
//     const two = head.next;
//     const subHead = two.next;

//     two.next = one;
//     one.next = swapPairs(subHead);

//     return two;
// };

var swapPairs = function (head) {
    let p = new ListNode();
    p.next = head;

    const start = p;

    while (p.next && p.next.next) {
        const one = p.next;
        const two = p.next.next;

        p.next = two;
        one.next = two.next;
        two.next = one;

        p = one;
    }

    return start.next;
};

swapPairs(buildList([1, 2, 3, 4]));
