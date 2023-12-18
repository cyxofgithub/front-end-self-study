class NQueen {
    exec(n) {
        if (n <= 1) return n;
        const record = Array.from({ length: n });

        return this.process(n, 0, record);
    }

    process(n, row, record) {
        if (n === row) return 1;
        let res = 0;
        for (let i = 0; i < n; i++) {
            if (this.isVaild(record, row, i)) {
                record[row] = i;
                res += this.process(n, row + 1, record);
            }
        }

        return res;
    }

    isVaild(record, row, col) {
        for (let i = 0; i < row; i++) {
            if (
                record[i] === col ||
                Math.abs(record[i] - col) === Math.abs(i - row)
            ) {
                return false;
            }
        }
        return true;
    }
}

const nQueen = new NQueen();

console.log(nQueen.exec(8));
