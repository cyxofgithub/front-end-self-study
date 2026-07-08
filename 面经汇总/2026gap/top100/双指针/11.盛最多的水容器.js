/**
 * @param {number[]} height
 * @return {number}
 */
// 宽度缩小 尽可能让两个边最大 才能找出最大面积
var maxArea = function (height) {
    let left = 0;
    let right = height.length - 1;
    let area = 0;

    while (left < right) {
        area = Math.max(
            Math.min(height[left], height[right]) * (right - left),
            area,
        );
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return area;
};

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));
