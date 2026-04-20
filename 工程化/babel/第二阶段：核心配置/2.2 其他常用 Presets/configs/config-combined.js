// 多个 preset 组合配置
// React + TypeScript + ES6+ 语法转换
// 注意：preset 执行顺序是从后往前（从右往左）

module.exports = {
    presets: [
        // 最后执行：转换 ES6+ 语法
        [
            '@babel/preset-env',
            {
                targets: {
                    chrome: '58',
                    firefox: '60',
                    safari: '11',
                    edge: '16',
                },
            },
        ],
        // 中间执行：转换 JSX 语法
        [
            '@babel/preset-react',
            {
                runtime: 'automatic', // 新 JSX 转换（推荐）
                development: false,
            },
        ],
        // 最先执行：移除 TypeScript 类型注解
        '@babel/preset-typescript',
    ],
};
