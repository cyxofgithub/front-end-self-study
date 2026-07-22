/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
// var getIntersectionNode = function (headA, headB) {
//     const set = new Set();
//     let cur = headA;
//     while (cur) {
//         set.add(cur);
//         cur = cur.next;
//     }
//     cur = headB;
//     while (cur) {
//         if (set.has(cur)) return cur;
//         cur = cur.next;
//     }
//     return null;
// };

var getIntersectionNode = function (headA, headB) {
    let p1 = headA;
    let p2 = headB;

    // p1 走 A 独立部分 + 合并部分 + B 独立部分
    // p2 走 B 独立部分 + 合并部分 + A 独立部分
    // 如果相交是会走到一起，不相交就都最后走到null
    while (p1 !== p2) {
        p1 = p1 ? p1.next : headB;
        p2 = p2 ? p2.next : headA;
    }

    return p1;
};
