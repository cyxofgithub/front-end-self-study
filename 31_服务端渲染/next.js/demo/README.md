# Next.js Day 1-7 演示项目

一个全面的演示项目，涵盖 Next.js 学习路径中 Day 1 到 Day 7 的完整知识体系。

## 📚 学习目标

本项目演示了：

-   **Day 1**: 项目搭建、核心文件和 App Router 基础
-   **Day 2**: 基于文件的路由、动态路由、导航和路由状态
-   **Day 3**: 服务端/客户端组件和四种渲染模式（SSR、SSG、ISR、CSR）
-   **Day 4**: Server Actions、API Routes 和 Middleware
-   **Day 5**: 样式优化、图片优化、字体优化、元数据优化和代码分割
-   **Day 6**: 并行路由、拦截路由、缓存重新验证和错误处理
-   **Day 7**: 环境变量配置、构建优化和部署

## 📁 项目结构

```
demo/
├── app/
│   ├── layout.tsx          # Day 1: 根布局（包含导航栏和页脚）
│   ├── page.tsx            # Day 1: 首页
│   ├── globals.css         # 全局样式
│   ├── about/
│   │   └── page.tsx        # Day 2: 基础路由示例
│   ├── blog/
│   │   ├── page.tsx        # Day 3: SSG - 博客列表（静态生成）
│   │   └── [id]/
│   │       ├── page.tsx    # Day 3: SSR - 博客详情（服务端渲染）
│   │       ├── loading.tsx # Day 2: 加载状态
│   │       └── error.tsx   # Day 2: 错误边界
│   ├── isr-demo/
│   │   └── page.tsx        # Day 3: ISR - 增量静态再生
│   ├── csr-demo/
│   │   └── page.tsx        # Day 3: CSR - 客户端渲染
│   ├── blog-admin/
│   │   └── page.tsx        # Day 4: Server Actions 演示
│   ├── api-demo/
│   │   └── page.tsx        # Day 4: API Routes 演示
│   ├── login/
│   │   └── page.tsx        # Day 4: Middleware 认证演示
│   ├── image-optimization-demo/
│   │   └── page.tsx        # Day 5: 图片优化示例
│   ├── code-splitting-demo/
│   │   ├── page.tsx        # Day 5: 代码分割示例
│   │   ├── HeavyComponent.tsx
│   │   ├── ChartComponent.tsx
│   │   └── ModalComponent.tsx
│   ├── parallel-routes-demo/
│   │   ├── layout.tsx     # Day 6: 并行路由布局
│   │   ├── page.tsx        # Day 6: 并行路由主页面
│   │   ├── @analytics/
│   │   │   └── page.tsx    # Day 6: Analytics 插槽
│   │   └── @dashboard/
│   │       └── page.tsx    # Day 6: Dashboard 插槽
│   ├── cache-demo/
│   │   └── page.tsx        # Day 6: 缓存重新验证示例
│   ├── (.)blog/
│   │   └── [id]/
│   │       └── page.tsx    # Day 6: 拦截路由示例
│   ├── error.tsx           # Day 6: 全局错误边界
│   ├── not-found.tsx       # Day 6: 全局 404 页面
│   └── api/
│       └── posts/
│           ├── route.ts    # Day 4: GET, POST /api/posts
│           └── [id]/
│               └── route.ts # Day 4: GET, PUT, DELETE /api/posts/[id]
├── components/
│   ├── Navigation.tsx      # Day 2: 导航组件（使用 Link、usePathname）
│   └── Footer.tsx          # Day 1: 页脚组件
├── lib/
│   ├── mockData.ts         # 模拟博客数据（支持 CRUD）
│   ├── api.ts              # 模拟 API 函数
│   └── actions.ts          # Day 4: Server Actions
└── middleware.ts           # Day 4: 中间件（认证、重定向、headers）
```

## 🎯 核心概念演示

### Day 1: 项目搭建

-   **App Router**: 基于 `app/` 目录的 Next.js 13+ 路由系统
-   **布局组件**: `app/layout.tsx` 包裹所有页面并提供共享 UI
-   **页面组件**: `app/page.tsx` 定义首页路由

