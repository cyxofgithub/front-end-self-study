# WAT 手写示例

手写 WebAssembly Text Format（WAT），理解栈式执行和导入导出。

## 文件说明

- `add.wat` - 两数相加
- `multiply.wat` - 两数相乘
- `max.wat` - 取两数较大值（使用 `if` 控制流）

## 使用步骤

1. 安装依赖并编译：`npm install && npm run build`
2. 启动本地服务：`npm run serve`
3. 打开浏览器访问对应地址，点击「运行示例」

或使用任意静态服务器（如 `npx serve .`）在 `wat` 目录下启动，注意 `instantiateStreaming` 需要正确的 MIME 类型。
