/**
 * 构建入口：跑一次完整打包，并打印耗时、模块数与 chunk 数。
 * 与 mini-vite 对比时看这两个数字：模块越多，这里越慢；mini-vite 启动几乎不变。
 */
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { buildModuleGraph, transformAsyncImports } from './graph.js';
import { splitIntoChunks } from './chunk.js';
import { generateAssets } from './bundle.js';
import { getRootDir } from './paths.js';

export interface BuildResult {
  files: Map<string, string>; // 文件名 -> 内容（bundle.js + 各 chunk）
  chunks: string[];
  moduleCount: number;
  cost: number;
}

export function build(): BuildResult {
  const root = getRootDir();
  const entry = path.join(root, 'src', 'main.js');

  const start = performance.now();
  // 完整管线：建依赖图 → 分 chunk（含 splitChunks）→ 改写动态 import → 生成产物
  const { graph, entryId } = buildModuleGraph(entry, root);
  const { chunks, asyncChunkIds } = splitIntoChunks(graph, entryId);
  transformAsyncImports(graph, asyncChunkIds);
  const files = generateAssets(chunks, graph, entryId);
  const cost = performance.now() - start;

  return { files, chunks: chunks.map((c) => c.id), moduleCount: graph.size, cost };
}

function main(): void {
  const root = getRootDir();
  const { files, chunks, moduleCount, cost } = build();

  const outDir = path.join(root, 'dist');
  mkdirSync(outDir, { recursive: true });
  for (const [name, content] of files) {
    writeFileSync(path.join(outDir, name), content, 'utf-8');
  }

  console.log(`[mini-webpack] 遍历模块数: ${moduleCount}`);
  console.log(`[mini-webpack] chunk 数: ${chunks.length}（${chunks.join(', ')}）`);
  console.log(`[mini-webpack] 打包耗时: ${cost.toFixed(1)}ms`);
  console.log(`[mini-webpack] 产物: ${[...files.keys()].join(', ')}`);
  console.log('\n注意：以上工作在每次启动 dev server 时都要做一遍（Vite 则不做）。');
}

// 直接执行时才跑 main（被 server.ts import 时不执行）
if (process.argv[1]?.endsWith('build.ts')) {
  main();
}
