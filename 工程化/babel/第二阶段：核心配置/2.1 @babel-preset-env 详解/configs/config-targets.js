// 配置 2：targets 配置
// 根据目标浏览器智能转换，只转换目标浏览器不支持的语法

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 方式一：指定具体浏览器版本
        targets: {
          chrome: '58',  // Chrome 58+
          firefox: '60', // Firefox 60+
          safari: '11',  // Safari 11+
          edge: '16',    // Edge 16+
          ie: '11'       // IE 11（需要更多转换）
        }
        // 方式二：使用 browserslist 配置（推荐）
        // targets: '> 0.25%, not dead'  // 市场份额 > 0.25% 且未停止维护的浏览器
        // 或者使用 package.json 中的 browserslist 字段
      }
    ]
  ]
};
