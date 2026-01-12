// 配置 3：useBuiltIns: 'entry'
// 需要在入口文件手动引入：import 'core-js/stable'; import 'regenerator-runtime/runtime';
// 会引入所有可能的 polyfill（体积较大）

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 使用 entry 模式
        useBuiltIns: 'entry',
        // 指定 core-js 版本（需要安装 core-js@3）
        corejs: 3,
        // 可选：指定目标浏览器
        targets: {
          chrome: '58',
          firefox: '60',
          safari: '11',
          edge: '16',
          ie: '11'
        }
      }
    ]
  ]
};

// 注意：使用此配置时，需要在入口文件顶部添加：
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
