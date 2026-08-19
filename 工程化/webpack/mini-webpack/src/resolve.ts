/**
 * 模块解析：把 import 里的 specifier 解析成磁盘上的真实路径。
 *
 * 对应 webpack 的 enhanced-resolve。webpack 与 Vite 在这一步的区别：
 * - webpack：构建时在 Node 侧解析全部模块（含 node_modules），结果进依赖图
 * - Vite  ：开发态只把 bare specifier 重写成预构建产物 URL，由浏览器再发请求
 */
import { existsSync, readFileSync, statSync } from 'fs';
import path from 'path';

const EXTENSIONS = ['.js', '.mjs', '.json', '.css'];

/** 尝试补全扩展名 / 目录 index */
function tryExtensions(basePath: string): string | null {
  if (existsSync(basePath) && statSync(basePath).isFile()) return basePath;
  for (const ext of EXTENSIONS) {
    const withExt = basePath + ext;
    if (existsSync(withExt)) return withExt;
  }
  // 目录：找 index
  if (existsSync(basePath) && statSync(basePath).isDirectory()) {
    for (const ext of EXTENSIONS) {
      const indexFile = path.join(basePath, 'index' + ext);
      if (existsSync(indexFile)) return indexFile;
    }
  }
  return null;
}

/** 从 node_modules 里找包入口：优先 module（ESM）字段，退回 main，再退回 index.js */
function resolveBare(specifier: string, importerDir: string, root: string): string | null {
  let dir = importerDir;
  while (true) {
    const pkgDir = path.join(dir, 'node_modules', specifier);
    const pkgJson = path.join(pkgDir, 'package.json');
    if (existsSync(pkgJson)) {
      const pkg = JSON.parse(readFileSync(pkgJson, 'utf-8')) as {
        module?: string;
        main?: string;
      };
      const entry = pkg.module ?? pkg.main ?? 'index.js';
      const resolved = tryExtensions(path.join(pkgDir, entry));
      if (resolved) return resolved;
    }
    // 也支持 node_modules/<specifier> 直接是文件的情况
    const direct = tryExtensions(path.join(dir, 'node_modules', specifier));
    if (direct) return direct;

    const parent = path.dirname(dir);
    if (parent === dir || !dir.startsWith(root)) break;
    dir = parent;
  }
  return null;
}

export function resolveModule(specifier: string, importerFile: string, root: string): string | null {
  const importerDir = path.dirname(importerFile);
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    return tryExtensions(path.resolve(importerDir, specifier));
  }
  return resolveBare(specifier, importerDir, root);
}
