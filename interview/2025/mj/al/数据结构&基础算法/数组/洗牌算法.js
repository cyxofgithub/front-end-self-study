// 洗牌算法思路：从后往前逐个确定元素位置，每一步都保证 “当前未确定位置的元素被选到当前位置的概率均等”，最终所有排列的概率都是 1/n!；
/**
 * Fisher-Yates 洗牌算法：公平地打乱数组
 * @param {Array} arr - 需要乱序的数组
 * @returns {Array} 乱序后的新数组（不修改原数组）
 */
function shuffleArray(arr) {
    // 先创建原数组的副本，避免修改原数组
    const newArr = [...arr];
    // 从最后一个元素开始向前遍历
    for (let i = newArr.length - 1; i > 0; i--) {
        // 生成 0 到 i（包含 i）之间的随机索引
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // 交换当前元素和随机索引的元素
        [newArr[i], newArr[randomIndex]] = [newArr[randomIndex], newArr[i]];
    }
    return newArr;
}

// 测试示例
const originalArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const shuffledArr = shuffleArray(originalArr);

console.log('原数组：', originalArr); // 原数组保持不变：[1,2,3,4,5,6,7,8,9]
console.log('乱序后数组：', shuffledArr); // 每次运行结果不同，比如 [5,1,9,3,7,2,8,4,6]
