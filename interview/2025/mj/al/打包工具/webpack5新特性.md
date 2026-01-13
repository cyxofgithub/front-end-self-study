## webpack5 新特性

-   持久化缓存：基于文件内容哈希（content hash）的持久化缓存机制，核心是硬盘级缓存，大幅提升二次构建速度，所有中大型项目必用；
-   模块联邦：微前端核心方案，解决跨应用模块共享问题，适合多应用集成的场景；
-   增强的 Tree Shaking：覆盖 CommonJS 模块，进一步精简打包体积，通用优化手段（动态部分仍无法 tree shaking 能支持静态部分）；
-   Node.js 模块兼容：
    -   按需 polyfill，移除了对 Node.js 内置模块（如 fs、path、crypto）的自动 polyfill
    -   新增 resolve.fallback 配置，允许按需为浏览器环境提供 Node.js 模块的替代实现，用于向后兼容
