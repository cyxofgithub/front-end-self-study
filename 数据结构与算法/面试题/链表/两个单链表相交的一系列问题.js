// const header1 = new Node(1);
// const node2 = new Node(2);
// const node3 = new Node(3);
// const node4 = new Node(4);
// const node5 = new Node(5);
// header1.next = node2;
// node2.next = node3;
// node3.next = node4;
// node4.next = node5;
// const header2 = new Node(2);
// header2.next = node3;

// 问题2：两个无环列表的相交，求第一个相交点
// 思路：先遍历列表获取两个列表的长度和 end 节点
// 如果 end 节点不一样说明根本没有相交节点，一致说明有相交节点，
// 将长度相减，让长链表从相减的值开始走，短链表从起始点开始走，走到一起的时候就是相交的点了
const getListInfo = list => {
    let count = 0;
    let p = list;
    let end = list;

    while (p) {
        count++;
        p = p.next;
        end = p ? p : end;
    }

    return { length: count, end };
};

const getCommonPoint = (list1, list2) => {
    if (!list1 || !list2) return null;

    const { length: length1, end: end1 } = getListInfo(list1);
    const { length: length2, end: end2 } = getListInfo(list2);

    if (end1 !== end2) return null;

    let count = Math.abs(length1 - length2);
    let longList = length1 > length2 ? list1 : list2; // 获取较长链表
    let shortList = length1 > length2 ? list2 : list1; // 获取短链表
    let p1 = longList;
    let p2 = shortList;

    while (count) {
        p1 = p1.next;
        count--;
    }

    while (p1 !== p2) {
        p1 = p1.next;
        p2 = p2.next;
    }

    return p1;
};

// console.log(getCommonPoint(header1, header2));

// 问题3：两个有环列表的求第一个相交点
// 思路：如果两个链表的环入口节点相同说明是有相交
// 如果两个链表的环入口不相同，让记录环1的点，然后让一个指针一直往下走
// 如果遇到了环2的点说明环1的点就是第一个相交点
const header1 = new Node(1);
const node2 = new Node(2);
const node3 = new Node(3);
const node4 = new Node(4);
const node5 = new Node(5);
header1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node5;
node5.next = node3;

const header2 = new Node(2);
header2.next = node3;

function getFirstCommmonPoint(list1, list2) {
    if (!list1 || !list2) return null;

    const entry1 = getCircleEntry2(list1);
    const entry2 = getCircleEntry2(list2);

    // 处理了两个无环不相交：两个都为 null
    // 入口相同相交
    if (entry1 === entry2) {
        return getCommonPoint(entry1, entry2);
    } else {
        // 环入口不同不相交
        // 环入口相同相交
        let p = entry1.next;

        while (p !== entry2) {
            if (p === entry1) {
                return null;
            }

            p = p.next;
        }

        return entry1;
    }
}

console.log(getCircleEntry2(header2));
