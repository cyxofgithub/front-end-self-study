/**
 * 生成 bundle：runtime + 模块 map。splitChunks 之后产物是「多个文件」而非一个：
 *   - bundle.js      主 chunk：runtime + main chunk 的模块 + 启动入口
 *   - <chunkId>.js   其它 chunk：各自往全局队列 push 自己的模块（webpack JSONP 的等价物）
 *
 * 这是 webpack 与 Vite 最直观的产物差异：
 * - webpack：浏览器拿到 1..N 个 bundle，模块被包成函数存 map 里，靠 __webpack_require__ 调度；
 *           跨 chunk 的模块靠 __webpack_require__.e 按需加载
 * - Vite   ：浏览器拿到 N 个原生 ESM 文件，模块调度由浏览器自己做，没有 runtime
 */
import type { ModuleGraph } from './graph.js';
import type { Chunk } from './chunk.js';

/** 把单个模块的 transformed 代码包成工厂函数源码（生成 bundle 与 hot-update 共用同一形状） */
export function moduleFactorySource(code: string): string {
  return `function (module, exports, __webpack_require__) {
${code
  .split('\n')
  .map((l) => '    ' + l)
  .join('\n')}
  }`;
}

/** webpack runtime 的最小版本：模块缓存 + 递归加载 + chunk 按需加载 + HMR 增量接口 */
const RUNTIME = `
var __webpack_modules__ = __MODULES__;
var __webpack_module_cache__ = {};

function __webpack_require__(moduleId) {
  var cached = __webpack_module_cache__[moduleId];
  if (cached !== undefined) return cached.exports;

  var module = (__webpack_module_cache__[moduleId] = { id: moduleId, exports: {} });
  var fn = __webpack_modules__[moduleId];
  if (!fn) throw new Error('Module not found: ' + moduleId);
  fn(module, module.exports, __webpack_require__);
  return module.exports;
}

__webpack_require__.m = __webpack_modules__;
__webpack_require__.c = __webpack_module_cache__;
__webpack_require__.entry = __ENTRY__;

// —— chunk 加载（splitChunks 之后模块分散在多个文件里）——
// installedChunks: chunkId -> 0 表示已加载。main 随本文件一起加载，直接标记为 0。
var installedChunks = { __INSTALLED_CHUNKS__ };
var chunkLoaders = {};

// 注册一个 chunk 的模块工厂。初始共享 chunk 在 HTML 里先于本文件引入，走全局队列；
// 运行时接管队列的 push 之后，异步 chunk（__webpack_require__.e 拉取）直接命中这里。
function registerChunk(item) {
  var chunkId = item[0];
  var modules = item[1];
  for (var id in modules) __webpack_require__.m[id] = modules[id];
  installedChunks[chunkId] = 0;
  var loaders = chunkLoaders[chunkId];
  if (loaders) {
    loaders.forEach(function (f) { f(); });
    chunkLoaders[chunkId] = null;
  }
}

var chunkQueue = self.__miniWebpackChunkQueue__ || (self.__miniWebpackChunkQueue__ = []);
chunkQueue.forEach(registerChunk);             // 处理先于本文件加载的初始共享 chunk
self.__miniWebpackChunkQueue__.push = registerChunk; // 之后的异步 chunk push 即注册

__webpack_require__.e = function (chunkId) {
  if (installedChunks[chunkId] === 0) return Promise.resolve();
  return new Promise(function (resolve, reject) {
    var loaders = chunkLoaders[chunkId] || (chunkLoaders[chunkId] = []);
    loaders.push(function () { resolve(); });
    if (loaders.length === 1) {
      var script = document.createElement('script');
      script.src = '/' + chunkId + '.js';
      script.onerror = reject;
      document.head.appendChild(script);
    }
  });
};

// —— HMR 增量：把工厂表 / 缓存表 / 入口挂到 require 上，运行时才能替换 ——
// 对应真实 webpack 的 __webpack_require__.m 与 .c
__webpack_require__.hotApply = function (moreModules, removed) {
  for (var i = 0; i < removed.length; i++) {
    delete __webpack_require__.m[removed[i]];
    delete __webpack_require__.c[removed[i]];
  }
  for (var moduleId in moreModules) {
    __webpack_require__.m[moduleId] = new Function(
      'module', 'exports', '__webpack_require__', moreModules[moduleId]
    );
    delete __webpack_require__.c[moduleId];
  }
  // 缓存失效后从入口重跑：入口重新 require 变更模块，未变的模块命中缓存直接复用
  delete __webpack_require__.c[__webpack_require__.entry];
  __webpack_require__(__webpack_require__.entry);
};

// bundle 与 HMR client 是两个 <script>，作用域彼此隔离，只能靠 global 桥接。
self.__miniWebpackRequire__ = __webpack_require__;
`;

/** 生成所有产物文件：bundle.js（主 chunk + runtime）+ 各 chunk 文件 */
export function generateAssets(chunks: Chunk[], graph: ModuleGraph, entryId: string): Map<string, string> {
  const files = new Map<string, string>();
  const mainChunk = chunks.find((c) => c.id === 'main')!;

  const mainModulesCode = mainChunk.modules
    .map((id) => `  ${JSON.stringify(id)}: ${moduleFactorySource(graph.get(id)!.code)}`)
    .join(',\n');

  const runtime = RUNTIME
    .replace('__MODULES__', `{\n${mainModulesCode}\n}`)
    .replace('__ENTRY__', JSON.stringify(entryId))
    .replace('__INSTALLED_CHUNKS__', `'main': 0`);

  files.set(
    'bundle.js',
    `(function () {\n${runtime}\n  // 从入口模块启动整个应用\n  __webpack_require__(__webpack_require__.entry);\n})();\n`
  );

  for (const chunk of chunks) {
    if (chunk.id === 'main') continue;
    const chunkModulesCode = chunk.modules
      .map((id) => `  ${JSON.stringify(id)}: ${moduleFactorySource(graph.get(id)!.code)}`)
      .join(',\n');
    files.set(
      `${chunk.id}.js`,
      `(self.__miniWebpackChunkQueue__ = self.__miniWebpackChunkQueue__ || []).push([\n  ${JSON.stringify(chunk.id)},\n  {\n${chunkModulesCode}\n  }\n]);\n`
    );
  }

  return files;
}
