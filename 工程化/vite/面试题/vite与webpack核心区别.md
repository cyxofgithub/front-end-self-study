# Vite 与 Webpack 核心区别（结合迷你实现讲）

**一句话结论**：核心区别是 **开发态构建范式**——Webpack 是 **bundle（先打包再服务）**，Vite 是 **no-bundle（先服务，按需编译，浏览器原生 ESM 拼装）**；再叠加 **编译器语言差异**（Go 写的 esbuild vs JS 写的 Babel）。

本文所有结论都对应本仓库两个可运行实现，可直接跑起来看日志：

| 实现 | 位置 | 范式 | 启动命令 |
| --- | --- | --- | --- |
| mini-webpack | [工程化/webpack/mini-webpack](../../webpack/mini-webpack/README.md) | bundle | `pnpm dev`（:5175） |
| mini-vite | [工程化/vite](../README.md) | no-bundle | `pnpm dev`（:5174） |

两个 demo 结构故意保持一致（`index.html` + `src/main.js` + 一个依赖模块），便于逐行对照。

## 一、核心区别总览

| 维度 | Webpack | Vite |
| --- | --- | --- |
| 开发态范式 | **bundle**：先建完整依赖图 → 打包 → 内存产物给浏览器 | **no-bundle**：起静态服务，浏览器按 URL 请求，服务器按需转换 |
| 浏览器拿到什么 | 打好包的 bundle chunk | 原生 ESM 模块，一个文件一个请求 |
| 模块调度者 | 自己实现的 `__webpack_require__` runtime | 浏览器原生 ESM |
| 编译器 | JS 实现（Babel/ts-loader/terser） | **esbuild（Go）** 做预构建与单文件转换 |
| 启动耗时 | ∝ 模块总数，大项目 30s–几分钟 | 几乎恒定，仅预构建 node_modules |
| HMR 耗时 | ∝ 受影响 chunk 大小 | ∝ 改动模块本身，与项目规模无关 |
| 生产构建 | Webpack 自身 | **Rollup**（新版转向 Rolldown） |
| 模块规范 | CJS / ESM / AMD / UMD 全兼容 | ESM 一等公民，CJS 靠预构建转换 |

## 二、启动为什么快：看两边 server 启动时做了什么

### mini-webpack：启动必须先跑完整个依赖图

[`mini-webpack/src/server.ts`](../../webpack/mini-webpack/src/server.ts)：

```typescript
function main(): void {
  console.log('[mini-webpack] 启动前必须先完成全量打包...');
  rebuild('启动');            // ← 阻塞：遍历全部模块才能继续

  const server = createServer(handleRequest);
  server.listen(PORT, ...);
}

function rebuild(reason: string): void {
  const { graph, entryId } = buildModuleGraph(entry, root);  // 递归遍历所有模块
  cachedBundle = generateBundle(graph, entryId);
  console.log(`第 ${buildCount} 次构建（${reason}）：${graph.size} 个模块，${cost}ms`);
}
```

工作量全在 [`graph.ts#buildModuleGraph`](../../webpack/mini-webpack/src/graph.ts)——广度优先把整棵依赖树走完：

```typescript
const queue: string[] = [entryFile];
while (queue.length > 0) {              // ← 这个循环不跑完，浏览器拿不到任何东西
  const filePath = queue.shift()!;
  const raw = readFileSync(filePath, 'utf-8');     // 1. 读盘
  const loaded = runLoaders(raw, filePath);        // 2. 过 loader 链
  while ((m = IMPORT_RE.exec(loaded)) !== null) {  // 3. 提取依赖
    const resolved = resolveModule(spec, filePath, root);
    queue.push(resolved);                          // 4. 入队继续遍历
  }
  graph.set(id, { id, filePath, code: transformToRuntime(loaded, deps), deps });
}
```

**每个模块都要走「读盘 → loader → 解析 import → 改写」四步**，1000 个模块就是 1000 次。

### mini-vite：启动只处理 node_modules

[`vite/src/server.ts`](../src/server.ts)：

```typescript
async function main(): Promise<void> {
  await ensurePrebundle();   // ← 只预构建 node_modules，业务代码一个没碰

  const server = createHttpServer(handleRequest);
  createHMRServer(server, root);
  server.listen(PORT, ...);
}
```

业务模块的转换被推迟到**请求到达时**：

```typescript
// handleRequest：请求哪个模块才转换哪个
if (urlPath.startsWith('/src/') && urlPath.endsWith('.js')) {
  const result = await transformRequest(urlPath);   // ← 按需，不请求就不编译
  res.end(result.code);
}
```

### 实测对比

```bash
# mini-webpack
$ pnpm dev
[mini-webpack] 启动前必须先完成全量打包...
[mini-webpack] 第 1 次构建（启动）：3 个模块，1.0ms   ← 启动就把 3 个模块全处理了

# mini-vite
$ pnpm dev
Running prebundle...
deps: [ 'lodash-es' ]      ← 只处理了 node_modules 依赖
Prebundle done.
mini-vite dev server at http://localhost:5174    ← 业务模块此时一个都没编译
```

**复杂度差异**：

