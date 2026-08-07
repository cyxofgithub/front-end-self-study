import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';

/**
 * 【企业级考点】CRXJS 做了什么？
 *  - 读取 TS 定义的 manifest，把其中的入口（service worker / content scripts /
 *    popup / options 的 HTML）全部接入 Vite 构建管线
 *  - dev 模式：提供 HMR，content script / popup 改动即时生效，
 *    不用每次去 chrome://extensions 手动点刷新
 *  - build 模式：产出标准 MV3 目录结构（dist/），可直接打包上传商店
 *  - manifest 用 TS 定义 → 类型校验、环境变量注入（dev/prod 差异化）
 */
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  // 企业级惯例：service worker 打包为 iife（MV3 SW 暂不支持 ESM 动态 import 分块）
  build: {
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
});
