// 配置 4：useBuiltIns: 'usage' ⭐ 推荐配置
// 自动按需引入 polyfill，只引入代码中实际使用的
// 输出体积最小，推荐使用

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 使用 usage 模式（推荐）
        useBuiltIns: 'usage',
        // 指定 core-js 版本（需要安装 core-js@3）
        corejs: 3,
        // 可选：指定目标浏览器
        targets: {
          chrome: '58',
          firefox: '60',
          safari: '11',
          edge: '16',
          ie: '11'
        },
        // 可选：是否转换模块语法
        // modules: false,  // 保留 ES 模块（用于库开发）
        // modules: 'auto'  // 自动检测（默认）
      }
    ]
  ]
};

// 注意：使用此配置时，不需要手动引入 polyfill
// Babel 会自动检测代码中使用的特性，并引入相应的 polyfill
