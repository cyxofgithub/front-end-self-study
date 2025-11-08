/**
 * 思路：
 * 1、谁小谁移动
 * 2、相同的打印, 一起移动
 * 3、有一方越界，结束
 */

const { functions } = require('lodash');

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

const header1 = new Node(1);
header1.next = new Node(3);
header1.next.next = new Node(5);

const header2 = new Node(0);
header2.next = new Node(2);
header2.next.next = new Node(5);
header2.next.next.next = new Node(6);

function printCommon(header1, header2) {
    while (header1 && header2) {
        const val1 = header1.value;
        const val2 = header2.value;
        if (val1 === val2) {
            console.log(val1);
            header1 = header1.next;
            header2 = header2.next;
        } else if (val1 < val2) {
            header1 = header1.next;
        } else {
            header2 = header2.next;
        }
    }
}

printCommon(header1, header2);
