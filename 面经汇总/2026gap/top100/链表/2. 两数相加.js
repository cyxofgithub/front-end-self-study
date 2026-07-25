/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

function ListNode(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
}
var addTwoNumbers = function (l1, l2) {
    let p1 = l1;
    let p2 = l2;
    let head = new ListNode();
    let cur = head;

    let indent = 0;
    while (p1 || p2) {
        const count = (p1?.val || 0) + (p2?.val || 0) + indent;

        if (count >= 10) {
            indent = Math.floor(count / 10);
        } else {
            indent = 0;
        }

        cur.next = new ListNode(count % 10);
        cur = cur.next;

        p1 && (p1 = p1.next);
        p2 && (p2 = p2.next);
    }

    if (indent) {
        cur.next = new ListNode(indent);
    }

    return head.next;
};
