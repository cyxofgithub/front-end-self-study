# Rust + wasm-pack 示例

从 Rust 源码编译到 WebAssembly，实现数组求和与斐波那契，并与 JS 做性能对比。

## 前置条件

- 安装 [Rust](https://rustup.rs/)
- 安装 wasm-pack：`cargo install wasm-pack`

## 构建与运行

```bash
wasm-pack build --target web
npx serve .
```

浏览器访问对应地址，点击「运行示例」或「性能对比」。

## 导出函数

- `sum_array(arr: Int32Array)` - 数组求和
- `fib(n: u32)` - 斐波那契（用于性能对比）

## 与 Vite/Webpack 集成

构建后的 `pkg/` 目录可直接作为 npm 包使用：

```javascript
import init, { sum_array, fib } from './pkg/rust_wasm_demo.js';
await init();
console.log(sum_array(new Int32Array([1, 2, 3, 4, 5]))); // 15
```