### Day 2: 路由系统

-   **基础路由**: `/about` 演示简单的基于文件的路由
-   **动态路由**: `/blog/[id]` 展示如何处理动态参数
-   **导航**: `Link` 组件实现无需刷新页面的客户端导航
-   **路由状态**:
    -   `loading.tsx` - 页面加载时显示加载 UI
    -   `error.tsx` - 路由错误的错误边界

### Day 3: 渲染模式

#### SSR (服务端渲染)

-   **位置**: `/blog/[id]` - 博客详情页
-   **实现方式**: 使用 `export const dynamic = 'force-dynamic'` 禁用缓存
-   **使用场景**: 内容频繁变化且需要保持最新

#### SSG (静态站点生成)

-   **位置**: `/blog` - 博客列表页
-   **实现方式**: 默认行为 - 在构建时生成页面
-   **使用场景**: 内容不经常变化（博客文章、文档）

#### ISR (增量静态再生)

-   **位置**: `/isr-demo`
-   **实现方式**: 使用 `export const revalidate = 3600` 定期再生
-   **使用场景**: 偶尔更新但受益于静态性能的内容

#### CSR (客户端渲染)

-   **位置**: `/csr-demo`
-   **实现方式**: 使用 `'use client'` 指令和 `useEffect` 获取数据
-   **使用场景**: 高度交互的页面、仪表板、用户特定内容

### Day 4: 服务端功能

#### Server Actions

-   **位置**: `/blog-admin` - 博客管理页面
-   **实现方式**: 使用 `'use server'` 指令创建服务端函数
-   **文件**: `lib/actions.ts`
-   **特点**:
    -   可以直接在表单中使用，无需创建 API 路由
    -   自动处理表单数据
    -   支持 `revalidatePath` 和 `redirect`
    -   类型安全，与 TypeScript 完美集成
-   **使用场景**: 表单提交、数据变更操作、服务端逻辑

#### API Routes

-   **位置**: `/api-demo` - API 演示页面
-   **实现方式**: 在 `app/api/` 目录下创建 `route.ts` 文件
-   **文件**:
    -   `app/api/posts/route.ts` - GET, POST
    -   `app/api/posts/[id]/route.ts` - GET, PUT, DELETE
-   **特点**:
    -   标准的 RESTful API 端点
    -   可以返回 JSON、HTML、或其他格式
    -   支持所有 HTTP 方法（GET, POST, PUT, DELETE 等）
    -   可以被外部服务、移动应用调用
-   **使用场景**: 提供外部 API、需要复杂请求处理、支持非 React 客户端

#### Middleware

-   **位置**: `middleware.ts` - 根目录
-   **功能**:
    -   保护 `/blog-admin` 路由（需要认证）
    -   为 API 路由添加自定义 headers
    -   重定向旧路径到新路径
-   **特点**:
    -   在每个请求之前运行
    -   可以访问和修改请求/响应
    -   可以重定向、重写 URL、设置 headers
-   **使用场景**: 认证、授权、A/B 测试、国际化、日志记录

### Day 5: 样式与性能优化

#### 图片优化

-   **位置**: `/image-optimization-demo` - 图片优化演示
-   **实现方式**: 使用 `next/image` 组件
-   **特点**:
    -   自动图片优化和格式转换（WebP/AVIF）
    -   懒加载和响应式图片
    -   防止布局偏移（CLS）
    -   自动尺寸优化
-   **使用场景**: 所有需要显示图片的地方

#### 字体优化

-   **位置**: `app/layout.tsx` - 根布局
-   **实现方式**: 使用 `next/font` 优化字体加载
-   **特点**:
    -   自动字体子集化
    -   零布局偏移
    -   自动字体显示优化
-   **使用场景**: 自定义字体、Google Fonts

#### 元数据优化

-   **位置**: 各个页面组件
-   **实现方式**: 导出 `metadata` 对象或使用 `generateMetadata` 函数
-   **特点**:
    -   SEO 优化
    -   Open Graph 支持
    -   动态元数据生成
-   **使用场景**: 所有页面都应该有元数据

