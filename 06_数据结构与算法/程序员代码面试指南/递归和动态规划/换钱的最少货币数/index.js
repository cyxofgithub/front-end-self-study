// 解法2-不理解
class ExchangeMoney {
    static exec(arr, aim) {
        if (arr === null || !arr.length || aim < 0) return -1;

        const N = arr.length;
        const dp = Array.from({ length: N + 1 }, () => new Array(aim + 1));

        // 设置最后一排的值，除了 dp[N][0] 为 0 外，其他都是 -1
        for (let col = 1; col <= aim; col++) {
            dp[N][col] = -1;
        }

        // 从底往上计算每一行
        for (let i = N - 1; i >= 0; i--) {
            // 每一行都从左往右
            for (let rest = 0; rest <= aim; rest++) {
                dp[i][rest] = -1; // 初始时先设置 dp[i][rest] 的值无效

                // 下面的值如果有效
                if (dp[i + 1][rest] !== -1) {
                    dp[i][rest] = dp[i + 1][rest]; // 先设置成下面的值
                }

                // 如果左边的位置不越界且有效
                if (rest - arr[i] >= 0 && dp[i][rest - arr[i]] !== -1) {
                    // 如果之前下面的值无效
                    if (dp[i][rest] === -1) {
                        dp[i][rest] = dp[i][rest - arr[i]] + 1;
                    } else {
                        dp[i][rest] = Math.min(
                            dp[i][rest],
                            dp[i][rest - arr[i]] + 1
                        );
                    }
                }
            }
        }

        return dp[0][aim];
    }
}

console.log(ExchangeMoney.exec([5, 3], 20));
