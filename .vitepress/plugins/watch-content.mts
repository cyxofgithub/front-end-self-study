import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG_DIR = path.join(ROOT, '.vitepress');
const CONFIG_FILES = ['config.mts', 'config.mjs', 'config.ts', 'config.js'];

/**
 * 获取当前使用的配置文件路径（用于 touch 触发重载）
 */
function getConfigPath(): string | null {
  for (const name of CONFIG_FILES) {
    const p = path.join(CONFIG_DIR, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Touch 配置文件，触发 Vite 重新加载配置，从而使 vitepress-sidebar 重新扫描并更新侧边栏
 */
function touchConfig(): void {
  const configPath = getConfigPath();
  if (!configPath) return;
  try {
    const now = new Date();
    fs.utimesSync(configPath, now, now);
  } catch {
    // 忽略 utimes 失败（如只读文件系统）
  }
}

/**
 * 是否为内容目录下的 .md 文件（排除 .vitepress、node_modules 等）
 */
function isContentMd(filePath: string): boolean {
  const normalized = path.normalize(filePath);
  if (!normalized.endsWith('.md')) return false;
  const relative = path.relative(ROOT, normalized);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return false;
  const segments = relative.split(path.sep);
  const ignore = ['.vitepress', 'node_modules', '.git', 'dist', 'code', 'demo'];
  return !segments.some((seg) => ignore.includes(seg));
}

/** 与 Vite Plugin 兼容的插件形状，避免直接依赖 vite 类型 */
interface VitePlugin {
  name: string;
  apply?: 'serve' | 'build';
  configureServer?(server: { watcher: { on(event: string, cb: (path: string) => void): void } }): void;
}

/**
 * Vite 插件：监听内容目录下 .md 的新增/删除，touch 配置文件以触发热更新与侧边栏刷新
 */
export function watchContentPlugin(): VitePlugin {
  return {
    name: 'vitepress-watch-content',
    apply: 'serve',
    configureServer(server) {
      const watcher = server.watcher;
      const onContentChange = (filePath: string) => {
        if (!isContentMd(filePath)) return;
        touchConfig();
      };
      watcher.on('add', onContentChange);
      watcher.on('unlink', onContentChange);
    }
  };
}
