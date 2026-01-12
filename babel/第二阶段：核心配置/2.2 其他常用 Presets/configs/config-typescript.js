// TypeScript preset 配置
// 移除 TypeScript 类型注解，保留语法

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
            '@babel/preset-typescript',
            {
                isTSX: true, // 支持 TSX 文件
                allExtensions: true, // 处理所有扩展名
            },
        ],
    ],
};
