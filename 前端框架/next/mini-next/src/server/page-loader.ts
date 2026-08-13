/** 按路由加载服务端构建产物（.mini-next/server/<filePath>.js） */
import path from 'node:path';
import { createRequire } from 'node:module';
import { BUILD_DIR } from '../shared/constants';
import type { AppModule, PageModule } from '../shared/types';

const require_ = createRequire(import.meta.url);

export function loadPageModule(root: string, filePath: string): PageModule {
  return require_(path.join(root, BUILD_DIR, 'server', filePath + '.js')) as PageModule;
}

export function loadAppModule(root: string): AppModule {
  return require_(path.join(root, BUILD_DIR, 'server', '_app.js')) as AppModule;
}
