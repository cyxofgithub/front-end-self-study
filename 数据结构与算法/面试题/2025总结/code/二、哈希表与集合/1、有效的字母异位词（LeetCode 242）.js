// 1. 修正后的哈希表解法（单哈希表版本）
function isAnagram1(s, t) {
    if (s.length !== t.length) return false;
    
    const countMap = new Map();
    
    // 先统计第一个字符串的字符频率
    for (const char of s) {
        countMap.set(char, (countMap.get(char) || 0) + 1);
    }
    
    // 再减去第二个字符串的字符频率
    for (const char of t) {
        // 如果字符不存在或数量不足，直接返回false
        if (!countMap.has(char) || countMap.get(char) === 0) {
            return false;
        }
        countMap.set(char, countMap.get(char) - 1);
    }
    
    return true;
}

// 2. 数组计数法（适合字符集较小的情况，如仅小写字母）
function isAnagram2(s, t) {
    if (s.length !== t.length) return false;
    
    // 假设只包含26个小写字母
    const counts = new Array(26).fill(0);
    const base = 'a'.charCodeAt(0);
    
    for (let i = 0; i < s.length; i++) {
        counts[s.charCodeAt(i) - base]++;
        counts[t.charCodeAt(i) - base]--;
    }
    
    // 检查是否所有计数都为0
    return counts.every(count => count === 0);
}

// 3. 排序比较法（代码最简洁）
function isAnagram3(s, t) {
    if (s.length !== t.length) return false;
    
    // 转换为数组排序后再比较字符串
    return s.split('').sort().join('') === t.split('').sort().join('');
}

// 测试
console.log(isAnagram1('abcdd', 'ddbca')); // true
console.log(isAnagram2('abcdd', 'ddbca')); // true
console.log(isAnagram3('abcdd', 'ddbca')); // true
console.log(isAnagram1('abc', 'def'));     // false
