/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict) {
    // dp[i] 代表 0 - i 子字符串是否满足拆分条件
    const dp = new Array(s.length + 1).fill(false);

    dp[0] = true;
    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordDict.includes(s.substr(j, i - j))) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[s.length];
};

console.log(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']));
