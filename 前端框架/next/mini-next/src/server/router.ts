/**
 * 文件系统路由：扫描 pages/ 目录，把文件路径映射为路由表。
 * 这是 Next.js「约定优于配置」的入口——路由不是注册出来的，是目录结构推导出来的。
 */
import fs from 'node:fs';
import path from 'node:path';
import { RouteEntry, sortRoutes } from '../shared/route-match';

export interface RouteTables {
  /** 页面路由（pages/ 下除 _app 与 api/ 之外的文件） */
  pageRoutes: RouteEntry[];
  /** API 路由（pages/api/ 下的文件） */
  apiRoutes: RouteEntry[];
}

const PAGE_EXT = /\.(tsx?|jsx?)$/;

/** 'posts/[id]' -> '/posts/[id]'；'index' -> '/'；'posts/index' -> '/posts' */
function filePathToPattern(filePath: string): string {
  const withoutExt = filePath.replace(PAGE_EXT, '');
  if (withoutExt === 'index') return '/';
  return '/' + withoutExt.replace(/\/index$/, '');
}

function walk(dir: string, base: string): string[] {
  const files: string[] = [];
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    if (fs.statSync(abs).isDirectory()) {
      files.push(...walk(abs, base));
    } else if (PAGE_EXT.test(name)) {
      files.push(path.relative(base, abs).split(path.sep).join('/'));
    }
  }
  return files;
}

export function scanPages(pagesDir: string): RouteTables {
  const pageRoutes: RouteEntry[] = [];
  const apiRoutes: RouteEntry[] = [];

  for (const file of walk(pagesDir, pagesDir)) {
    const noExt = file.replace(PAGE_EXT, '');
    if (path.basename(noExt).startsWith('_')) continue; // _app 等特殊文件不是路由
    const entry: RouteEntry = { pattern: filePathToPattern(file), filePath: noExt };
    if (noExt.startsWith('api/')) {
      apiRoutes.push(entry);
    } else {
      pageRoutes.push(entry);
    }
  }

  return { pageRoutes: sortRoutes(pageRoutes), apiRoutes: sortRoutes(apiRoutes) };
}
