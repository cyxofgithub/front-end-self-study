/**
 * 生成 bundle：runtime + 模块 map 拼成一个自执行文件。
 *
 * 这是 webpack 与 Vite 最直观的产物差异：
 * - webpack：浏览器拿到 1 个 bundle，模块被包成函数存在 map 里，靠 __webpack_require__ 调度
 * - Vite   ：浏览器拿到 N 个原生 ESM 文件，模块调度由浏览器自己做，没有 runtime
 *
 * HMR 增量：runtime 额外把模块工厂表、缓存表挂到 __webpack_require__ 上，
 * 这样 server 推来的 hot-update 才能在运行时替换模块工厂并重跑入口。
 * 对应真实 webpack 的 `webpackHotUpdate`（合并模块工厂）+ `hotApply`（重算执行），
 * 这里省略了 `module.hot.accept` 的边界判断，简化成「替换工厂 + 重跑入口」。
 */
import type { ModuleGraph } from './graph.js';

/** webpack runtime 的最小版本：模块缓存 + 递归加载 + HMR 增量接口 */
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

// —— HMR 增量：把工厂表 / 缓存表 / 入口挂到 require 上，运行时才能替换 ——
// 对应真实 webpack 的 __webpack_require__.m 与 .c
__webpack_require__.m = __webpack_modules__;
__webpack_require__.c = __webpack_module_cache__;
__webpack_require__.entry = __ENTRY__;

// 应用一次 hot-update：moreModules 是变更/新增模块的「transformed 代码」，removed 是被删模块 id。
// 真实 webpack 会先拉 hot-update.json 拿变更清单，再执行 hot-update.js 里的
// webpackHotUpdate 合并工厂；这里把两步合成一条 WS 消息，直接增量替换。
__webpack_require__.hotApply = function (moreModules, removed) {
  for (var i = 0; i < removed.length; i++) {
    delete __webpack_require__.m[removed[i]];
    delete __webpack_require__.c[removed[i]];
  }
  for (var moduleId in moreModules) {
    // 把 transformed 代码重新包成模块工厂（等价于 hot-update.js 里的函数定义）
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
// 真实 webpack 把 HMR client 打进 bundle 同享作用域，这里为保持「客户端脚本单独注入」的
// 结构（对齐 webpack-dev-server），用 self 暴露一个入口。
self.__miniWebpackRequire__ = __webpack_require__;
`;

/** 把单个模块的 transformed 代码包成工厂函数源码（generateBundle 与 hot-update 共用同一形状） */
export function moduleFactorySource(code: string): string {
  return `function (module, exports, __webpack_require__) {
${code
  .split('\n')
  .map((l) => '    ' + l)
  .join('\n')}
  }`;
}

export function generateBundle(graph: ModuleGraph, entryId: string): string {
  // 每个模块包成一个函数，key 是模块 ID —— 对应真实 webpack 产物结构
  const modulesCode = [...graph.values()]
    .map((mod) => `  ${JSON.stringify(mod.id)}: ${moduleFactorySource(mod.code)}`)
    .join(',\n');

  const runtime = RUNTIME
    .replace('__MODULES__', `{\n${modulesCode}\n}`)
    .replace('__ENTRY__', JSON.stringify(entryId));

  return `(function () {
${runtime}
  // 从入口模块启动整个应用
  __webpack_require__(__webpack_require__.entry);
})();
`;
}
