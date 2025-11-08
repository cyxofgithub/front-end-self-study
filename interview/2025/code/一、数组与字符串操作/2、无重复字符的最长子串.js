// 问题：求字符串中最长无重复字符的子串长度。

// 暴力解
function maxLen1(chars) {
    let max = 1;
    for (let i = 0; i < chars.length; i++) {
        const set = new Set();
        for (let j = i; j < chars.length; j++) {
            if (set.has(chars[j])) {
                break;
            }

            set.add(chars[j]);
            max = Math.max(max, j - i + 1);
        }
    }

    console.log(max);
}

// 滑动窗口
function maxLen2(chars) {
    let left = 0;
    let right = 0;

    let max = 1;
    const set = new Set();
    while (left <= right && right < chars.length) {
        if (set.has(chars[right])) {
            left = right;
            set.clear();
        } else {
            set.add(chars[right]);
            right++;
            max = Math.max(max, right - left);
        }
    }

    console.log(max);
}

// 滑动窗口方式2
function maxLen3(s) {
    const map = new Map(); // 存储字符最后出现的索引
    let maxLen = 0;
    let left = 0; // 窗口左边界

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        // 若字符已存在且索引在当前窗口内（>= left），则移动左边界到重复位置的下一位
        if (map.has(char) && map.get(char) >= left) {
            left = map.get(char) + 1;
        }
        // 更新字符最后出现的索引
        map.set(char, right);
        // 计算当前窗口长度并更新最大值
        maxLen = Math.max(maxLen, right - left + 1);
    }

    console.log(maxLen);
}

maxLen1('bba');
maxLen2('bba');
maxLen3('bba');
