class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

const header1 = new Node(1);
header1.next = new Node(3);
header1.next.next = new Node(5);
header1.next.next.next = new Node(2);
header1.next.next.next.next = new Node(1);
header1.next.next.next.next.next = new Node(7);

function splitValue(baseVal, head) {
    if (!head || !head.next) return head;

    let smallStart = null;
    let smallEnd = null;
    let equalStart = null;
    let equalEnd = null;
    let bigStart = null;
    let bigEnd = null;

    let p = head;

    const helper = (start, end, p) => {
        if (!start) {
            start = p;
            end = p;
        } else {
            end.next = p;
            end = p;
        }

        return { start, end };
    };

    while (p) {
        const next = p.next;

        if (p.value > baseVal) {
            const { start, end } = helper(bigStart, bigEnd, p);
            bigStart = start;
            bigEnd = end;
        } else if (p.value < baseVal) {
            const { start, end } = helper(smallStart, smallEnd, p);
            smallStart = start;
            smallEnd = end;
        } else {
            const { start, end } = helper(equalStart, equalEnd, p);
            equalStart = start;
            equalEnd = end;
        }

        p = next;
    }

    smallEnd.next = equalStart;
    equalEnd.next = bigStart;
    bigEnd.next = null;

    console.log(smallStart);
}

splitValue(2, header1);