```
Webpack 启动 = O(项目模块总数)      — 首屏用不到的模块也要打包
Vite  启动 = O(node_modules 依赖数) — 首屏用几个业务模块就转几个
```

### 第二个加速点：esbuild

[`vite/src/transform.ts`](../src/transform.ts) 与 [`prebundle.ts`](../src/prebundle.ts) 都用 esbuild：

```typescript
// 单文件转换：Go 实现，无类型检查，纯语法剥离
const result = await esbuild.transform(code, { loader, format: 'esm', target: 'esnext' });

// 依赖预构建：Go 并行打包
await esbuild.build({ entryPoints: [virtualEntry], bundle: true, format: 'esm', ... });
```

对比 mini-webpack 里全程 JS 单线程处理。真实项目中 esbuild 比 Babel 快 10–100 倍。

> **依赖预构建的两个必要性**（不只为快），看 [`prebundle.ts`](../src/prebundle.ts) 的注释：
> ① 浏览器不认 `import 'lodash-es'` 这种 bare specifier；
> ② `lodash-es` 有 600+ 散文件，不预打包会瞬间发几百个请求。
> 预构建成一个 `deps.js` 后只需 1 个请求，且可长期强缓存。

## 三、浏览器拿到什么：产物形态的根本差异

### mini-webpack：1 个 bundle + 自己实现的模块系统

`demo/index.html`：

```html
<script src="/bundle.js"></script>   <!-- 只有这一个请求 -->
```

`pnpm build` 实际产出（[bundle.ts](../../webpack/mini-webpack/src/bundle.ts) 生成）：

```javascript
(function () {
var __webpack_modules__ = {
  "./src/main.js": function (module, exports, __webpack_require__) {
    const { add } = __webpack_require__("./src/foo.js");     // ← import 被改写
    const { format } = __webpack_require__("./src/util.js");
    app.innerHTML = `...${add(1, 2)}...`;
  },
  "./src/foo.js": function (module, exports, __webpack_require__) {
    exports.add = function add(a, b) { return a + b; }        // ← export 被改写
  },
  "./src/util.js": function (module, exports, __webpack_require__) { ... }
};
var __webpack_module_cache__ = {};

function __webpack_require__(moduleId) {           // ← 自己实现的模块系统
  var cached = __webpack_module_cache__[moduleId];
  if (cached !== undefined) return cached.exports;  // 模块缓存
  var module = (__webpack_module_cache__[moduleId] = { id: moduleId, exports: {} });
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}

__webpack_require__("./src/main.js");
})();
```

**这解释了三件事**：

1. 为什么 webpack 能兼容 IE —— 模块系统是自己实现的，不依赖浏览器
2. 为什么 CJS/ESM/AMD 能混用 —— 都被统一成 `(module, exports, __webpack_require__)` 函数签名
3. 为什么循环依赖不会死循环 —— `__webpack_module_cache__` 保证同一模块只执行一次

### mini-vite：N 个原生 ESM，浏览器自己调度

`demo/index.html`：

```html
<script type="module" src="/src/main.js"></script>   <!-- 入口，后续按需请求 -->
```

实测 `curl http://localhost:5174/src/main.js`：

```javascript
import { add } from "./foo.js";                                    // ← 相对路径保持原样
import { capitalize } from '/node_modules/.vite/deps.js?t=1787130523271';  // ← bare 被重写
const app = document.getElementById("app");
app.innerHTML = `<p>foo.add(1,2) = ${add(1, 2)}</p>...`;
```

`curl http://localhost:5174/src/foo.js`：

```javascript
function add(a, b) { return a + b; }
export { add };      // ← 仍是原生 ESM，没有任何 runtime 包裹
```

改写逻辑就在 [`transform.ts#rewriteBareImports`](../src/transform.ts)：

```typescript
function rewriteBareImports(code: string, prebundleUrl: string): string {
  return code.replace(BARE_IMPORT_RE, (full, named, from, from2) => {
    const spec = from ?? from2 ?? '';
    if (spec.startsWith('.') || spec.startsWith('/')) return full;  // 相对路径不动
    return `import ${named} from '${prebundleUrl}?t=${Date.now()}'`; // bare → 预构建 URL
  });
}
```

**没有 runtime、没有模块 map** —— 模块依赖关系由浏览器原生 ESM 解析，服务器只负责"把请求到的文件转成合法 ESM"。

## 四、HMR 为什么快：看文件变更后各自做什么

### mini-webpack：重建整个 bundle

[`server.ts`](../../webpack/mini-webpack/src/server.ts)：

```typescript
chokidar.watch(path.join(root, 'src')).on('change', (file) => {
  rebuild(`${path.basename(file)} 变更`);   // ← 关键：改一个文件，整张依赖图重走一遍
  clients.forEach((c) => c.send(JSON.stringify({ type: 'invalid' })));
});
```

实测日志：

```
[mini-webpack] 第 1 次构建（启动）：3 个模块，1.0ms
[mini-webpack] 第 2 次构建（util.js 变更）：3 个模块，0.6ms
                                          ↑ 只改了 util.js，仍重建全部 3 个模块
```

