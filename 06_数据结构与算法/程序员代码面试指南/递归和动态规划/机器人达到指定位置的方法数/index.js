class WayNum {
    static exec(N, M, K, P) {
        let dp = new Array(N + 1).fill(0);
        dp[M] = 1;

        for (let rest = 1; rest <= K; rest++) {
            let leftUp = dp[1]; // 记录左上角的值
            for (let cur = 1; cur <= N; cur++) {
                const temp = dp[cur];
                if (cur === 1) {
                    dp[cur] = dp[cur + 1];
                } else if (cur === N) {
                    dp[cur] = leftUp;
                } else {
                    dp[cur] = leftUp + dp[cur + 1];
                }
                leftUp = temp;
            }
        }

        return dp[P];
    }
}

console.log(WayNum.exec(5, 2, 3, 3));
