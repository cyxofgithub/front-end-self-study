# Next.js Day 1-3 演示项目

一个全面的演示项目，涵盖 Next.js 学习路径中 Day 1 到 Day 3 的基础知识。

## 📚 学习目标

本项目演示了：

-   **Day 1**: 项目搭建、核心文件和 App Router 基础
-   **Day 2**: 基于文件的路由、动态路由、导航和路由状态
-   **Day 3**: 服务端/客户端组件和四种渲染模式（SSR、SSG、ISR、CSR）

## 📁 项目结构

```
demo-day1-3/
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
│   └── csr-demo/
│       └── page.tsx        # Day 3: CSR - 客户端渲染
├── components/
│   ├── Navigation.tsx      # Day 2: 导航组件（使用 Link、usePathname）
│   └── Footer.tsx          # Day 1: 页脚组件
└── lib/
    ├── mockData.ts         # 模拟博客数据
    └── api.ts              # 模拟 API 函数
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

## 📚 下一步

继续学习路径的 Day 4-7：

-   Day 4: Server Actions 和 API Routes
-   Day 5: 样式和性能优化
-   Day 6: 高级特性
-   Day 7: 部署
