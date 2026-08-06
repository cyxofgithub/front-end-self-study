/**
 * @param {string} digits
 * @return {string[]}
 */
const map = {
    2: 'abc',
    3: 'def',
    4: 'ghi',
    5: 'jkl',
    6: 'mno',
    7: 'pqrs',
    8: 'tuv',
    9: 'wxyz',
};
var letterCombinations = function (digits) {
    const path = [];
    const ans = [];

    const process = (start = 0) => {
        if (path.length === digits.length) {
            return ans.push(path.join(''));
        }

        const button = digits[start];
        const chars = map[button];

        for (let i = 0; i < chars.length; i++) {
            path.push(chars[i]);
            process(start + 1);
            path.pop();
        }
    };

    process();

    return ans;
};

console.log(letterCombinations('23'));