#### 代码分割

-   **位置**: `/code-splitting-demo` - 代码分割演示
-   **实现方式**: 使用 `dynamic` import 按需加载组件
-   **特点**:
    -   减少初始 bundle 大小
    -   按需加载大型组件
    -   支持自定义加载状态
    -   可以禁用 SSR
-   **使用场景**: 大型组件、模态框、图表库、条件渲染的组件

### Day 6: 高级特性

#### 并行路由

-   **位置**: `/parallel-routes-demo` - 并行路由演示
-   **实现方式**: 使用 `@folder` 语法创建插槽
-   **特点**:
    -   同时渲染多个路由段
    -   每个插槽可以有独立的加载和错误状态
    -   支持条件渲染
-   **使用场景**: 仪表板布局、多面板界面、条件布局

#### 拦截路由

-   **位置**: `app/(.)blog/[id]/page.tsx` - 拦截博客详情路由
-   **实现方式**: 使用 `(.)`、`(..)` 等前缀拦截路由
-   **特点**:
    -   拦截同一级别的路由（`(.)`）
    -   拦截父级路由（`(..)`）
    -   可以显示模态框而不是导航
-   **使用场景**: 模态框、侧边栏、覆盖层

#### 缓存重新验证

-   **位置**: `/cache-demo` - 缓存重新验证演示
-   **实现方式**: 使用 `revalidatePath` 和 `revalidateTag`
-   **特点**:
    -   `revalidatePath` - 重新验证特定路径
    -   `revalidateTag` - 按标签重新验证
    -   按需更新缓存内容
-   **使用场景**: 数据更新后立即刷新缓存、内容管理

#### 错误处理

-   **位置**: `app/error.tsx` 和 `app/not-found.tsx`
-   **实现方式**: 创建错误边界和 404 页面
-   **特点**:
    -   全局错误边界捕获未处理的错误
    -   自定义 404 页面
    -   路由级错误边界
-   **使用场景**: 错误恢复、用户友好的错误提示

### Day 7: 部署与总结

#### 环境变量配置

-   **文件**: `.env.example` - 环境变量示例
-   **特点**:
    -   `NEXT_PUBLIC_*` 变量暴露给浏览器
    -   服务器端变量保持私有
    -   支持不同环境的配置
-   **使用场景**: API 密钥、数据库连接、功能开关

#### 构建优化

-   **文件**: `next.config.js` - Next.js 配置
-   **优化项**:
    -   图片优化配置
    -   压缩和代码分割
    -   安全 headers
    -   SWC 压缩
-   **使用场景**: 生产环境性能优化

#### 部署

-   **文档**: `DEPLOYMENT.md` - 详细部署指南
-   **选项**:
    -   Vercel（推荐）- 零配置部署
    -   自托管 - Node.js、Docker
    -   静态导出 - 静态文件托管
-   **使用场景**: 生产环境部署

## 🔍 代码探索

### 服务端组件 vs 客户端组件

-   **服务端组件**（默认）：在服务器上运行，可以直接访问数据库，不向客户端发送 JavaScript
-   **客户端组件**：标记为 `'use client'`，在浏览器中运行，可以使用 React Hooks

### 数据获取模式

1. **服务端组件**（SSR/SSG/ISR）：

    ```tsx
    export default async function Page() {
        const data = await fetch('...');
        return <div>{data}</div>;
    }
    ```

2. **客户端组件**（CSR）：
    ```tsx
    'use client';
    export default function Page() {
        const [data, setData] = useState(null);
        useEffect(() => {
            fetch('...').then((res) => setData(res));
        }, []);
        return <div>{data}</div>;
    }
    ```

## 🧪 测试不同的渲染模式

### 测试 SSG

1. 运行 `npm run build` 生成静态页面
2. 检查 `.next/server/app/blog/page.html` - HTML 是预生成的

### 测试 SSR

1. 多次访问 `/blog/1`
2. 每次请求都会在服务器上生成新的 HTML
3. 查看服务器日志以查看请求

### 测试 ISR

