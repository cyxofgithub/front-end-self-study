/**
 * chunk 划分 + splitChunks —— 依赖图构建之后、代码生成之前的「分块」阶段。
 *
 * 对应真实 webpack 的 seal 阶段：把模块分组成 chunk，再应用 optimization.splitChunks。
 * 这里只演示两个核心概念：
 *   1. 动态 import() 的边界 → 一个异步 chunk（代码分割）
 *   2. 被 >=2 个 chunk 使用的模块 → 抽出来单独成 chunk（splitChunks，minChunks: 2）
 * 真实 webpack 还有 cacheGroups.vendors（node_modules 单独抽）、minSize/maxSize 等，逻辑同构。
 */
import type { ModuleGraph } from './graph.js';

export interface Chunk {
  id: string; // chunk 名（也是文件名 stem，如 main / shared / src_lazy）
  entryIds: string[]; // 该 chunk 的入口模块 id（异步 chunk 的入口就是动态 import 的目标）
  modules: string[]; // 落在该 chunk 里的模块 id 列表
  initial: boolean; // 是否启动时随 HTML 加载（true）还是按需加载（false）
}

export interface SplitResult {
  chunks: Chunk[];
  asyncChunkIds: Record<string, string>; // 动态 import 的目标模块 id -> 其 chunk id
}

/** 模块 id -> 异步 chunk id：./src/lazy.js -> src_lazy */
export function asyncChunkId(moduleId: string): string {
  return moduleId.replace(/^\.\//, '').replace(/\//g, '_').replace(/\.(js|css)$/, '');
}

export function splitIntoChunks(graph: ModuleGraph, entryId: string, splitChunks = true): SplitResult {
  // 1. initial chunk：从入口沿「静态依赖」可达的所有模块
  const initial = new Set<string>();
  const queue: string[] = [entryId];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (initial.has(id)) continue;
    initial.add(id);
    for (const dep of Object.values(graph.get(id)!.deps)) queue.push(dep);
  }

  // 2. 每个动态 import 目标，各自形成一个异步 chunk（含其静态可达、且不在 initial 里的子模块）
  const asyncEntries = new Map<string, string>(); // moduleId -> chunkId
  for (const mod of graph.values()) {
    for (const depId of Object.values(mod.asyncDeps)) {
      if (!asyncEntries.has(depId)) asyncEntries.set(depId, asyncChunkId(depId));
    }
  }

  const chunks: Chunk[] = [{ id: 'main', entryIds: [entryId], modules: [...initial], initial: true }];

  for (const [entry, chunkId] of asyncEntries) {
    const modules = new Set<string>();
    const asyncQueue: string[] = [entry];
    while (asyncQueue.length > 0) {
      const id = asyncQueue.shift()!;
      if (modules.has(id) || initial.has(id)) continue;
      modules.add(id);
      for (const dep of Object.values(graph.get(id)!.deps)) asyncQueue.push(dep);
    }
    chunks.push({ id: chunkId, entryIds: [entry], modules: [...modules], initial: false });
  }

  if (splitChunks) extractShared(chunks, graph);

  return { chunks, asyncChunkIds: Object.fromEntries(asyncEntries) };
}

/** splitChunks 核心：被 >=2 个 chunk 使用的模块，抽出来单独成一个 chunk（避免重复打包 + 缓存友好） */
function extractShared(chunks: Chunk[], graph: ModuleGraph): void {
  // moduleId -> 用到它的 chunk id 集合
  const users = new Map<string, Set<string>>();
  const addUser = (moduleId: string, chunkId: string) => {
    if (!graph.has(moduleId)) return;
    const set = users.get(moduleId) ?? new Set<string>();
    set.add(chunkId);
    users.set(moduleId, set);
  };

  for (const chunk of chunks) {
    for (const id of chunk.modules) {
      for (const dep of Object.values(graph.get(id)!.deps)) addUser(dep, chunk.id);
    }
    for (const entry of chunk.entryIds) addUser(entry, chunk.id);
  }

  const sharedIds = [...users.entries()].filter(([, s]) => s.size >= 2).map(([id]) => id);
  if (sharedIds.length === 0) return;

  const sharedSet = new Set(sharedIds);
  // 共享 chunk 是否为 initial：只要有一个用到它的 chunk 是 initial，它就得随 HTML 先加载
  const isInitial = sharedIds.some((id) =>
    [...users.get(id)!].some((chunkId) => chunks.find((c) => c.id === chunkId)?.initial)
  );

  // 从原 chunk 移除共享模块，挪进新的 shared chunk
  for (const chunk of chunks) {
    chunk.modules = chunk.modules.filter((id) => !sharedSet.has(id));
  }
  chunks.push({ id: 'shared', entryIds: [], modules: sharedIds, initial: isInitial });
}
