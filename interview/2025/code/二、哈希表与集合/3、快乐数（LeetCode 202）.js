// 问题：判断一个数是否为快乐数（不断平方求和，最终是否为 1）。
// 举几个例子帮你理解：
// 例 1：19 是快乐数
// 步骤分解：
// 19 的每个数字平方和：1² + 9² = 1 + 81 = 82
// 82 的每个数字平方和：8² + 2² = 64 + 4 = 68
// 68 的每个数字平方和：6² + 8² = 36 + 64 = 100
// 100 的每个数字平方和：1² + 0² + 0² = 1 + 0 + 0 = 1
// （得到 1，循环结束，所以 19 是快乐数）
// 例 2：4 不是快乐数
// 步骤分解：
// 4 → 4² = 16
// 16 → 1² + 6² = 1 + 36 = 37
// 37 → 3² + 7² = 9 + 49 = 58
// 58 → 5² + 8² = 25 + 64 = 89
// 89 → 8² + 9² = 64 + 81 = 145
// 145 → 1² + 4² + 5² = 1 + 16 + 25 = 42
// 42 → 4² + 2² = 16 + 4 = 20
// 20 → 2² + 0² = 4 + 0 = 4
// （又回到 4，进入无限循环，永远得不到 1，所以 4 不是快乐数） 

function isHappyNum(num) {
    const set = new Set();

    const traverse = (target, set) => {
        if (set.has(target)) return false;

        let temp = target;
        let result = 0;

        while(temp) {
            result += (temp % 10 ) * (temp % 10);
            temp = Math.floor(temp / 10);
        }

        if (result === 1) return true;

        set.add(target);
        return traverse(result, set);
    }

    return traverse(num, set);
}

console.log(isHappyNum(82));

// 写法2不用递归
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappyNum2 = function(n) {
    // 哈希表记录已出现的数字，检测是否进入循环
    const seen = new Set();
    
    // 循环直到n为1（快乐数）或出现重复数字（非快乐数）
    while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        // 计算当前数字的每位平方和
        n = getNext(n);
    }
    
    // 如果最终n为1，说明是快乐数
    return n === 1;
};

// 辅助函数：计算数字的每位平方和
function getNext(num) {
    let sum = 0;
    while (num > 0) {
        const digit = num % 10; // 取最后一位数字
        sum += digit * digit;   // 平方后累加
        num = Math.floor(num / 10); // 移除最后一位
    }
    return sum;
}

console.log(isHappyNum2(82));

