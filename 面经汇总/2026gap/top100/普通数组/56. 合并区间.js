/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
// var merge = function (intervals) {
//     if (intervals.length <= 1) return intervals;

//     const result = [];
//     intervals.sort((a, b) => a[0] - b[0]);

//     for (let i = 0; i < intervals.length; i++) {
//         if (intervals[i][0] >= l && intervals[i][0] <= r) {
//             r = Math.max(intervals[i][1], r);
//         } else {
//             result.push([l, r]);
//             l = intervals[i][0];
//             r = intervals[i][1];
//         }
//     }

//     result.push([l, r]);

//     return result;
// };

var merge = function (intervals) {
    if (intervals.length <= 1) return intervals;

    intervals.sort((a, b) => a[0] - b[0]);
    const result = [intervals[0]];

    for (let i = 0; i < intervals.length; i++) {
        const pre = result[result.length - 1];
        const cur = intervals[i];

        if (cur[0] <= pre[1]) {
            pre[1] = Math.max(pre[1], cur[1]);
        } else {
            result.push(cur);
        }
    }

    return result;
};

console.log(
    merge([
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
    ])
);
