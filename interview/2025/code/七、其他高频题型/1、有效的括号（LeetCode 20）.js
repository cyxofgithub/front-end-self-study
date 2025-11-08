// 问题：判断括号字符串是否有效。
// 解法：栈匹配，左括号入栈，右括号出栈比较。
// 扩展：生成有效括号（LeetCode 22）。
function getEffectiveSymbol(chars = '') {
    const charMap = {
        '{': '}',
        '[': ']',
        '(': ')',
    };
    const stack = [];
    for (const char of chars) {
        // 左括号
        if (charMap[char]) {
            stack.push(char);
        } else {
            // 右括号
            // 没有可匹配的
            if (!stack.length) return false;
            const top = stack.pop();
            // 匹配不上
            if (char !== charMap[top]) return false;
        }
    }

    return true;
}

console.log(getEffectiveSymbol('[{}{}]'));

// LeetCode 22 题「生成有效括号」的问题描述是：给定一个整数 n，生成所有由 n 对括号组成的有效括号组合。
// 核心要求：
// 有效括号组合需满足两个条件：
// 左括号 ( 和右括号 ) 的数量均为 n；
// 任意前缀中，左括号的数量 大于等于 右括号的数量（避免出现 )( 这种无效情况）。
// 示例说明：
// 示例 1：n = 1
// 此时只有 1 对括号，有效组合唯一：
// javascript
// 运行
// ["()"]
// 示例 2：n = 2
// 需要 2 对括号，有效组合有 2 种：
// javascript
// 运行
// ["(())", "()()"]
// (())：内层嵌套一对括号；
// ()()：两对等号括号并列。
// 示例 3：n = 3
// 需要 3 对括号，有效组合有 5 种：
// javascript
// 运行
// ["((()))", "(()())", "(())()", "()(())", "()()()"]
// ((()))：三层嵌套；
// (()())：外层一对，中间嵌套一对，右侧单独一对；
// (())()：外层一对嵌套一对，右侧单独一对；
// ()(())：左侧单独一对，右侧嵌套一对；
// ()()()：三对并列。
function genarateParentheses(n) {
    const result = [];

    const traverse = (current, left, right) => {
        if (current.length === 2 * n) return result.push(current);

        if (left < n) {
            traverse(current + '(', left + 1, right);
        }

        if (left > right) {
            traverse(current + ')', left, right + 1);
        }
    };

    traverse('', 0, 0);

    return result;
}

console.log(genarateParentheses(3));

// 升级一下，如果有多种符号怎么处理
function genarateParentheses2(n) {
    const result = [];
    const charMap = {
        '{': '}',
        '[': ']',
        '(': ')',
    };

    const traverse = (current, left, stack) => {
        if (current.length === 2 * n) return result.push(current);

        if (left < n) {
            Object.keys(charMap).forEach(key => {
                traverse(current + key, left + 1, [...stack, key]);
            });
        }

        if (stack.length) {
            const rightParentheses = charMap[stack.pop()];
            traverse(current + rightParentheses, left, stack);
        }
    };

    traverse('', 0, []);

    return result;
}

console.log(genarateParentheses2(2));
