/**
 * content.js —— 内容脚本（Content Script）
 *
 * 【考点】isolated world（隔离世界）：
 *  - content script 和页面共享同一个 DOM，但运行在独立的 JS 世界里：
 *    页面定义的 window.xxx 在这里访问不到，这里定义的变量页面也看不到，
 *    双方的原型链污染互不影响（安全设计）。
 *  - 要和页面主世界通信，只能用 DOM 事件（CustomEvent）或 window.postMessage。
 *  - 此处的 localStorage 是【页面所在站点】的 localStorage，不是扩展的！
 *    扩展自己的存储要用 chrome.storage。
 */

(function () {
  'use strict';

  let highlightMode = false; // 高亮模式开关（由快捷键切换）
  const PANEL_ID = 'crx-note-panel';

  // -------------------------------------------------------------------------
  // 1. 监听来自 background 的消息（content 是被动接收方）
  // -------------------------------------------------------------------------
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'SAVE_NOTE': {
        const text = message.payload.text || getSelectionText();
        if (!text) return;

        // 高亮当前选区（DOM 操作：content script 的核心能力）
        highlightSelection();

        // content → background：把笔记交给 background 统一写入 storage
        // 【考点】为什么不让 content script 直接写 storage？
        //   可以写（content script 能访问部分 chrome API），但企业级做法是
        //   让 background 做"单一数据中心"，多个标签页并发写不会互相覆盖。
        chrome.runtime.sendMessage(
          {
            type: 'ADD_NOTE',
            payload: { text, url: location.href },
          },
          (response) => {
            if (response?.ok) {
              showToast(`已保存，共 ${response.total} 条笔记`);
            }
          }
        );
        break;
      }

      case 'TOGGLE_HIGHLIGHT_MODE': {
        highlightMode = !highlightMode;
        document.body.classList.toggle('crx-highlight-mode', highlightMode);
        showToast(highlightMode ? '高亮模式已开启' : '高亮模式已关闭');
        break;
      }
    }
  });

  // -------------------------------------------------------------------------
  // 2. 划词高亮：把选中文字包一层 <mark>
  // -------------------------------------------------------------------------
  function getSelectionText() {
    return window.getSelection()?.toString().trim() ?? '';
  }

  function highlightSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const mark = document.createElement('mark');
    mark.className = 'crx-note-highlight';

    // surroundContents 在跨节点选区会抛异常，企业级做法是 extractContents + 遍历包裹
    try {
      range.surroundContents(mark);
    } catch (e) {
      const fragment = range.extractContents();
      mark.appendChild(fragment);
      range.insertNode(mark);
    }
    selection.removeAllRanges();
  }

  // -------------------------------------------------------------------------
  // 3. 注入一个浮动面板到页面（演示 DOM 注入 + 样式隔离）
  // 【考点】样式隔离（vanilla 版）：
  //   - content.css 会和页面样式互相影响（同一份 CSSOM）
  //   - 隔离手段：所有类名加唯一前缀（crx-）+ 高优先级；
  //     更彻底的做法是 Shadow DOM 或 iframe（见 demo-enterprise）
  // -------------------------------------------------------------------------
  function injectPanel() {
    if (document.getElementById(PANEL_ID)) return;
    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="crx-panel-title">📝 划词笔记</div>
      <div class="crx-panel-tip">选中文字 → 右键"保存笔记"</div>
    `;
    document.body.appendChild(panel);
  }

  function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'crx-toast';
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // -------------------------------------------------------------------------
  // 4. 读取配置并应用（chrome.storage.local 在 content script 中同样可用）
  // 【考点】chrome.storage.onChanged：options 页改了颜色，所有已打开页面
  //   实时生效，无需刷新 —— 靠的就是这个监听。
  // -------------------------------------------------------------------------
  function applyColor(color) {
    document.documentElement.style.setProperty('--crx-highlight-color', color);
  }

  chrome.storage.local.get('highlightColor', (result) => {
    if (result.highlightColor) applyColor(result.highlightColor);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.highlightColor) {
      applyColor(changes.highlightColor.newValue);
    }
  });

  // -------------------------------------------------------------------------
  // 5. 与页面主世界通信演示（可选考点）
  // 【考点】content script 如何拿到页面 JS 变量？
  //   不能直接访问 → 用 window.postMessage 约定协议双向通信，
  //   或注入 <script src=web_accessible_resources 里的 js> 到主世界。
  // -------------------------------------------------------------------------
  window.addEventListener('message', (event) => {
    if (event.source !== window) return; // 安全：只接受本窗口消息
    if (event.data?.type === 'FROM_PAGE') {
      console.log('[content] 收到页面主世界消息:', event.data.payload);
    }
  });

  // 面板注入（run_at: document_idle，此时 body 已存在）
  injectPanel();
})();
