/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function (matrix) {
    // 要置为0的行列
    const rowSet = new Set();
    const colSet = new Set();

    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[0].length; col++) {
            if (matrix[row][col] === 0) {
                rowSet.add(row);
                colSet.add(col);
            }
        }
    }

    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[0].length; col++) {
            if (rowSet.has(row) || colSet.has(col)) {
                matrix[row][col] = 0;
            }
        }
    }
};
