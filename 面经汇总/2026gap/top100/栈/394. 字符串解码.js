/**
 * @param {string} char
 * @return {string}
 */
var decodeString = function (s) {
    // 存放前缀计算数字
    const nStack = [];
    // 存放前缀字符串
    const cStack = [];
    let curNum = 0;
    let curStr = '';

    for (const char of s) {
        if (!isNaN(Number(char))) {
            curNum = curNum * 10 + Number(char);
        } else if (char === '[') {
            nStack.push(curNum);
            cStack.push(curStr);
            curNum = 0;
            curStr = '';
        } else if (char === ']') {
            const num = nStack.pop();
            const preStr = cStack.pop();
            curStr = preStr + curStr.repeat(num);
        } else {
            curStr += char;
        }
    }

    return curStr;
};
