/**
 * 依赖预构建：从入口扫描 bare import，用 esbuild 打成单文件 ESM，写入 node_modules/.vite/
 * 对应 Vite 的 optimizeDeps，解决 CJS 转 ESM、减少请求数。
 */
import * as esbuild from 'esbuild';
import { readFileSync, mkdirSync, writeFileSync, existsSync, accessSync, unlinkSync } from 'fs';
import path from 'path';
import { getRootDir } from './static.js';

const BARE_IMPORT_RE = /import\s+.*\s+from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;

function collectBareImports(entryPath: string, root: string, seen = new Set<string>()): string[] {
  if (seen.has(entryPath)) return [];
  seen.add(entryPath);
  const code = readFileSync(entryPath, 'utf-8');
  const deps: string[] = [];
  let m: RegExpExecArray | null;
  BARE_IMPORT_RE.lastIndex = 0;
  while ((m = BARE_IMPORT_RE.exec(code)) !== null) {
    const spec = m[1] ?? m[2];
    if (spec.startsWith('.') || spec.startsWith('/')) {
      const resolved = path.resolve(path.dirname(entryPath), spec);
      let found = false;
      for (const ext of ['.js', '.ts', '.jsx', '.tsx', '']) {
        const p = ext ? resolved + ext : resolved;
        try {
          if (existsSync(p)) {
            accessSync(p);
            deps.push(...collectBareImports(p, root, seen));
            found = true;
            break;
          }
        } catch {
          // skip
        }
      }
      continue;
    }
    if (!spec.startsWith('node:') && !seen.has(spec)) {
      deps.push(spec);
      seen.add(spec);
    }
  }
  return [...new Set(deps)];
}

export async function runPrebundle(root: string): Promise<string> {
  const entry = path.join(root, 'src', 'main.js');
  console.log("🚀 ~ runPrebundle ~ entry:", entry)
  const deps = collectBareImports(entry, root);
  console.log("🚀 ~ runPrebundle ~ deps:", deps)
  if (deps.length === 0) {
    return '';
  }
  const outDir = path.join(root, 'node_modules', '.vite');
  mkdirSync(outDir, { recursive: true });
  const virtualEntry = path.join(outDir, '_entry.mjs');
  console.log("🚀 ~ runPrebundle ~ virtualEntry:", virtualEntry)
  const content = deps.map((d) => `export * from '${d}';`).join('\n');
  console.log("🚀 ~ runPrebundle ~ content:", content)
  writeFileSync(virtualEntry, content, 'utf-8');

  const outFile = path.join(outDir, 'deps.js');
  await esbuild.build({
    entryPoints: [virtualEntry],
    bundle: true,
    format: 'esm',
    outfile: outFile,
    platform: 'browser',
    target: 'esnext',
    write: true,
  });
  try {
    unlinkSync(virtualEntry);
  } catch {
    // ignore
  }
  return outFile;
}

export async function ensurePrebundle(): Promise<string> {
  const root = getRootDir();
  console.log("🚀 ~ ensurePrebundle ~ root:", root)
  return runPrebundle(root);
}
