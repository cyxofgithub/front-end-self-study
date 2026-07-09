/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
    if (s.length < p.length) return [];

    const pCount = new Array(26).fill(0);
    const winCount = new Array(26).fill(0);
    let match = 0;
    const result = [];

    const getIndex = (char) => {
        return char.charCodeAt() - 'a'.charCodeAt();
    };

    // 滑动窗口字符串和p字符串是否是异位
    const isEqual = () => {
        return match === 26;
    };

    for (let i = 0; i < p.length; i++) {
        const winIndex = getIndex(s[i]);
        const pIndex = getIndex(p[i]);
        winCount[winIndex] += 1;
        pCount[pIndex] += 1;
    }

    winCount.forEach((val, index) => {
        if (val === pCount[index]) {
            match++;
        }
    });

    if (isEqual()) result.push(0);

    for (let l = 1; l < s.length - p.length + 1; l++) {
        const preIndex = getIndex(s[l - 1]);
        // 如果移除前一个之前相等那么移除后肯定就不相等 match--
        if (winCount[preIndex] === pCount[preIndex]) match--;
        winCount[preIndex] -= 1;
        // 移除后如果相等 match++
        if (winCount[preIndex] === pCount[preIndex]) match++;

        const nextIndex = getIndex(s[l + p.length - 1]);
        if (winCount[nextIndex] === pCount[nextIndex]) match--;
        winCount[nextIndex] += 1;
        if (winCount[nextIndex] === pCount[nextIndex]) match++;

        if (isEqual()) {
            result.push(l);
        }
    }

    return result;
};
