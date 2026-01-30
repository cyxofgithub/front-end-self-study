# Next.js 7 天学习路径

## 学习目标

完成本学习路径后，你将能够：

-   ✅ 使用 Next.js 独立开发完整的全栈应用
-   ✅ 理解 SSR、SSG、ISR、CSR 等渲染模式的工作原理和使用场景
-   ✅ 掌握 Next.js 的路由系统、数据获取、性能优化等核心功能
-   ✅ 能够部署 Next.js 应用到生产环境

## 前置知识

你已经具备：

-   ✅ React 基础（组件、Hooks、状态管理）
-   ✅ Node.js 基础
-   ✅ Webpack 构建工具理解
-   ✅ SSR 概念理解

需要学习：

-   ⚠️ Next.js App Router
-   ⚠️ Server Components vs Client Components
-   ⚠️ Next.js 数据获取模式

---

## Day 1: 项目搭建与基础概念

### 学什么

1. **Next.js 项目初始化**

    ```bash
    npx create-next-app@latest my-app --typescript --app
    ```

2. **核心文件理解**

    - `app/layout.tsx` - 根布局
    - `app/page.tsx` - 页面组件
    - `app/` 目录结构

3. **App Router vs Pages Router**
    - App Router 是新的路由方式（推荐）
    - 基于文件系统的路由

### 掌握什么

-   ✅ 能够创建和配置 Next.js 项目
-   ✅ 理解文件系统路由的工作原理
-   ✅ 能够创建页面和布局组件

### 实践任务

搭建一个简单的博客首页，包含导航栏和页脚

---

## Day 2: 路由系统

### 学什么

1. **文件系统路由**

    - 基础路由：`app/about/page.tsx` → `/about`
    - 动态路由：`app/blog/[id]/page.tsx` → `/blog/:id`
    - 捕获路由：`app/shop/[...slug]/page.tsx` → `/shop/*`

2. **导航组件**

    - `<Link>` 组件（预取、客户端导航）
    - `useRouter`、`usePathname`、`useSearchParams`

3. **路由状态**
    - `loading.tsx` - 加载状态
    - `error.tsx` - 错误边界

### 掌握什么

-   ✅ 能够实现多页面应用
-   ✅ 能够使用动态路由
-   ✅ 理解客户端路由的工作原理（不刷新页面）

### 实践任务

实现多页面导航（首页、关于、博客列表、博客详情），添加动态路由

---

## Day 3: 数据获取与渲染模式（核心）

### 学什么

1. **Server Components vs Client Components**

    - Server Components（默认）：服务端运行，可直接访问数据库
    - Client Components：需要 `"use client"`，浏览器运行，可使用 Hooks

2. **数据获取方法**

    ```tsx
    // Server Component 中获取数据
    export default async function Page() {
        const data = await fetch('https://api.example.com/data');
        return <div>{data}</div>;
    }
    ```

3. **四种渲染模式**
    - **SSR**：每次请求时渲染（`cache: 'no-store'`）
    - **SSG**：构建时生成（默认）
    - **ISR**：增量静态再生（`revalidate: 3600`）
    - **CSR**：客户端渲染（`"use client"` + `useEffect`）

### 掌握什么

-   ✅ 能够区分和使用 Server/Client Components
-   ✅ 能够根据场景选择合适的渲染模式
-   ✅ 理解 Hydration（水合）原理
-   ✅ 理解数据缓存机制

### 实践任务

实现四种渲染模式的页面：

-   SSR：博客详情页（每次请求获取最新数据）
-   SSG：博客列表页（构建时生成）
-   ISR：带重新验证时间的页面
-   CSR：客户端获取数据的页面

---

## Day 4: 服务端功能

### 学什么

1. **Server Actions**

    ```tsx
    'use server';
    export async function createPost(formData: FormData) {
        // 处理表单数据
    }
    ```

2. **API Routes**

    ```tsx
    // app/api/posts/route.ts
    export async function GET() {
        return Response.json({ posts: [] });
    }
    ```

3. **中间件**
    - `middleware.ts` - 请求拦截和处理
    - Cookies、Headers 读取

### 掌握什么

-   ✅ 能够创建 Server Actions 处理表单提交
-   ✅ 能够创建 API Routes 提供 RESTful API
-   ✅ 能够使用中间件实现认证、重定向等功能

