/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
    let p1 = list1;
    let p2 = list2;
    let head = {
        val: 0,
        next: null,
    };
    let cur = head;

    while (p1 && p2) {
        const next = p1.val > p2.val ? p2 : p1;
        cur.next = next;
        cur = next;
        next === p1 ? (p1 = p1.next) : (p2 = p2.next);
    }

    cur.next = p1 || p2;

    return head.next;
};
