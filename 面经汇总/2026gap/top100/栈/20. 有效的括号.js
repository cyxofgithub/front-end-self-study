/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
    if (!s.length || s.length % 2 === 1) return false;

    const map = new Map([
        [')', '('],
        [']', '['],
        ['}', '{'],
    ]);

    const stack = [];

    for (let i = 0; i < s.length; i++) {
        if (map.has(s[i])) {
            const cur = stack.pop();
            if (map.get(s[i]) !== cur) return false;
        } else {
            stack.push(s[i]);
        }
    }

    return !stack.length;
};

console.log(isValid('(]'));
