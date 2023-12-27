class WayNum {
    static exec(N, M, K, P) {
        const row = K + 1;
        const col = N + 1;
        const dep = Array.from({ length: row }, () => new Array(col).fill(0));
        dep[0][P] = 1; // 此时的位置在 p 剩余步数为 0，则只有一种方法到达 P，那就是原地不动

        // dep[rest][cur] 表示当前剩余rest步在cur位置，有多少种方法可以到达 P
        // 两个都从 1 开始方便状态转换，下面有 cur -1 和 rest - 1 的操作
        for (let rest = 1; rest <= K; rest++) {
            for (let cur = 1; cur <= N; cur++) {
                if (cur === 1) {
                    dep[rest][cur] = dep[rest - 1][cur + 1];
                } else if (cur === N) {
                    dep[rest][cur] = dep[rest - 1][cur - 1];
                } else {
                    dep[rest][cur] =
                        dep[rest - 1][cur - 1] + dep[rest - 1][cur + 1];
                }
            }
        }

        return dep[K][M];
    }
}

console.log(WayNum.exec(5, 2, 3, 3));
