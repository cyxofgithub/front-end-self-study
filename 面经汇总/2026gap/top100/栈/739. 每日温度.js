/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
// var dailyTemperatures = function (temperatures) {
//     const ans = [];
//     const len = temperatures.length;
//     for (let i = 0; i < len; i++) {
//         let days = 0;
//         for (let j = i + 1; j < len; j++) {
//             days++;
//             if (temperatures[j] > temperatures[i]) {
//                 ans.push(days);
//                 break;
//             }
//         }
//         // 内层循环走完没break说明没有更高温度，填0
//         if (ans.length === i) ans.push(0);
//     }
//     return ans;
// };
var dailyTemperatures = function (temperatures) {
    const stack = [];
    const res = new Array(temperatures.length).fill(0);

    for (let i = 0; i < temperatures.length; i++) {
        while (
            stack.length &&
            temperatures[i] > temperatures[stack[stack.length - 1]]
        ) {
            const idx = stack.pop();
            res[idx] = i - idx;
        }

        stack.push(i);
    }

    return res;
};

console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
