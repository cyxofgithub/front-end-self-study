/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function (s) {
    // 遍历 0 - i 的字符串是否是回文，是的继续判断 i + 1 - s.length 的
    const ans = [];
    // 记忆减少重复计算
    const record = Array.from({ length: s.length }, () => []);

    // 是否为回文
    const isVaild = (l, r) => {
        if (record[l][r] !== undefined) return record[l][r];

        if (l >= r) {
            record[l][r] = true;
            return record[l][r];
        }

        if (s[l] !== s[r]) {
            record[l][r] = false;
            return record[l][r];
        }

        record[l][r] = isVaild(l + 1, r - 1);

        return record[l][r];
    };

    const path = [];

    const process = (l) => {
        // 因为走到最后还合法才会进入这里说明
        if (l === s.length) {
            ans.push([...path]);
            return;
        }

        for (let r = l; r < s.length; r++) {
            if (isVaild(l, r)) {
                path.push(s.slice(l, r + 1));
                process(r + 1);
                path.pop();
            }
        }
    };

    process(0);

    return ans;
};
