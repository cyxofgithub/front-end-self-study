function ListNode(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
}

/**
 * 从数组构建链表
 * @param {number[]} arr
 * @return {ListNode}
 */
function buildList(arr) {
    const dummy = new ListNode();
    let cur = dummy;
    for (const v of arr) {
        cur.next = new ListNode(v);
        cur = cur.next;
    }
    return dummy.next;
}

/**
 * 将链表转为数组
 * @param {ListNode} head
 * @return {number[]}
 */
function toArray(head) {
    const result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

export { ListNode, buildList, toArray };