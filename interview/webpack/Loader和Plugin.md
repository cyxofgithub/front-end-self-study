## loader 是什么

在 Webpack 中，Loader 是用于对模块的源代码进行转换的工具。它们允许你在打包过程中对不同类型的文件进行处理。

例如：

-   将 ES6 代码转换为 ES5、将 SCSS 文件转换为 CSS 等
-   将文件从不同的语言（如 TypeScript、CoffeeScript）转换为 JavaScript
-   将非 JavaScript 文件（如图片、字体等）转换为模块。

常见的一些 Webpack Loader 包括：

Babel Loader：用于将 ES6+ 代码转换为兼容的 JavaScript 代码。

CSS Loader：用于解析 CSS 文件，处理 CSS 中的导入、URL 引用等。

Style Loader：用于将 CSS 插入到 HTML 文件中的 <style> 标签中。

SASS Loader：用于将 SCSS/SASS 文件转换为 CSS。

Less Loader：用于将 Less 文件转换为 CSS。

## 如何编写一个 loader

编写一个简单的 Webpack Loader，以将文本中的所有大写字母转换为小写字母为例。以下是一个示例代码，带有注释说明：

```javascript
// 定义一个函数作为 Loader 的处理函数
// source，表示要处理的源代码
function lowercaseLoader(source) {
    // 将源代码中的大写字母转换为小写字母
    const transformedSource = source.toLowerCase();

    // 返回转换后的源代码
    return transformedSource;
}

// 导出 Loader 处理函数
module.exports = lowercaseLoader;
```

## plugin 是什么

Plugin 是用于扩展 Webpack 功能的插件。它们可以在打包过程中执行一些额外的操作。

例如：

-   优化输出
-   资源管理
-   注入环境变量插件

常见的一些 Webpack Plugin 包括：

HtmlWebpackPlugin：用于生成 HTML 文件，并自动将打包后的资源文件（如 CSS、JavaScript）引入到 HTML 文件中。

MiniCssExtractPlugin：用于将 CSS 从 JavaScript 中提取出来，生成单独的 CSS 文件。

CleanWebpackPlugin：用于在构建前清理输出目录。

DefinePlugin：用于在编译过程中定义全局变量，可以用于注入环境变量。

CopyWebpackPlugin：用于复制静态文件或文件夹到输出目录。

## 如何编写一个 plugin

```javascript
// 定义一个输出构建完成后的当前时间插件
class BuildTimePlugin {
    // 构造函数接收一个 options 对象，用于传递插件的配置参数
    constructor(options) {
        // 将配置参数保存到实例的 options 属性中
        this.options = options;
    }

    // 定义 apply 方法，Webpack 在安装插件时会调用该方法
    apply(compiler) {
        // 在构建完成后的回调中执行自定义操作
        compiler.hooks.done.tap("BuildTimePlugin", (stats) => {
            // 获取当前时间
            const buildTime = new Date().toLocaleString();

            // 输出构建时间
            console.log(`Build completed at ${buildTime}`);
        });
    }
}

// 导出插件类
module.exports = BuildTimePlugin;
```
