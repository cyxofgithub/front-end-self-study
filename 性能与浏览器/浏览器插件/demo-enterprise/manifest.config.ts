import { defineManifest } from '@crxjs/vite-plugin';

/**
 * 【企业级考点】manifest 用 TS 定义（defineManifest）：
 *  - 完整类型提示与校验（写错字段名直接编译报错）
 *  - 可用代码做 dev/prod 差异：例如开发环境加 content_security_policy 放宽、
 *    生产环境收紧；名字带环境后缀方便调试
 */
export default defineManifest((env) => ({
  manifest_version: 3,
  name: env.mode === 'development' ? '[DEV] 划词笔记 · 企业版' : '划词笔记 · 企业版',
  version: '1.0.0',
  description: '企业级工程化示例：React + TS + CRXJS + Shadow DOM + 类型安全消息层',

  default_locale: 'zh_CN',

  icons: {
    16: 'public/icons/icon16.png',
    48: 'public/icons/icon48.png',
    128: 'public/icons/icon128.png',
  },

  action: {
    default_popup: 'src/popup/index.html',
    default_title: '__MSG_extName__',
  },

  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },

  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/index.tsx'],
      run_at: 'document_idle',
    },
  ],

  options_page: 'src/options/index.html',

  permissions: ['storage', 'contextMenus', 'alarms', 'scripting', 'activeTab'],

  commands: {
    'toggle-highlight': {
      suggested_key: { default: 'Ctrl+Shift+H', mac: 'Command+Shift+H' },
      description: '__MSG_cmdToggleHighlight__',
    },
  },
}));
