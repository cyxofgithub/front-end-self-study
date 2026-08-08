/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
// var exist = function (board, word) {
//     let row = board.length;
//     let col = board[0].length;
//     // 记录走过的路
//     const record = Array.from({ length: row }, () => []);

//     const process = (i, j, str) => {
//         if (str === word) return true;

//         record[i][j] = true;

//         const findWord = word[str.length];

//         let ans = false;

//         // 向上走
//         if (i > 0 && findWord === board[i - 1][j] && !record[i - 1][j]) {
//             ans = process(i - 1, j, str + board[i - 1][j]);
//         }

//         // 向下走
//         if (i < row - 1 && findWord === board[i + 1][j] && !record[i + 1][j]) {
//             ans ||= process(i + 1, j, str + board[i + 1][j]);
//         }

//         // 向左走
//         if (j > 0 && findWord === board[i][j - 1] && !record[i][j - 1]) {
//             ans ||= process(i, j - 1, str + board[i][j - 1]);
//         }

//         // 向右走
//         if (j < col - 1 && findWord === board[i][j + 1] && !record[i][j + 1]) {
//             ans ||= process(i, j + 1, str + board[i][j + 1]);
//         }

//         record[i][j] = false;

//         return ans;
//     };

//     for (let i = 0; i < row; i++) {
//         for (let j = 0; j < col; j++) {
//             // 1、找到起点
//             if (board[i][j] !== word[0]) continue;

//             // 2、从起点出发判断是否可以构成单词 word
//             if (process(i, j, board[i][j])) {
//                 return true;
//             }
//         }
//     }

//     return false;
// };

// 优化写法
// var exist = function (board, word) {
//     const row = board.length;
//     const col = board[0].length;
//     // 修复：初始化全false
//     const record = Array.from({ length: row }, () => Array(col).fill(false));

//     const process = (i, j, index) => {
//         // 全部字符匹配完成
//         if (index === word.length) return true;
//         // 越界 / 已走过 / 字符不匹配
//         if (
//             i < 0 ||
//             i >= row ||
//             j < 0 ||
//             j >= col ||
//             record[i][j] ||
//             board[i][j] !== word[index]
//         ) {
//             return false;
//         }

//         record[i][j] = true;

//         // 四个方向
//         const ok =
//             process(i - 1, j, index + 1) ||
//             process(i + 1, j, index + 1) ||
//             process(i, j - 1, index + 1) ||
//             process(i, j + 1, index + 1);

//         // 回溯撤销标记
//         record[i][j] = false;
//         return ok;
//     };

//     for (let i = 0; i < row; i++) {
//         for (let j = 0; j < col; j++) {
//             if (process(i, j, 0)) return true;
//         }
//     }
//     return false;
// };

// 进一步优化空间复杂度，不用 record 记录
var exist = function (board, word) {
    const m = board.length;
    const n = board[0].length;
    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    const dfs = (i, j, idx) => {
        if (idx === word.length) return true;
        if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[idx])
            return false;

        // 临时占位，标记已经访问
        const temp = board[i][j];
        board[i][j] = '#';

        const res = dirs.some(([dx, dy]) => dfs(i + dx, j + dy, idx + 1));
        // 回溯恢复原值
        board[i][j] = temp;
        return res;
    };

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) return true;
        }
    }
    return false;
};
