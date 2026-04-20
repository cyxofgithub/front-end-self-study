## script defer 和 async 的区别

▶ defer 属性用于异步加载外部 JavaScript 文件，**当异步加载完成后，该外部 JavaScript 文件不会立即执行，而是等到整个 HTML 文档加载完成才会执行。**适用于需要在 DOM 完全加载后执行的脚本，通常用于依赖 DOM 结构的脚本。

▶ async 属性用于异步加载外部 JavaScript 文件，**当异步加载完成后，该外部 JavaScript 文件会立即执行，即使整个 HTML 文档还没有加载完成。**适用于独立的脚本，不依赖其他脚本或 DOM 结构。

如果两个同时设置只有 async 会生效
