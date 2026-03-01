class LandNum {
    static exec(matrix) {
        const col = matrix.length;
        const row = matrix[0].length;

        let res = 0;
        for (let i = 0; i < col; i++) {
            for (let j = 0; j < row; j++) {
                if (matrix[i][j] === 1) {
                    this.infect(matrix, i, j);
                    res++;
                }
            }
        }

        return res;
    }

    static infect(matrix, curCol, curRow) {
        const col = matrix.length;
        const row = matrix[0].length;

        if (curCol < 0 || curRow < 0 || curCol >= col || curRow >= row) {
            return;
        }

        if (matrix[curCol][curRow] === 1) {
            matrix[curCol][curRow] = 2;

            this.infect(matrix, curCol - 1, curRow);
            this.infect(matrix, curCol + 1, curRow);
            this.infect(matrix, curCol, curRow - 1);
            this.infect(matrix, curCol, curRow + 1);
        }
    }
}

const matrix = [
    [0, 0, 1, 0, 1, 0],
    [1, 1, 1, 0, 1, 0],
    [1, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0],
];

console.log(LandNum.exec(matrix));
