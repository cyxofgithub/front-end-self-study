/**
 * @param {number} numRows
 * @return {number[][]}
 */
// var generate = function (numRows) {
//     if (numRows < 1) return [];

//     const res = [];
//     for (let i = 0; i < numRows; i++) {
//         const cur = [];
//         const last = res[i - 1] || [];
//         for (let j = 0; j <= last.length; j++) {
//             cur[j] = (last[j] || 0) + (last[j - 1] || 0) || 1;
//         }
//         res.push(cur);
//     }

//     return res;
// };
var generate = function (numRows) {
    const ret = [];

    for (let i = 0; i < numRows; i++) {
        const row = new Array(i + 1).fill(1);
        for (let j = 1; j < row.length - 1; j++) {
            row[j] = ret[i - 1][j - 1] + ret[i - 1][j];
        }
        ret.push(row);
    }
    return ret;
};

console.log(generate(5));
