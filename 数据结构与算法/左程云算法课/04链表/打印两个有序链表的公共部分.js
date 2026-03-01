/**
 * 思路：
 * 1、谁小谁移动
 * 2、相同的打印, 一起移动
 * 3、有一方越界，结束
 */

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

const header1 = new Node(1);
header1.next = new Node(3);
header1.next.next = new Node(5);

const header2 = new Node(1);
header2.next = new Node(2);
header2.next.next = new Node(5);
header2.next.next.next = new Node(6);

function printCommonPart(header1, header2) {
    while (header1 && header2) {
        if (header1.value < header2.value) {
            header1 = header1.next;
        } else if (header1.value > header2.value) {
            header2 = header2.next;
        } else {
            console.log(header1.value);
            header1 = header1.next;
            header2 = header2.next;
        }
    }
}

printCommonPart(header1, header2);
