/**
 * 按需编译与 import 重写：对 /src/* 请求读文件，用 esbuild.transform 转 TS/JSX，
 * 并将 bare specifier 改为预构建 URL。
 */
import * as esbuild from 'esbuild';
import { readFileSync } from 'fs';
import path from 'path';
import { getRootDir } from './static.js';

const BARE_IMPORT_RE = /import\s+([^'"]*)\s+from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;

function rewriteBareImports(code: string, prebundleUrl: string): string {
  return code.replace(BARE_IMPORT_RE, (full, named?: string, from?: string, from2?: string) => {
    const spec = from ?? from2 ?? '';
    if (spec.startsWith('.') || spec.startsWith('/')) return full;
    if (spec.startsWith('node:')) return full;
    const newUrl = `${prebundleUrl}?t=${Date.now()}`;
    if (named !== undefined && from !== undefined) {
      return `import ${named} from '${newUrl}'`;
    }
    return `import '${newUrl}'`;
  });
}

export async function transform(
  filePath: string,
  code: string,
  loader: 'js' | 'ts' | 'jsx' | 'tsx'
): Promise<string> {
  const result = await esbuild.transform(code, {
    loader: loader === 'ts' || loader === 'tsx' ? loader : 'js',
    format: 'esm',
    target: 'esnext',
  });
  return rewriteBareImports(result.code, '/node_modules/.vite/deps.js');
}

export function resolveSrcPath(root: string, urlPath: string): string | null {
  const normalized = urlPath.replace(/^\//, '').split('?')[0];
  if (!normalized.startsWith('src/')) return null;
  const filePath = path.join(root, normalized);
  if (!filePath.startsWith(path.resolve(root))) return null;
  return filePath;
}

export function getLoader(filePath: string): 'js' | 'ts' | 'jsx' | 'tsx' {
  const ext = path.extname(filePath);
  if (ext === '.ts') return 'ts';
  if (ext === '.tsx') return 'tsx';
  if (ext === '.jsx') return 'jsx';
  return 'js';
}

export async function transformRequest(urlPath: string): Promise<{ code: string } | { err: string }> {
  const root = getRootDir();
  const filePath = resolveSrcPath(root, urlPath);
  if (!filePath) return { err: 'not a src request' };
  try {
    const code = readFileSync(filePath, 'utf-8');
    const loader = getLoader(filePath);
    const transformed = await transform(filePath, code, loader);
    return { code: transformed };
  } catch (e) {
    return { err: e instanceof Error ? e.message : String(e) };
  }
}
