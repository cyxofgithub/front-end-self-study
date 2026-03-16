## 在线文档

### OT/CRDT算法原理与区别
 [参考](../../../../场景解决方案/多人编辑/编辑器多人协作冲突原理.md)

#### OT算法原理

同步的核心基于中心服务位置的操作转换，需要中心服务器统一处理转换操作

#### CRDT算法原理

- 操作都有唯一id和value、left、right，并按照全序规则排序(冲突时)
- 只要理解了排序就理解了同步原理

**同步的时机：基于版本向量**

例如版本向量 `{A: 5, B: 3}` 表示：当前副本已处理 A 的 1..5 和 B 的 1..3。若收到对端摘要 `{A: 4, B: 5}`，就知道：

-   我缺 B 的 4..5，需要拉取并应用；
-   对端缺 A 的 5，需要回传。



### 编辑器框架：proseMirror 

- [常见问题](../../../../编辑器/proseMirror常见问题.md)

### wasm 的优化

- Pulldown-cmark WASM Markdown 解析
- Yjs WASM 绑定（协同场景） [优化示例](../../../../编辑器/在线文档协同/code)
- Shiki WASM 语法高亮

#### wasm 快的原因

- 避开 GC 停顿：Wasm 线性内存由开发者手动管理，没有 JS 那种 “自动暂停执行回收内存” 的 GC 操作，执行过程连续无中断；
- 二进制格式 + 静态类型：大幅降低解析 / 编译成本，避免运行时类型开销；
- 接近机器码的指令集：执行效率对标 C/C++，远超动态类型的 JS（计算密集型场景）。

### canvas 优化

- 在线文档：多用户光标 / 选区 通过 Canvas 层渲染 [优化示例](../../../../编辑器/在线文档协同/code)
- 大表格混合渲染（Canvas + DOM）
  -  用 Canvas 绘制表格内容（文本、边框、背景）。
  -  仅将「当前输入焦点的单元格」用 DOM 覆盖（用于接收输入、显示光标）。

#### canvas 快的原因

- 局部重绘（最核心的优化）
  - 不要每次都 clearRect(0, 0, width, height) 擦除整个画布，只擦除「需要更新的区域」：
    - 比如光标移动：只擦除旧光标位置的小矩形（比如 20x20 像素），再在新位置绘制；
    - 比如表格滚动：只擦除滚动时 “新增的边缘区域”，复用中间已绘制的内容；
    - 效果：重绘面积从 “整个画布” 降到 “局部小区域”，消耗降低 90% 以上

-  离屏 Canvas（OffscreenCanvas）

把 “静态内容”（比如表格的表头、背景）先画在一个离屏 Canvas 上，需要时直接把离屏 Canvas 的像素 “复制” 到主 Canvas：
  - 比如大表格：表头、固定列先画在离屏 Canvas，滚动时直接 drawImage(offscreenCanvas, x, y) 复制，无需重复绘制静态内容；
  - 效果：减少重复绘制的计算量，消耗再降 50% 以上。

- 利用 requestAnimationFrame 同步帧率

**通俗比喻**

- DOM 重排：像 “重新装修整栋楼”—— 你只是想移动一个房间的家具，却要重新计算整栋楼的承重、布局，耗时极长；
- Canvas 重绘：像 “在墙上重新画一幅画的局部”—— 你只需要擦除旧的一笔，画上新的一笔，耗时极短，哪怕画的是复杂的图案

## openClaw

[openClaw相关](../../../../interview/AI/openClaw相关.md)

## Webpack/Vite 构建原理

### webpack

[详细看](../../../webpack/webpack打包原理.md)

我们从入口讲起

-   在配置 webpack 的时候我们配置 entry、output、plugin、module/rules
-   执行 webpack 后会先根据配置找到入口文件读取文件内容 利用 babel 转换成 ast 识别依赖
-   如果依赖是 module rules 的文件会根据对应的 loader 转换然后继续重复这个读取 -> ast -> 识别依赖这个过程构建出依赖图
-   依赖图构建完成后会根据依赖关系输出 chunk （中间涉及到模块转换，比如 es import 语句转换成 webpack 可识别的模块语句**webpack_require**）
-   n 个入口就有 n 个 chunk 如果有配置 split chunk 会有更多



### vite

[详细参考](../../../vite/README.md)

思路：

- 从根html触发，读取主入口文件，用 esbuild 打成少量 ESM（如一个 deps.js），放到 node_modules/.vite/。
- 当浏览器请求 url 时拦截，读取文件 → esbuild.transform(启动时未预构建部分) → 将 import 'lodash-es' 改写为 import '/node_modules/.vite/deps.js?t=...'，返回 JS。


## TypeScript

[详细参考](../../../typescript/高频梳理.md)

