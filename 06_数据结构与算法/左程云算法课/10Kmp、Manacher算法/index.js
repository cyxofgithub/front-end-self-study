class KMP {
    // 还需要调整，现在还是错的
    static exec(str1, str2) {
        const next = this.getNext(str2);

        let i = 0;
        let j = 0;

        while (i < str1.length && j < str2.length) {
            if (str1[i] === str2[j]) {
                i++;
                j++;
            } else if (str1[i] !== str2[j]) {
                j = next[j];
            } else if (j === str2.length - 1) {
                return i - str2.length - 1;
            }
        }
        return -1;
    }

    static getNext(pattern) {
        const next = [0, 0];
        let i = 2,
            j = next[i - 1];
        while (i < pattern.length) {
            // 如 abcdabcd 求 7 位置的值
            // 如果 pattern[7 - 1] === pattern[next[7-1]](前缀子串的下一位)
            // 那么 next[7] = next[6] + 1;
            if (pattern[i - 1] === pattern[j]) {
                next[i] = j + 1;
                i++; // 继续计算 next 的下一位
                j++;
            } else if (j > 0) {
                // 没匹配上用上一个子串来尝试匹配
                j = next[j];
            } else {
                // 无子串可配了只能是0
                next[i] = 0;

                // 继续计算 next 的下一位
                i++;
            }
        }

        return next;
    }
}

const str1 = 'abcabcd';

const str2 = 'efg';

console.log(KMP.getNext(str1));
