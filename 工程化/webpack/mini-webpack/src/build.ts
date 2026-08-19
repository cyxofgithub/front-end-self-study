/**
 * 构建入口：跑一次完整打包，并打印耗时与模块数。
 * 与 mini-vite 对比时看这两个数字：模块越多，这里越慢；mini-vite 启动几乎不变。
 */
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { buildModuleGraph } from './graph.js';
import { generateBundle } from './bundle.js';
import { getRootDir } from './paths.js';

export function build(): { bundle: string; moduleCount: number; cost: number } {
  const root = getRootDir();
  const entry = path.join(root, 'src', 'main.js');

  const start = performance.now();
  const { graph, entryId } = buildModuleGraph(entry, root);
  const bundle = generateBundle(graph, entryId);
  const cost = performance.now() - start;

  return { bundle, moduleCount: graph.size, cost };
}

function main(): void {
  const root = getRootDir();
  const { bundle, moduleCount, cost } = build();

  const outDir = path.join(root, 'dist');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, 'bundle.js'), bundle, 'utf-8');

  console.log(`[mini-webpack] 遍历模块数: ${moduleCount}`);
  console.log(`[mini-webpack] 打包耗时: ${cost.toFixed(1)}ms`);
  console.log(`[mini-webpack] 产物: ${path.join(outDir, 'bundle.js')}`);
  console.log('\n注意：以上工作在每次启动 dev server 时都要做一遍（Vite 则不做）。');
}

// 直接执行时才跑 main（被 server.ts import 时不执行）
if (process.argv[1]?.endsWith('build.ts')) {
  main();
}
