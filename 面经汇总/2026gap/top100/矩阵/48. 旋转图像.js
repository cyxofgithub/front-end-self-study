/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
    const r = matrix.length;
    const c = matrix[0].length;
    const ans = Array.from({ length: r }, () => new Array(c));

    for (let i = 0; i < c; i++) {
        for (let j = r - 1; j >= 0; j--) {
            ans[i][-(j - r + 1)] = matrix[j][i];
        }
    }

    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            matrix[i][j] = ans[i][j];
        }
    }
};
