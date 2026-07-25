/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
// var removeNthFromEnd = function (head, n) {
//     let p = head;
//     let pre = null;

//     // 移动到最后
//     while (p) {
//         p.pre = pre;
//         pre = p;
//         p = p.next;
//     }

//     let step = n - 1;
//     let cur = pre;

//     // 往回走 n 步
//     while (step) {
//         cur = cur.pre;
//         step--;
//     }

//     // 断开第 n 个节点
//     // 刚好是开头直接返回第二个节点
//     if (!cur.pre) {
//         return cur.next;
//     }

//     const right = cur.next;
//     const left = cur.pre;
//     left.next = right;

//     return head;
// };

var removeNthFromEnd = function (head, n) {
    // 记录索引和节点关系
    const map = new Map();
    let p = head;
    let count = 0;
    while (p) {
        count++;
        map.set(count, p);
        p = p.next;
    }

    const curIndex = count - n + 1;
    const leftIndex = curIndex - 1;
    const rightIndex = curIndex + 1;
    const leftNode = map.get(leftIndex);
    const rightNode = map.get(rightIndex) || null;

    if (!leftNode) {
        return rightNode;
    }

    leftNode.next = rightNode;

    return head;
};
