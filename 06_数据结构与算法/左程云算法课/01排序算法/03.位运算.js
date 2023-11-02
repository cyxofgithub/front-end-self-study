// 1、一个数组有多个数字出现偶次数，只有一个数字出现奇次数，求这个数字
const arr1 = [2, 2, 2, 2, 3, 3, 4, 5, 5];

function getNum1(arr) {
    let num = 0;
    for (let i = 0; i < arr.length; i++) {
        num = arr[i] ^ num;
    }

    console.log(num);
}

getNum1(arr1);

// 2、一个数组的有多个数字出现偶次数，只有两个数字出现奇数次，求这两个数字
const arr2 = [2, 2, 2, 2, 3, 3, 4, 6, 6, 7];

function getNum2(arr) {
    let num1 = 0;
    for (let i = 0; i < arr.length; i++) {
        num1 = arr[i] ^ num1;
    }

    // 上面操作得到 4 ^ 7
    // 因为这两个数字不同，所以他们的二进制异或肯定有一位为1
    let num2 = num1 & (~num1 + 1); // 拿到 num1 中最右侧为 1 的那位，这里假设是最右侧第一位
    let ans1 = 0;
    let ans2 = 0;
    for (let i = 0; i < arr.length; i++) {
        // 将数组的数分为两组一组是最右侧第一位为1的，一组是0的
        // 这个时候两个出现奇数次的数字就被分为两组，分别让他们做异或操作，就可以得到答案了
        if (arr[i] & num2) {
            // 与运算，就是两位都是1的时候才会为 1
            ans1 = ans1 ^ arr[i];
        } else {
            ans2 = ans2 ^ arr[i];
        }
    }

    console.log(ans1, ans2);
}

getNum2(arr2);

function a() {
    console.log(123);
}
