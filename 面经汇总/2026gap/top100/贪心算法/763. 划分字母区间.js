/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function (s) {
    const sIndexMap = new Map();

    for (let i = 0; i < s.length; i++) {
        sIndexMap.set(s[i], i);
    }

    const ans = [];
    let start = 0;
    let end = 0;

    for (let i = 0; i < s.length; i++) {
        // 不断更新字母最后一次出现的位置
        end = Math.max(sIndexMap.get(s[i]), end);

        // 最后出现的位置就是当前位置 说明是分割点 记录下来
        if (end === i) {
            ans.push(end - start + 1);
            start = end + 1;
        }
    }

    return ans;
};
