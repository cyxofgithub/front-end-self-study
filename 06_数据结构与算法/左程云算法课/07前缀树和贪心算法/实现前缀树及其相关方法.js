class TrieNode {
    constructor() {
        this.pass = 0;
        this.end = 0;
        this.nexts = new Map();
    }
}
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    // 插入字符串
    insert(word) {
        if (!word) return;

        const arr = word.split('');
        let cur = this.root;
        cur.pass++;

        for (let i = 0; i < arr.length; i++) {
            const next = cur.nexts.get(arr[i]);
            if (!next) {
                cur.nexts.set(arr[i], new TrieNode());
            }
            cur = cur.nexts.get(arr[i]);
            cur.pass++;
        }
        cur.end++;
    }

    // 搜索以某个字符串为前缀的数量
    prefixNumber(pre) {
        if (!pre) return 0;

        const arr = pre.split('');
        let cur = this.root;

        for (let i = 0; i < arr.length; i++) {
            const next = cur.nexts.get(arr[i]);
            if (!next) return 0;
            cur = next;
        }
        return cur.pass;
    }

    // 搜索某个字符串在前缀树中出现的次数
    search(word) {
        if (!word) return 0;

        const arr = word.split('');

        let cur = this.root;

        for (let i = 0; i < arr.length; i++) {
            const next = cur.nexts.get(arr[i]);

            if (!next) return 0;

            cur = next;
        }

        return cur.end;
    }

    // 删除某个字符串
    delete(word) {
        if (!this.search(word)) return;

        const arr = word.split('');

        let cur = this.root;
        cur.pass--;
        for (let i = 0; i < arr.length; i++) {
            const next = cur.nexts.get(arr[i]);
            next.pass--;
            cur = next;
        }
        cur.end--;
    }
}

const trieTree = new Trie();

trieTree.insert('asd');
trieTree.insert('asd');
trieTree.insert('asdasdasd');
trieTree.insert('abd');

console.log(trieTree.prefixNumber('ggg'));
console.log(trieTree.search('asd'));
trieTree.delete('asd');
