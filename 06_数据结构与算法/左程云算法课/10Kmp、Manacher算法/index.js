class KMP {
    exec(str1, str2) {
        const next = this.getNext(str2);

        let i = 0;
        let j = 0;

        while (i < str1.length && j < str2.length) {
            if (str1[i] === str2[j]) {
                i++;
                j++;
            } else if (str1[i] !== str2[j]) {
                i++;
                j = j - next[j];
            } else if (j === str2.length - 1) {
                return i - str2.length - 1;
            }
        }
        return -1;
    }

    getNext(str, i, res) {
        let res = [];

        if (i <= 1) {
            res[i] = 0;
        } else if (i > 1) {
            let left = 0;
            let right = i;
            let length = 0;
            while (left < right) {
                if (str[left] === str[right]) {
                    length++;
                    left++;
                    right++;
                } else {
                    break;
                }
            }

            res[i] = length;
        }

        return res;
    }
}

const str1 = 'abcdefga';
const str2 = 'efg';

function getNext(pattern) {
    const next = [0];
    let i = 0,
        j = 1; // 可以把i看成前缀的开始位置，j看成后缀的开始位置，从大的子字符串比对到小的

    while (j < pattern.length) {
        if (pattern[i] === pattern[j]) {
            next[j] = i + 1;
            i++;
            j++;
        } else if (i > 0) {
            i = next[i - 1];
        } else {
            next[j] = 0;
            j++;
        }
    }

    return next;
}
