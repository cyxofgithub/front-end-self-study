module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    chrome: '58',
                    ie: '11',
                },
                // 或使用 browserslist: '> 0.25%, not dead'
            },
        ],
    ];
};
