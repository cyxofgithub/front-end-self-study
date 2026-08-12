/**
 * @param {number[]} nums
 * @return {number}
 */
// 快慢指针可以看成有环链表
// var findDuplicate = function (nums) {
//     let slow = nums[0];
//     let fast = nums[0];

//     // 阶段1：快慢指针在环内相遇
//     while (true) {
//         slow = nums[slow];
//         fast = nums[nums[fast]];
//         if (slow === fast) break;
//     }

//     // 阶段2：一个指针从头出发，两者同速前进，相遇点即为重复值
//     fast = nums[0];
//     while (slow !== fast) {
//         slow = nums[slow];
//         fast = nums[fast];
//     }
//     return slow;
// };

// 二分查找