1. 访问 `/isr-demo` 并记录时间戳
2. 多次刷新 - 时间戳保持不变（已缓存）
3. 等待重新验证周期（或为了测试将 `revalidate` 改为 10 秒）
4. 再次刷新 - 出现新的时间戳

### 测试 CSR

1. 访问 `/csr-demo`
2. 打开 DevTools 的 Network 标签
3. 查看页面加载后的客户端 API 请求
4. 禁用 JavaScript - 只能看到加载状态

### 测试 Server Actions

1. 访问 `/blog-admin`
2. 点击 "Create New Post" 按钮
3. 填写表单并提交
4. 观察新文章立即出现在列表中（无需刷新）
5. 尝试删除一篇文章

### 测试 API Routes

1. 访问 `/api-demo`
2. 点击 "Fetch All Posts" 查看 GET 请求
3. 创建新文章测试 POST 请求
4. 更新和删除文章测试 PUT 和 DELETE 请求
5. 打开 DevTools Network 标签查看 HTTP 请求详情
6. 可以直接访问 `/api/posts` 查看 JSON 响应

### 测试 Middleware

1. 尝试直接访问 `/blog-admin` - 会被重定向到 `/login`
2. 使用演示凭证登录：`admin` / `password`
3. 登录后可以访问 `/blog-admin`
4. 访问任何 `/api/*` 路由，检查响应 headers（`X-Custom-Header`）
5. 访问 `/old-blog` - 会被重定向到 `/blog`

## 🔍 Day 4 代码示例

### Server Actions 示例

```tsx
// lib/actions.ts
'use server';

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    // ... 处理逻辑
    revalidatePath('/blog');
    return { success: true };
}

// 在组件中使用
<form action={createPost}>
    <input name="title" />
    <button type="submit">Submit</button>
</form>;
```

### API Routes 示例

```tsx
// app/api/posts/route.ts
export async function GET() {
    return NextResponse.json({ posts: [] });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    // ... 处理逻辑
    return NextResponse.json({ success: true }, { status: 201 });
}
```

### Middleware 示例

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
    // 认证检查
    if (pathname.startsWith('/admin')) {
        const auth = request.cookies.get('isAuthenticated');
        if (!auth) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 添加 headers
    const response = NextResponse.next();
    response.headers.set('X-Custom-Header', 'value');
    return response;
}
```

## 🧪 Day 5-7 测试指南

### 测试图片优化

1. 访问 `/image-optimization-demo`
2. 打开 Network 标签，查看图片请求
3. 检查图片格式（WebP/AVIF）和尺寸
4. 测试响应式图片在不同设备上的表现

### 测试代码分割

1. 访问 `/code-splitting-demo`
2. 打开 Network 标签，过滤 JS 文件
3. 点击按钮加载组件，观察新的 chunk 加载
4. 检查初始 bundle 大小

### 测试并行路由

1. 访问 `/parallel-routes-demo`
2. 观察多个插槽同时渲染
3. 检查每个插槽的独立加载状态

### 测试拦截路由

1. 访问 `/blog` 页面
2. 点击任意博客文章链接
3. 观察模态框形式显示（拦截路由）
4. 直接访问 `/blog/[id]` URL 查看正常页面

### 测试缓存重新验证

1. 访问 `/cache-demo`
2. 点击 "Revalidate Blog Cache" 按钮
3. 检查缓存是否已更新

### 测试错误处理

1. 访问不存在的路由（如 `/non-existent`）
2. 查看自定义 404 页面
3. 触发错误查看错误边界

## 📚 部署指南

详细的部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

快速部署到 Vercel：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 🎓 学习路径完成

恭喜！你已经完成了 Next.js 7 天学习路径的所有内容：

-   ✅ Day 1: 项目搭建与基础概念
-   ✅ Day 2: 路由系统
-   ✅ Day 3: 数据获取与渲染模式
-   ✅ Day 4: 服务端功能
-   ✅ Day 5: 样式与性能优化
-   ✅ Day 6: 高级特性
-   ✅ Day 7: 部署与总结

现在你已经掌握了 Next.js 的核心概念和最佳实践，可以开始构建自己的生产级应用了！
