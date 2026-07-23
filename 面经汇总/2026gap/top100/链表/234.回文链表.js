/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
// 时间、空间复杂度o(n)
// var isPalindrome = function (head) {
//     if (!head || !head.next) return true;

//     let pre = null;
//     let p1 = head;
//     let p2 = head;

//     while (p1) {
//         p1.pre = pre;
//         pre = p1;

//         if (!p1.next) {
//             break;
//         }

//         p1 = p1.next;
//     }

//     while (p1 && p2) {
//         if (p1.val !== p2.val) return false;
//         p1 = p1.pre;
//         p2 = p2.next;
//     }

//     return true;
// };

// 快慢指针 空间复杂度o(1)
var isPalindrome = function (head) {
    if (!head || !head.next) return true;

    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    const reverse = (node) => {
        let pre = null;
        let cur = node;

        while (cur) {
            const next = cur.next;
            cur.next = pre;
            pre = cur;
            cur = next;
        }

        return pre;
    };

    let left = head;

    // 反转后半段
    let right = reverse(slow);

    // 左边和右边开始对比
    while (left && right) {
        if (left.val !== right.val) return false;
        left = left.next;
        right = right.next;
    }

    return true;
};
