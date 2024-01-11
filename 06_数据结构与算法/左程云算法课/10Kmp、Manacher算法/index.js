class KMP {
    static exec(str1, str2) {
        if (str1.length < str2.lengt) return -1;

        const next = this.getNext(str2);
        console.log('🚀 ~ KMP ~ exec ~ next:', next);
        let i = 0;
        let j = 0;

        while (i < str1.length && j < str2.length) {
            if (str1[i] === str2[j]) {
                i++;
                j++;
            } else if (next[j] === -1) {
                i++;
            } else {
                j = next[j];
            }
        }

        return j === str2.length ? i - j : -1;
    }

    static getNext(str) {
        const next = [-1, 0];
        let i = 2;
        let j = next[i - 1];

        while (i < str2.length) {
            if (str[j] === str[i - 1]) {
                next[i] = j + 1;
                i++;
                j++;
            } else if (j > 0) {
                j = next[j];
            } else {
                next[i] = 0;
                i++;
            }
        }

        return next;
    }
}

const str1 = 'abncscacafcacasd';
const str2 = 'cacasd';

console.log(KMP.exec(str1, str2));
