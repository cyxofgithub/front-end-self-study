/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http'
// @ts-expect-error - Vite types may not be resolved in some IDEs, but the module exists
import { defineConfig } from 'vite'
// @ts-expect-error - Vite plugin types may not be resolved in some IDEs, but the module exists
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { readFileSync, existsSync } from 'fs'

export default defineConfig({
  plugins: [
    {
      name: 'serve-packages-dist',
      enforce: 'pre',
      configureServer(server: any) {
        // Register middleware directly, not in a callback
        // This ensures it runs before Vite's module resolution middleware
        server.middlewares.use('/packages', (req: IncomingMessage, res: ServerResponse, _next: () => void) => {
          // 移除查询参数（如 ?import）以获取实际文件路径
          const urlPath = req.url?.split('?')[0] || ''
          const packagesPath = path.resolve(__dirname, '../../packages')
          const filePath = path.join(packagesPath, urlPath)
          
          // 安全检查：确保请求的文件在 packages 目录内
          if (!filePath.startsWith(packagesPath)) {
            res.statusCode = 403
            res.end('Forbidden')
            return
          }
          
          // 检查文件是否存在
          if (existsSync(filePath)) {
            const content = readFileSync(filePath)
            const ext = path.extname(filePath)
            
            // 设置正确的 Content-Type
            const contentTypeMap: Record<string, string> = {
              '.js': 'application/javascript',
              '.mjs': 'application/javascript',
              '.json': 'application/json',
              '.map': 'application/json',
            }
            
            const contentType = contentTypeMap[ext] || 'application/octet-stream'
            res.setHeader('Content-Type', contentType)
            // 对于 ESM 模块，设置 CORS 头以支持跨域导入
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'GET')
            res.end(content)
          } else {
            res.statusCode = 404
            res.end('Not Found')
          }
        })
      },
    },
    vue(),
  ],
  resolve: {
    alias: {
      'sdk-a': path.resolve(__dirname, '../../packages/sdk-a/src'),
      'sdk-b': path.resolve(__dirname, '../../packages/sdk-b/src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    // 配置静态资源，允许访问打包后的 SDK 文件
    fs: {
      allow: ['..'],
    },
  },
})
