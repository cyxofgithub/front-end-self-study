// React preset 配置（旧 JSX 转换方式）
// 使用 runtime: 'classic'，需要手动引入 React

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
                runtime: 'classic', // 旧 JSX 转换，需要引入 React
                development: false,
            },
        ],
    ],
};
