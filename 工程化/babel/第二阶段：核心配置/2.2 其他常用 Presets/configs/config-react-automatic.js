// React preset 配置（新 JSX 转换方式，推荐）
// 使用 runtime: 'automatic'，无需引入 React（React 17+）

module.exports = {
    presets: [
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
        [
            '@babel/preset-react',
            {
                runtime: 'automatic', // 新 JSX 转换（React 17+），无需引入 React
                development: false,
            },
        ],
    ],
};