### 实践任务

创建博客 CRUD API，实现表单提交（Server Actions），实现用户认证

---

## Day 5: 样式与性能优化

### 学什么

1. **样式方案**

    - CSS Modules
    - 全局样式

2. **图片优化**

    ```tsx
    import Image from 'next/image';
    <Image src="/image.jpg" width={500} height={300} />;
    ```

3. **性能优化**
    - 代码分割（自动 + `dynamic`）
    - 字体优化（`next/font`）
    - 元数据优化（`metadata` API）

### 掌握什么

-   ✅ 能够优化图片和字体加载
-   ✅ 能够添加 SEO 元数据
-   ✅ 能够分析打包体积

### 实践任务

使用 Tailwind CSS 美化博客页面，优化图片加载，添加 SEO 元数据

---

## Day 6: 高级特性

### 学什么

1. **高级路由**

    - 并行路由（`@folder`）
    - 拦截路由（`(.)`、`(..)`）

2. **数据缓存与重新验证**

    - `revalidatePath`、`revalidateTag`
    - 按需重新验证

3. **错误处理**
    - `error.tsx` - 错误边界
    - `not-found.tsx` - 404 页面

### 掌握什么

-   ✅ 能够使用高级路由特性
-   ✅ 能够控制数据缓存和重新验证
-   ✅ 能够处理错误和 404 页面

### 实践任务

完善博客项目：添加错误处理、404 页面，实现数据缓存和重新验证

---

## Day 7: 部署与总结

### 学什么

1. **部署准备**

    - 环境变量配置
    - 构建优化
    - 生产环境检查

2. **部署平台**

    - Vercel（推荐）
    - 自托管
    - 静态导出

3. **核心原理总结**
    - Next.js 完整渲染流程
    - 请求生命周期

### 掌握什么

-   ✅ 能够部署 Next.js 应用到生产环境
-   ✅ 能够配置环境变量
-   ✅ 理解 Next.js 的构建和部署流程

### 实践任务

部署博客项目到 Vercel，配置环境变量，测试生产环境性能

---

## 核心原理

### Next.js 渲染流程

```
用户请求
  ↓
路由类型判断
  ├─ 静态页面 → SSG: 返回预构建HTML
  ├─ 动态页面 → SSR: 服务端渲染 → HTML + JS → Hydration
  └─ API路由 → 执行API处理函数 → JSON响应
```

### 渲染模式选择

| 模式    | 使用场景     | 特点                   |
| ------- | ------------ | ---------------------- |
| **SSR** | 内容频繁变化 | 每次请求渲染，数据实时 |
| **SSG** | 内容相对静态 | 构建时生成，速度最快   |
| **ISR** | 内容偶尔更新 | 结合 SSG 和 SSR 优点   |
| **CSR** | 高度交互     | 客户端渲染，SEO 不友好 |

### 数据缓存层

-   **Request Memoization**：同一请求中相同 `fetch` 调用自动去重
-   **Data Cache**：`fetch` 默认缓存
-   **Full Route Cache**：SSG 页面完整路由缓存
-   **Router Cache**：客户端路由缓存

---

## 学习资源

-   [Next.js 官方文档](https://nextjs.org/docs)
-   [Next.js Learn 教程](https://nextjs.org/learn)
-   [Next.js GitHub](https://github.com/vercel/next.js)

---

## 学习检查清单

完成学习后，检查以下能力：

### 开发能力

-   [ ] 能够创建和配置 Next.js 项目
-   [ ] 能够实现文件系统路由
-   [ ] 能够使用 Server Components 和 Client Components
-   [ ] 能够根据场景选择合适的渲染模式
-   [ ] 能够创建 API Routes 和 Server Actions
-   [ ] 能够优化图片、字体和元数据
-   [ ] 能够部署应用到生产环境

### 原理理解

-   [ ] 理解文件系统路由的工作原理
-   [ ] 理解 SSR、SSG、ISR 的区别和实现原理
-   [ ] 理解 Hydration 的过程
-   [ ] 理解数据缓存机制
-   [ ] 理解 Server Components 和 Client Components 的区别

---

**预计学习时间**：每天 3-5 小时，共 7 天，总计 21-35 小时

**学习成果**：能够独立开发 Next.js 全栈应用，理解核心渲染原理，掌握性能优化技巧
