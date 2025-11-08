// 问题：原地反转字符串中的字符。

function reverseString(_chars) {
    let chars = _chars.split('');
    let left = 0;
    let right = chars.length - 1;

    while(left < right) {
        const temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;
        left++;
        right--;
    }

    return chars.join('');
}

console.log(reverseString('abcefg'));
