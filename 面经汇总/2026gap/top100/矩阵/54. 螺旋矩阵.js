/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
// var spiralOrder = function (matrix) {
//     const ans = [];

//     const row = matrix.length;
//     const col = matrix[0].length;

//     let r = 0;
//     let c = 0;
//     ans.push(matrix[r][c]);
//     matrix[r][c] = '#';

//     while (ans.length !== row * col) {
//         // 右下左上的顺序走

//         while (c < col - 1 && matrix[r][c + 1] !== '#') {
//             // 右
//             c++;
//             ans.push(matrix[r][c]);
//             matrix[r][c] = '#';
//         }

//         while (r < row - 1 && matrix[r + 1][c] !== '#') {
//             // 下
//             r++;
//             ans.push(matrix[r][c]);
//             matrix[r][c] = '#';
//         }

//         while (c > 0 && matrix[r][c - 1] !== '#') {
//             // 左
//             c--;
//             ans.push(matrix[r][c]);
//             matrix[r][c] = '#';
//         }

//         while (r > 0 && matrix[r - 1][c] !== '#') {
//             // 上
//             r--;
//             ans.push(matrix[r][c]);
//             matrix[r][c] = '#';
//         }
//     }

//     return ans;
// };

var spiralOrder = function (matrix) {
    const ans = [];

    const row = matrix.length;
    const col = matrix[0].length;

    const direction = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ];

    let r = 0;
    let c = 0;
    ans.push(matrix[r][c]);
    matrix[r][c] = '#';

    while (ans.length < row * col) {
        for (const dir of direction) {
            const [rIndex, cIndex] = dir;
            while (
                r + rIndex >= 0 &&
                r + rIndex < row &&
                c + cIndex >= 0 &&
                c + cIndex < col &&
                matrix[r + rIndex][c + cIndex] !== '#'
            ) {
                r += rIndex;
                c += cIndex;
                ans.push(matrix[r][c]);
                matrix[r][c] = '#';
            }
        }
    }

    return ans;
};

console.log(
    spiralOrder([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
        [17, 18, 19, 20],
        [21, 22, 23, 24],
    ])
);
