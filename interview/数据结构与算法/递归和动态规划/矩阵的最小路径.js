// ## 题目

// 给定一个矩阵 m，从左上角开始每次只能向右或者向下走，最后到达右下角的位置，路径上所有的数字累加起来就是路径和，返回所有的路径中最小的路径和。

// ## 思路

// 如果每个位置都知道它的左边的路径和和上边的路径和，那边走到它最近的位置就是和小的那条

class minPath {
    // 动态规划简单解法
    // 时间复杂度：O（M×N） 空间复杂度：O（MxN）
    static exec(matrix) {
        const col = matrix.length;
        const row = matrix[0].length;
        const dp = Array.from({ length: matrix.length }, () => []);

        for (let i = 1; i < col; i++) {
            dp[i][0] = matrix[i][0] + matrix[i - 1][0];
        }

        for (let j = 1; j < row; j++) {
            dp[0][j] = matrix[0][j] + matrix[0][j - 1];
        }

        for (let i = 1; i < col; i++) {
            for (let j = 1; j < row; j++) {
                dp[i][j] = matrix[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
            }
        }

        return dp[col - 1][row - 1];
    }

    // 动态规划优化解法
    // 时间复杂度：O（M×N） 空间复杂度：O（M）
    // 思路：1、先确定第一行的最小路径，再确认第二行，第三行...直到最后一行就可以确认结果
    static exec2(matrix) {
        const row = matrix.length;
        const col = matrix[0].length;
        const dp = Array.from({ length: col }, () => 0);

        dp[0] = matrix[0][0];
        for (let i = 1; i < col; i++) {
            dp[i] = matrix[0][i] + dp[i - 1];
        }

        for (let i = 1; i < row; i++) {
            dp[0] += matrix[i][0];
            for (let j = 1; j < col; j++) {
                dp[j] = matrix[i][j] + Math.min(dp[j - 1], dp[j]);
            }
        }

        return dp[col - 1];
    }

    // 暴力解1
    static exec3(matrix) {
        const row = matrix.length;
        const col = matrix[0].length;

        // 问题拆解为从某个点到最后一个点到距离
        const res = this.process3(matrix, row, col, 0, 0);

        return res;
    }

    static process3(matrix, row, col, i, j) {
        if (i === row - 1 && j === col - 1) {
            return matrix[i][j];
        }

        if (i === row - 1) {
            return matrix[i][j] + this.process3(matrix, row, col, i, j + 1);
        }

        if (j === row - 1) {
            return matrix[i][j] + this.process3(matrix, row, col, i + 1, j);
        }

        return (
            matrix[i][j] +
            Math.min(this.process3(matrix, row, col, i, j + 1), this.process3(matrix, row, col, i + 1, j))
        );
    }

    static res = Number.MAX_VALUE;
    // 暴力解：遍历所有路径，记录最小的结果
    static exec4(matrix) {
        this.process4(matrix, 0, 0, 0);

        return this.res;
    }

    static process4(matrix, i, j, sum) {
        const row = matrix.length;
        const col = matrix[0].length;
        sum += matrix[i][j];

        if (i === row - 1 && j === col - 1) {
            this.res = Math.min(sum, this.res);
            return;
        }

        if (i === row - 1) {
            return this.process4(matrix, i, j + 1, sum);
        }

        if (j === col - 1) {
            return this.process4(matrix, i + 1, j, sum);
        }

        this.process4(matrix, i, j + 1, sum);
        this.process4(matrix, i + 1, j, sum);
    }
}

const matrix = [
    [1, 3, 5, 9],
    [8, 1, 3, 4],
    [5, 0, 6, 1],
    [8, 8, 4, 0],
];

console.log(minPath.exec(matrix));
console.log(minPath.exec2(matrix));
console.log(minPath.exec3(matrix));
console.log(minPath.exec4(matrix));
