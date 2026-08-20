/**
 * 依赖图构建 —— webpack 与 Vite 的分水岭就在这个文件。
 *
 * webpack：启动时从 entry 递归遍历**全部**模块，每个都读盘 + 过 loader + 转换 import。
 *         耗时 ∝ 项目模块总数，这就是「大项目启动几十秒」的根因。
 * Vite  ：启动时**不做这件事**，只预构建 node_modules；业务模块等浏览器请求到再单独转换。
 *
 * 运行 `pnpm build` 会打印遍历了多少模块，可直观看到工作量。
 */
import { readFileSync } from 'fs';
import path from 'path';
import { runLoaders } from './loader.js';
import { resolveModule } from './resolve.js';

export interface ModuleInfo {
  id: string; // 相对 root 的路径，作为模块 ID（对应 webpack 的 moduleId）
  filePath: string;
  code: string; // 经过 loader + import 改写后的代码
  deps: Record<string, string>; // 静态 import：specifier -> 依赖模块 id
  asyncDeps: Record<string, string>; // 动态 import()：specifier -> 依赖模块 id
}

export type ModuleGraph = Map<string, ModuleInfo>;

/** 匹配静态 import 语句，捕获 specifier */
const IMPORT_RE = /import\s+(?:([\w*{}\s,]+)\s+from\s+)?['"]([^'"]+)['"]/g;

/** 匹配动态 import()（注意：不带空格的 `import(` 不会被上面的 IMPORT_RE 命中） */
const DYNAMIC_IMPORT_RE = /import\(\s*['"]([^'"]+)['"]\s*\)/g;

function toId(filePath: string, root: string): string {
  return './' + path.relative(root, filePath).replace(/\\/g, '/');
}

/**
 * 把 ESM 语法改写成 webpack runtime 能执行的 CJS 风格调用。
 * 真实 webpack 用 AST（acorn）精确改写，这里用正则做最小演示。
 * 只改写静态 import/export；动态 import() 留到 chunk 划分之后（见 transformAsyncImports）。
 */
function transformToRuntime(code: string, deps: Record<string, string>): string {
  let out = code.replace(IMPORT_RE, (_full, binding: string | undefined, spec: string) => {
    const depId = deps[spec];
    if (!depId) return '';
    if (!binding) return `__webpack_require__(${JSON.stringify(depId)});`;

    const named = binding.trim();
    // import { a, b } from 'x'  →  const { a, b } = __webpack_require__('x')
    if (named.startsWith('{')) {
      return `const ${named} = __webpack_require__(${JSON.stringify(depId)});`;
    }
    // import * as ns from 'x'
    if (named.startsWith('*')) {
      const ns = named.replace(/\*\s*as\s*/, '');
      return `const ${ns} = __webpack_require__(${JSON.stringify(depId)});`;
    }
    // import def from 'x'  →  取 default
    return `const ${named} = __webpack_require__(${JSON.stringify(depId)}).default;`;
  });

  // export 改写
  out = out
    .replace(/export\s+default\s+/g, 'exports.default = ')
    .replace(/export\s+(const|let|var)\s+(\w+)\s*=/g, '$1 $2 = exports.$2 =')
    .replace(/export\s+function\s+(\w+)/g, 'exports.$1 = function $1')
    .replace(/export\s*\{([^}]+)\}\s*;?/g, (_m, names: string) =>
      names
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean)
        .map((n) => `exports.${n} = ${n};`)
        .join('\n')
    );

  return out;
}

/** 从入口递归构建完整依赖图 —— 这是 webpack 启动慢的核心工作量 */
export function buildModuleGraph(entryFile: string, root: string): { graph: ModuleGraph; entryId: string } {
  const graph: ModuleGraph = new Map();
  const entryId = toId(entryFile, root);

  // 广度优先遍历，等价于 webpack 的 make 阶段
  const queue: string[] = [entryFile];

  while (queue.length > 0) {
    const filePath = queue.shift()!;
    const id = toId(filePath, root);
    if (graph.has(id)) continue;

    // 1. 读文件
    const raw = readFileSync(filePath, 'utf-8');
    // 2. 过 loader 链（CSS 等非 JS 在此变成 JS）
    const loaded = runLoaders(raw, filePath);

    // 3. 收集依赖并解析路径（静态 import 与动态 import 分开记录）
    const deps: Record<string, string> = {};
    const asyncDeps: Record<string, string> = {};

    IMPORT_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = IMPORT_RE.exec(loaded)) !== null) {
      const spec = m[2];
      const resolved = resolveModule(spec, filePath, root);
      if (!resolved) {
        console.warn(`[mini-webpack] 无法解析 "${spec}"（来自 ${id}）`);
        continue;
      }
      deps[spec] = toId(resolved, root);
      queue.push(resolved);
    }

    DYNAMIC_IMPORT_RE.lastIndex = 0;
    while ((m = DYNAMIC_IMPORT_RE.exec(loaded)) !== null) {
      const spec = m[1];
      const resolved = resolveModule(spec, filePath, root);
      if (!resolved) {
        console.warn(`[mini-webpack] 无法解析动态 import "${spec}"（来自 ${id}）`);
        continue;
      }
      asyncDeps[spec] = toId(resolved, root);
      queue.push(resolved);
    }

    // 4. 改写成 runtime 可执行的代码（静态部分；动态 import 之后由 transformAsyncImports 改）
    const code = transformToRuntime(loaded, deps);
    graph.set(id, { id, filePath, code, deps, asyncDeps });
  }

  return { graph, entryId };
}

/**
 * 动态 import 改写 —— 必须在 chunk 划分之后，因为需要知道目标模块落在哪个 chunk。
 * import('./lazy.js')  →  __webpack_require__.e("src_lazy").then(() => __webpack_require__("./src/lazy.js"))
 * 对应真实 webpack 的 import() 异步加载 + __webpack_require__.e 拉 chunk。
 */
export function transformAsyncImports(graph: ModuleGraph, asyncChunkIds: Record<string, string>): void {
  for (const mod of graph.values()) {
    DYNAMIC_IMPORT_RE.lastIndex = 0;
    mod.code = mod.code.replace(DYNAMIC_IMPORT_RE, (_full, spec: string) => {
      const moduleId = mod.asyncDeps[spec];
      const chunkId = moduleId ? asyncChunkIds[moduleId] : undefined;
      if (!chunkId) return _full;
      return `__webpack_require__.e(${JSON.stringify(chunkId)}).then(function () { return __webpack_require__(${JSON.stringify(moduleId)}); })`;
    });
  }
}
