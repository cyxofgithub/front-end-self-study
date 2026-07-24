/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
// var detectCycle = function (head) {
//     if (!head || !head?.next) return null;

//     const set = new Set();

//     let p = head;

//     while (p) {
//         if (set.has(p)) return p;

//         set.add(p);
//         p = p.next;
//     }

//     return null;
// };

var detectCycle = function (head) {
    if (!head || !head?.next) return null;

    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            let p = head;

            while (p !== slow) {
                p = p.next;
                slow = slow.next;
            }

            return p;
        }
    }

    return null;
};
