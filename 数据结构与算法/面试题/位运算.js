// 1、一个数组有多个数字出现偶次数，只有一个数字出现奇次数，求这个数字
const arr1 = [2, 2, 2, 2, 3, 3, 4, 5, 5];

function getNum(arr) {
    let num = 0;
    for (let i = 0; i < arr.length; i++) {
        num ^= arr[i];
    }

    console.log(num);
}

getNum(arr1);
