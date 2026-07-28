//给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串 的长度。

function getMaxLength(s) {
    const map = new Map();
    let max = 0;

    let l = 0;
    for (let i = 0; i < s.length; i++) {
        const r = i;

        // 注意l边界更新要大于上一个l
        // 不然 abba 计算到第二个a时 l 就成了 1，此时 l 应该是 2
        if (map.has(s[i]) && map.get(s[i]) + 1 > l) {
            l = map.get(s[i]) + 1;
        }

        map.set(s[i], i);

        max = Math.max(r - l + 1, max);
    }

    return max;
}

console.log(getMaxLength('abba'));
