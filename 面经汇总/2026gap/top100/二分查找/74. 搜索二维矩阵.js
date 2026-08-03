/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
    const row = matrix.length;
    const col = matrix[0].length;

    let l = 0;
    let r = row * col - 1;

    while (l <= r) {
        const mid = Math.floor((r - l) / 2 + l); // 相当于 Math.floor((l + r) / 2) 可以防止整数太大溢出
        const rIdx = Math.floor(mid / col);
        const cIdx = mid % col;
        const cur = matrix[rIdx][cIdx];
        if (cur === target) {
            return true;
        } else if (cur < target) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    return false;
};
