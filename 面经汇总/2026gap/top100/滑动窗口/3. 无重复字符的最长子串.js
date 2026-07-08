/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    const map = new Map();
    let l = 0,
        max = 0;

    for (let r = 0; r < s.length; r++) {
        const char = s[r];

        // 左指针遇到重复字符向前走
        if (map.has(char) && map.get(char) >= l) {
            l = map.get(char) + 1;
        }

        map.set(char, r);
        max = Math.max(max, r - l + 1);
    }

    return max;
};

console.log(lengthOfLongestSubstring('abcabcbb'));
