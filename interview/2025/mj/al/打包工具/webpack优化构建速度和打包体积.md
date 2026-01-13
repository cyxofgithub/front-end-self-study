## 生产环境性能优化

构建速度优化一般来说有以下几种方式：

-   开启多进程打包
-   babel 缓存
-   通过 includes、exclude 来减少 loader 处理的范围
-   通过 dllplugin 来可以将稳定的第三方库单独打包，下次构建只需要引用而不是重复处理从而加快主项目的构建速度
-   webpack5 持久化缓存 缓存文件不变的转换结果

像优化打包体积的话一般可以通过：

-   treeshaking
-   代码分割
-   代码压缩
-   通过 external 将一些库通过 cdn 引入
-   通过设置 babel presetEnv “按需转译”减少 profill 代码

[详细参考](../../../../webpack/讲讲webpack优化.md)
