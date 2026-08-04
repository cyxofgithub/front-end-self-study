/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// 当前方案在大量重复元素下复杂度退化成 O (n)
// var searchRange = function (nums, target) {
//     let l = 0;
//     let r = nums.length - 1;
//     let lT = -1;
//     let rT = -1;

//     while (l <= r) {
//         const mid = Math.floor((r - l) / 2 + l);

//         if (nums[mid] === target) {
//             lT = mid;
//             rT = mid;
//             // 向左拓展
//             while (lT > 0 && nums[lT - 1] === target) {
//                 lT--;
//             }
//             // 向右拓展，边界判断前置
//             while (rT + 1 < nums.length && nums[rT + 1] === target) {
//                 rT++;
//             }
//             break; // 找到区间，退出二分循环！
//         } else if (nums[mid] < target) {
//             l = mid + 1;
//         } else {
//             r = mid - 1;
//         }
//     }
//     return [lT, rT]; // 补上返回值
// };

var searchRange = function (nums, target) {
    // 寻找左边界
    const findLeft = () => {
        let l = 0,
            r = nums.length - 1;
        let res = -1;
        while (l <= r) {
            const mid = l + Math.floor((r - l) / 2);
            if (nums[mid] === target) {
                res = mid;
                r = mid - 1; // 继续往左找
            } else if (nums[mid] < target) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        return res;
    };
    // 寻找右边界
    const findRight = () => {
        let l = 0,
            r = nums.length - 1;
        let res = -1;
        while (l <= r) {
            const mid = l + Math.floor((r - l) / 2);
            if (nums[mid] === target) {
                res = mid;
                l = mid + 1; // 继续往右找
            } else if (nums[mid] < target) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        return res;
    };
    return [findLeft(), findRight()];
};