项目有 1000 个模块时，改一行也要重走这 1000 个模块（真实 webpack 有缓存优化，但受影响 chunk 仍需重新生成与传输）。

### mini-vite：只推路径，浏览器重取单文件

[`vite/src/hmr.ts`](../src/hmr.ts) 服务端：

```typescript
chokidar.watch(srcDir).on('change', (filePath) => {
  const urlPath = '/' + path.relative(root, filePath);
  broadcast({ type: 'update', path: urlPath });   // ← 只推变更文件的 URL，不做任何重编译
});
```

客户端：

```javascript
ws.onmessage = function (e) {
  const msg = JSON.parse(e.data);
  if (msg.type === 'update' && msg.path) {
    import(msg.path + '?t=' + Date.now())          // ← 浏览器原生拉这一个文件
      .catch(function () { location.reload(); });
  }
};
```

### `?t=时间戳` 是 Vite HMR 的实现基石

ESM 模块被浏览器缓存后**无法重新求值**。加 query 生成新 URL，浏览器才会视作新模块重新拉取执行 —— 这就是 `import(msg.path + '?t=' + Date.now())` 的作用。

### 三点关键差异

| 差异点 | Webpack | Vite |
| --- | --- | --- |
| 是否重新打包 | 要重建受影响 chunk | 不打包，只转换这一个文件 |
| 传输内容 | hot-update chunk（可能含多模块） | 单个模块的 JS 文本 |
| 耗时相关因素 | ∝ 项目规模 | ∝ 改动文件本身 |

**HMR 边界仍需框架配合**：Vite 只负责精确通知"哪个模块变了"，状态保留靠 `@vitejs/plugin-react`（react-refresh）；否则退化为 full-reload。这点与 Webpack 的 `module.hot.accept` 一致，详见 [webpack 热更新](../../webpack/面试题/webpack%20热更新.md)。

## 五、为什么开发用 esbuild、生产用 Rollup

**esbuild 快但功能不全**：代码分割、CSS 处理、legacy 兼容、插件生态都不如 Rollup 成熟。

**生产环境不能 no-bundle**：数百个 ESM 请求在真实网络下会有严重瀑布流延迟，不打包反而更慢——mini-vite 的 demo 只有 3 个模块所以看不出来，真实项目上千个模块必须打包。

```
开发态：esbuild  → 追求极致速度，一致性可让步
生产态：Rollup   → 追求产物质量：tree-shaking、code split、legacy 降级
```

**代价是双引擎不一致**：开发跑通、生产报错确实存在（CJS/ESM 互操作、`process.env` 处理差异最常见）。这也是 Vite 转向 **Rolldown**（Rust 重写的 Rollup）的动因——统一开发生产引擎。

## 六、Vite 的代价（体现技术判断的答题点）

| 问题 | 说明 | 缓解 |
| --- | --- | --- |
| 首次访问深层路由慢 | 该路由下几十个模块首次串行请求，出现请求瀑布 | `optimizeDeps.include` 预热、`server.warmup` |
| 开发/生产行为不一致 | 双引擎导致 | 上线前跑 `vite build && vite preview` 验证 |
| 开发态需现代浏览器 | 依赖原生 ESM | 生产用 `@vitejs/plugin-legacy` 降级 |
| 深度定制能力 | 模块联邦、特殊 loader 链 Webpack 更成熟 | 微前端等场景仍常选 Webpack |

**Webpack 也在追赶**：`cache: { type: 'filesystem' }` 持久化缓存、`experiments.lazyCompilation`（按需编译，思路借鉴 Vite）、swc-loader / esbuild-loader 替换 Babel，能显著缩小差距。**不是 Vite 全面胜出，而是范式取舍**。

## 七、选型结论

```
新项目 / 中小型 / Vue·React 常规栈  → Vite（开发体验优势明显）
遗留项目 / 深度定制 / 模块联邦微前端 → Webpack 5（生态与可控性）
库开发                              → Rollup / tsup（产物纯净）
```

## 总结

> **启动快** = no-bundle 把全量打包变成按需编译（`buildModuleGraph` 整个循环被省掉，只剩 `ensurePrebundle`）+ esbuild 用 Go 并行。
> **HMR 快** = 不重建 chunk（对比 mini-webpack 的 `rebuild()`），只推变更路径，靠 `?t=` 让浏览器原生重新 import 单文件。
> **产物差异** = webpack 输出 1 个含 `__webpack_require__` runtime 的 bundle；Vite 输出 N 个原生 ESM，调度交给浏览器。
> **代价** = 双引擎不一致、深层路由首访瀑布、开发态需现代浏览器。

## 延伸阅读

- [mini-webpack 实现](../../webpack/mini-webpack/README.md) —— 依赖图、loader 链、runtime 生成
- [mini-vite 实现](../README.md) —— 静态服务、按需转换、预构建、HMR
- [webpack 打包原理](../../webpack/面试题/webpack打包原理.md) —— Compiler/Compilation 生命周期与 plugin 机制
- [webpack 热更新](../../webpack/面试题/webpack%20热更新.md) —— `module.hot.accept` 与 hot-update 增量机制
