// 问题：找出数组中出现次数超过半数的元素。
// 解法：摩尔投票法或哈希表统计。
// 优化：O (1) 空间复杂度。

function findMoreHalfItem(arr = []) {
    const map = new Map();

    if (arr.length <= 1) {
        return arr[0];
    }

    const half = arr.length / 2;  

    for (let i = 0; i < arr.length; i++) {
        const curNum = (map.get(arr[i]) || 0) + 1
        map.set(arr[i], curNum);

        if (curNum > half) {
            return arr[i];
        } 

    }

    return;
}

console.log(findMoreHalfItem([3,3, 1, 1, 3]));

// 摩尔投票法 o(1) 空间复杂度
function findMoreHalfItem2(arr = []) {
    let result = arr[0];
    let count = 1;
    
    for (let i = 1; i < arr.length; i++) {
        if (count === 0)  {
            result === arr[i];
        } else if (arr[i] === result) {
            count++
        } else {
            count--;
        }
    }

    return result;

}

console.log(findMoreHalfItem2([3,3, 1, 1, 1]));
