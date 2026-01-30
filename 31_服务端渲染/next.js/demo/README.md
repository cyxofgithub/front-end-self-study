# Next.js Day 1-7 演示项目

一个全面的演示项目，涵盖 Next.js 学习路径中 Day 1 到 Day 7 的完整知识体系。

## Day 1: 项目搭建

### App Router

-   **概念**: 基于 `app/` 目录的 Next.js 13+ 路由系统，使用文件系统定义路由
-   **Demo**: `app/layout.tsx`、`app/page.tsx`

### 布局组件

-   **概念**: `layout.tsx` 包裹所有页面并提供共享 UI，可以嵌套
-   **Demo**: `app/layout.tsx`

### 页面组件

-   **概念**: `page.tsx` 定义路由页面，每个路由段都需要一个 page.tsx
-   **Demo**: `app/page.tsx`（首页）

## Day 2: 路由系统

### 基础路由

-   **概念**: 基于文件系统的路由，文件夹名称对应 URL 路径
-   **Demo**: `app/about/page.tsx` → `/about`

### 动态路由

-   **概念**: 使用 `[param]` 语法创建动态路由段，通过 `params` 获取参数
-   **Demo**: `app/blog/[id]/page.tsx` → `/blog/1`、`/blog/2`

### 导航

-   **概念**: `Link` 组件实现客户端导航，无需刷新页面；`usePathname` 获取当前路径
-   **Demo**: `components/Navigation.tsx`

### 加载状态

-   **概念**: `loading.tsx` 在页面加载时自动显示加载 UI
-   **Demo**: `app/blog/[id]/loading.tsx`

### 错误边界

-   **概念**: `error.tsx` 捕获路由级别的错误并显示错误 UI
-   **Demo**: `app/blog/[id]/error.tsx`

## Day 3: 渲染模式

### SSR (服务端渲染)

-   **概念**: 每次请求时在服务器上生成 HTML，内容始终最新
-   **Demo**: `app/blog/[id]/page.tsx`（使用 `export const dynamic = 'force-dynamic'`）

### SSG (静态站点生成)

-   **概念**: 构建时预生成 HTML，适合内容不经常变化的页面
-   **Demo**: `app/blog/page.tsx`（默认行为）

### ISR (增量静态再生)

-   **概念**: 静态生成 + 定期重新生成，平衡性能和内容新鲜度
-   **Demo**: `app/isr-demo/page.tsx`（使用 `export const revalidate = 3600`）

### CSR (客户端渲染)

-   **概念**: 在浏览器中渲染，使用 `'use client'` 和 `useEffect` 获取数据
-   **Demo**: `app/csr-demo/page.tsx`

### 水合 (Hydration)

-   **概念**: React 在服务端渲染后，在客户端"激活"页面的过程，使静态 HTML 变为可交互的 React 应用
-   **Demo**: `app/hydration-demo/page.tsx`

## Day 4: 服务端功能

### Server Actions

-   **概念**: 使用 `'use server'` 创建服务端函数，可直接在表单中使用，无需 API 路由
-   **Demo**: `lib/actions.ts`、`app/blog-admin/page.tsx`

### API Routes

-   **概念**: 在 `app/api/` 目录创建 RESTful API 端点，支持所有 HTTP 方法
-   **Demo**: `app/api/posts/route.ts`、`app/api/posts/[id]/route.ts`、`app/api-demo/page.tsx`

### Middleware

-   **概念**: 在每个请求之前运行，可以修改请求/响应、重定向、设置 headers
-   **Demo**: `middleware.ts`（保护路由、添加 headers、重定向）

## Day 5: 性能优化

### 图片优化

-   **概念**: `next/image` 组件自动优化图片格式（WebP/AVIF）、懒加载、防止布局偏移
-   **Demo**: `app/image-optimization-demo/page.tsx`

### 字体优化

-   **概念**: `next/font` 自动字体子集化、零布局偏移、优化字体加载
-   **Demo**: `app/layout.tsx`

### 元数据优化

-   **概念**: 导出 `metadata` 对象或 `generateMetadata` 函数，优化 SEO 和 Open Graph
-   **Demo**: 各个页面组件中的 `metadata` 导出

### 代码分割

-   **概念**: 使用 `dynamic` import 按需加载组件，减少初始 bundle 大小
-   **Demo**: `app/code-splitting-demo/page.tsx`、`app/code-splitting-demo/HeavyComponent.tsx`

## Day 6: 高级特性

### 并行路由

-   **概念**: 使用 `@folder` 语法创建插槽，同时渲染多个路由段，每个插槽有独立的加载/错误状态
-   **Demo**: `app/parallel-routes-demo/layout.tsx`、`app/parallel-routes-demo/@analytics/`、`app/parallel-routes-demo/@dashboard/`

### 拦截路由

-   **概念**: 使用 `(.)`、`(..)` 等前缀拦截路由，可以显示模态框而不是导航
-   **Demo**: `app/(.)blog/[id]/page.tsx`（拦截 `/blog/[id]` 路由）

### 缓存重新验证

-   **概念**: 使用 `revalidatePath` 和 `revalidateTag` 按需更新缓存内容
-   **Demo**: `app/cache-demo/page.tsx`

### 错误处理

-   **概念**: `error.tsx` 创建错误边界，`not-found.tsx` 创建自定义 404 页面
-   **Demo**: `app/error.tsx`、`app/not-found.tsx`、`app/blog/[id]/error.tsx`

## Day 7: 部署

### 环境变量配置

-   **概念**: `NEXT_PUBLIC_*` 变量暴露给浏览器，其他变量仅在服务器端可用
-   **Demo**: `.env.example`

### 构建优化

-   **概念**: `next.config.js` 配置图片优化、压缩、代码分割、安全 headers
-   **Demo**: `next.config.js`

### 部署

-   **概念**: 支持 Vercel、自托管、静态导出等多种部署方式
-   **Demo**: 参考 [DEPLOYMENT.md](./DEPLOYMENT.md)
