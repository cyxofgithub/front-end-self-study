// 方法一：从前往后遍历（不推荐）
function shuffleForward(arr) {
    const result = [...arr];
    for (let i = 0; i < result.length; i++) {
        // 从整个数组中选择一个随机索引
        const randomIndex = Math.floor(Math.random() * result.length);
        // 交换当前位置和随机位置
        [result[i], result[randomIndex]] = [result[result], result[randomIndex]];
    }
    return result;
}

// 方法二：从后往前遍历（推荐）
function shuffleBackward(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        // 从 0 到 i 之间选择一个随机索引（不包括已处理的部分）
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // 交换当前位置和随机位置
        [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
    }
    return result;
}

// 总结：从后往前时，每轮从 [0, i] 中选一个索引与 i 交换，之后 i 不再参与，从而避免重复选择已处理位置。这是 Fisher-Yates 洗牌算法的标准实现方式。
