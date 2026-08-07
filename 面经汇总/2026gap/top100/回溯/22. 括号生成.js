/**
 * @param {number} n
 * @return {string[]}
 */
// var generateParenthesis = function (n) {
//     const ans = [];

//     const process = (l, r, path) => {
//         if (l === r && l === n) {
//             ans.push(path.join(''));
//             return;
//         }
//         if (l < n) {
//             path.push('(');
//             process(l + 1, r, path);
//             path.pop();
//         }

//         if (r < l) {
//             path.push(')');
//             process(l, r + 1, path);
//             path.pop();
//         }
//     };

//     process(0, 0, []);

//     return ans;
// };

var generateParenthesis = function (n) {
    const ans = [];

    const process = (l, r, str) => {
        if (l === r && l === n) {
            ans.push(str);
            return;
        }
        if (l < n) {
            process(l + 1, r, str + '(');
        }

        if (r < l) {
            process(l, r + 1, str + ')');
        }
    };

    process(0, 0, '');

    return ans;
};
