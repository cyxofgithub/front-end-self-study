// 问题：每次可爬 1 或 2 步，求到达 n 阶的方法数。

// 最基础的做法
// 存在重复计算问题比如 n 为 5 的时候。getNum(3) 会被计算两次

// 时间复杂度：O(2ⁿ)（指数级）
// 原因：每次递归会分解为两个子问题（getNum(n-1) 和 getNum(n-2)），形成一棵深度为 n 的二叉递归树。
// 树的节点总数约为 2ⁿ（第 n 层的节点数为 2ⁿ⁻¹，总节点数为 2ⁿ - 1），每个节点对应一次计算，因此时间复杂度为指数级。
// 例如：n=5 时，getNum(3) 被计算 2 次，n=10 时，getNum(5) 被计算 8 次，重复计算随 n 呈指数增长。

// 空间复杂度：O(n)（线性级）
// 原因：递归调用依赖函数调用栈，栈的最大深度等于递归的层数（即 n，从 n 递归到 1）。
// 栈中同时存在的函数调用最多为 n 个（例如计算 getNum(n) 时，栈会依次压入 getNum(n)、getNum(n-1)、...、getNum(1)），因此空间复杂度由栈深度决定，为 O(n)。
function getNum(n) {
    if (n <= 2) return n;

    return getNum(n - 2) + getNum(n - 1);
}

// 记忆递归
// 时间复杂度: o(n)
// 原因：通过 memo 缓存已计算的结果，每个 n 仅需计算一次（避免重复计算）。

// 空间复杂度： o(nlogn)
// 原因：
// 缓存 memo 需要存储 n 个键值对（从 1 到 n 的结果），占用 O(n) 空间；
// 递归调用栈的最大深度仍为 n（与纯递归相同）。
// 两者叠加，总空间复杂度为 O(n)。
function getNum2(n, memo = []) {
    if (memo[n]) return memo[n];

    if (n <= 2) return n;

    memo[n] = getNum2(n - 1) + getNum2(n - 2);

    return memo[n];
}

// 迭代计算
// 空间复杂度： o(1)
// 时间复杂度： o(n)
function getNum3(n) {
    if (n <= 2) return n;

    let pre1 = 1;
    let pre2 = 2;
    let current = pre1 + pre2;

    for (let i = 3; i <= n; i++) {
        current = pre1 + pre2;
        pre1 = pre2;
        pre2 = current;
    }

    return current;
}

console.log(getNum(5));
console.log(getNum2(5));
console.log(getNum3(5));
