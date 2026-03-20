```javascript
// 手写 Promise.all 标准实现
Promise.myAll = function (iterable) {
    return new Promise((resolve, reject) => {
        // 1. 处理参数：转为数组（兼容可迭代对象，如Set、Map）
        const promises = Array.from(iterable);
        // 边界情况：空数组直接resolve空数组
        if (promises.length === 0) return resolve([]);

        const results = []; // 存储成功结果
        let resolvedCount = 0; // 记录已成功的Promise数量

        // 2. 遍历每个Promise
        promises.forEach((promise, index) => {
            // 关键：用Promise.resolve包裹，兼容非Promise类型（如普通值）
            Promise.resolve(promise)
                .then((result) => {
                    results[index] = result; // 按原顺序存储
                    resolvedCount++;

                    // 3. 所有Promise都成功时，resolve结果数组
                    if (resolvedCount === promises.length) {
                        resolve(results);
                    }
                })
                .catch((error) => {
                    // 4. 任意一个失败，立即reject
                    reject(error);
                });
        });
    });
};

// 测试手写实现
const testMyAll = async () => {
    const res = await Promise.myAll([
        Promise.resolve(1),
        2, // 非Promise值，会被Promise.resolve包裹
        new Promise((res) => setTimeout(() => res(3), 500)),
    ]);
    console.log('手写Promise.all结果：', res); // 输出：[1,2,3]
};

testMyAll();
```
