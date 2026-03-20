# Next.js Demo 部署指南

本指南将帮助你部署 Next.js Demo 项目到生产环境。

## 部署前准备

### 1. 环境变量配置

1. 复制 `.env.example` 文件为 `.env.local`：

    ```bash
    cp .env.example .env.local
    ```

2. 填写必要的环境变量：

    ```bash
    NEXT_PUBLIC_API_URL=https://your-api-url.com
    NEXTAUTH_SECRET=your-secret-key-here
    # ... 其他变量
    ```

3. **重要**：确保 `.env.local` 已添加到 `.gitignore`，不会被提交到版本控制。

### 2. 构建优化检查

运行生产构建检查：

```bash
# 安装依赖
npm install
# 或
yarn install

# 构建生产版本
npm run build
# 或
yarn build

# 检查构建输出
# 查看 .next 目录中的构建文件
```

### 3. 构建分析

分析打包体积：

```bash
# 安装分析工具
npm install @next/bundle-analyzer

# 在 next.config.js 中配置后运行
ANALYZE=true npm run build
```

## 部署选项

### 选项 1: Vercel（推荐）

Vercel 是 Next.js 的创建者，提供最佳的 Next.js 部署体验。

#### 步骤：

1. **安装 Vercel CLI**：

    ```bash
    npm i -g vercel
    ```

2. **登录 Vercel**：

    ```bash
    vercel login
    ```

3. **部署项目**：

    ```bash
    vercel
    ```

    或者直接通过 GitHub 集成：

    - 访问 [vercel.com](https://vercel.com)
    - 点击 "Import Project"
    - 连接你的 GitHub 仓库
    - Vercel 会自动检测 Next.js 项目并配置

4. **配置环境变量**：

    - 在 Vercel 项目设置中添加环境变量
    - 确保所有 `NEXT_PUBLIC_*` 变量都已设置

5. **自动部署**：
    - 每次推送到主分支会自动触发部署
    - 每个 Pull Request 会创建预览部署

#### Vercel 优势：

-   ✅ 零配置部署
-   ✅ 自动 HTTPS
-   ✅ 全球 CDN
-   ✅ 自动优化
-   ✅ 预览部署
-   ✅ 分析工具

### 选项 2: 自托管（Node.js）

#### 使用 PM2：

1. **安装 PM2**：

    ```bash
    npm install -g pm2
    ```

2. **构建项目**：

    ```bash
    npm run build
    ```

3. **启动应用**：

    ```bash
    pm2 start npm --name "nextjs-demo" -- start
    ```

4. **保存 PM2 配置**：
    ```bash
    pm2 save
    pm2 startup
    ```

#### 使用 Docker：

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

构建和运行：

```bash
docker build -t nextjs-demo .
docker run -p 3000:3000 nextjs-demo
```

### 选项 3: 静态导出

如果你的应用可以完全静态化：

1. **更新 next.config.js**：

    ```javascript
    const nextConfig = {
        output: 'export',
        images: {
            unoptimized: true, // 静态导出需要禁用图片优化
        },
    };
    ```

2. **构建静态文件**：

    ```bash
    npm run build
    ```

3. **部署到静态托管**：
    - 将 `out` 目录的内容部署到：
        - Netlify
        - GitHub Pages
        - AWS S3 + CloudFront
        - 任何静态文件服务器

## 生产环境检查清单

### 性能优化

-   [ ] 启用图片优化（使用 `next/image`）
-   [ ] 启用字体优化（使用 `next/font`）
-   [ ] 配置代码分割（使用 `dynamic` import）
-   [ ] 检查并优化 bundle 大小
-   [ ] 启用压缩（`compress: true`）

### 安全性

-   [ ] 检查并设置安全 headers
-   [ ] 确保环境变量不暴露敏感信息
-   [ ] 使用 HTTPS
-   [ ] 检查依赖漏洞：`npm audit`

### SEO

-   [ ] 为所有页面添加 metadata
-   [ ] 配置 Open Graph 标签
-   [ ] 添加 sitemap.xml
-   [ ] 添加 robots.txt

### 监控和分析

-   [ ] 设置错误监控（如 Sentry）
-   [ ] 配置分析工具（如 Google Analytics）
-   [ ] 设置性能监控
-   [ ] 配置日志记录

## 常见问题

### 1. 构建失败

**问题**：`npm run build` 失败

**解决方案**：

-   检查 TypeScript 错误
-   确保所有依赖已安装
-   检查环境变量配置
-   查看构建日志中的具体错误信息

### 2. 图片不显示

**问题**：外部图片无法加载

**解决方案**：

-   在 `next.config.js` 中添加图片域名到 `remotePatterns`
-   检查图片 URL 是否正确
-   确保图片服务器允许跨域访问

### 3. API 路由 404

**问题**：API 路由在生产环境返回 404

**解决方案**：

-   确保使用 Node.js 运行时（不是静态导出）
-   检查路由路径是否正确
-   确保中间件配置正确

### 4. 环境变量未生效

**问题**：环境变量在生产环境不工作

**解决方案**：

-   `NEXT_PUBLIC_*` 变量需要在构建时设置
-   服务器端变量需要在运行时设置
-   重新构建应用以应用新的环境变量

## 性能优化建议

1. **使用 ISR**：对于不经常更新的内容，使用 ISR 而不是 SSR
2. **代码分割**：使用 `dynamic` import 延迟加载大型组件
3. **图片优化**：始终使用 `next/image` 组件
4. **字体优化**：使用 `next/font` 优化字体加载
5. **缓存策略**：合理使用 `revalidatePath` 和 `revalidateTag`

## 资源

-   [Next.js 部署文档](https://nextjs.org/docs/deployment)
-   [Vercel 部署指南](https://vercel.com/docs)
-   [Next.js 性能优化](https://nextjs.org/docs/app/building-your-application/optimizing)

## 支持

如果遇到部署问题，请检查：

1. Next.js 官方文档
2. Vercel 文档（如果使用 Vercel）
3. GitHub Issues
4. Next.js Discord 社区
