import { defineConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';
import { MermaidMarkdown, MermaidPlugin } from 'vitepress-plugin-mermaid';

export default defineConfig(
  withSidebar(
    {
      // ===== 基础配置 =====
      title: '前端自学笔记',
      description: '前端开发学习笔记文档站',
      lang: 'zh-CN',

      // ===== 主题配置 =====
      themeConfig: {
        // 导航栏
        nav: [
          { text: '首页', link: '/' },
          { text: 'quick', link: '/interview/2021前端面试秋招' },
          { text: 'GitHub', link: 'https://github.com/cyxofgithub/front-end-self-study' }
        ],

        // 社交链接
        socialLinks: [{ icon: 'github', link: 'https://github.com/cyxofgithub' }],

        // 页脚
        footer: {
          message: '基于 VitePress 构建',
          copyright: 'Copyright 2026 陈源鑫'
        },

        // 搜索 (本地搜索)
        search: {
          provider: 'local'
        },

        // 大纲配置
        outline: {
          level: [2, 3],
          label: '目录'
        },

        // 文档页脚
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },

        // 最后更新时间
        lastUpdated: {
          text: '最后更新',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short'
          }
        },

        // 返回顶部
        returnToTopLabel: '返回顶部',

        // 侧边栏标签
        sidebarMenuLabel: '菜单',

        // 深色模式切换
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
      },

      // ===== Markdown 配置 =====
      markdown: {
        lineNumbers: true,
        image: {
          lazyLoading: true
        },
        config(md) {
          md.use(MermaidMarkdown);
        }
      },

      // ===== 忽略死链接检查 =====
      ignoreDeadLinks: [
        // 忽略图片链接
        /\.assets/,
        // 忽略本地文件链接
        /^file:/,
        // 忽略中文链接问题
        /%/
      ],

      // ===== Vite 配置 =====
      vite: {
        plugins: [MermaidPlugin()],
        optimizeDeps: {
          // 排除 code 目录下的文件，避免解析其依赖
          exclude: ['code', 'demo'],
          include: ['mermaid']
        },
        ssr: {
          noExternal: ['mermaid']
        },
        resolve: {
          alias: {
            // 为 code 目录中的外部依赖提供空模块
            yjs: 'data:text/javascript,export default {}',
            'y-websocket': 'data:text/javascript,export default {}'
          }
        }
      },
      // 排除特定文件不被 Vite 处理
      srcExclude: ['**/code/**', '**/demo/**', '**/client/**', '**/server/**']
    },
    // ===== vitepress-sidebar 配置 =====
    {
      // ============ 路径配置 ============
      documentRootPath: '/',

      // ============ 折叠配置 ============
      collapsed: true,
      collapseDepth: 2,

      // ============ 标题获取 ============
      useTitleFromFileHeading: true,
      useTitleFromFrontmatter: true,

      // ============ 排序配置 ============
      // 支持数字前缀排序 (01_, 02_ 等)
      sortMenusByName: true,
      // 排序后移除前缀
      removePrefixAfterOrdering: true,
      prefixSeparator: '_',

      // ============ 样式配置 ============
      hyphenToSpace: true,
      underscoreToSpace: true,

      // ============ 排除配置 ============
      excludeByGlobPattern: [
        '**/*.assets/**',
        '**/node_modules/**',
        '**/.git/**',
        '**/.idea/**',
        '**/.cursor/**',
        '**/.pnpm-store/**',
        '**/code/**',
        '**/demo/**',
        '**/dist/**',
        '**/.DS_Store',
        '**/.vitepress/**'
      ],

      // 不包含点文件
      includeDotFiles: false,
      // 不包含空文件夹
      includeEmptyFolder: false,
      // 包含根目录 index 文件
      includeRootIndexFile: true,

      // ============ 调试 ============
      debugPrint: false
    }
  )
);
