/**
 * content/index.tsx —— Content Script 入口（React + Shadow DOM）
 *
 * 【企业级考点】Shadow DOM 样式隔离（真实项目标准做法）：
 *  - vanilla 版用"类名前缀 + all: initial"只是缓解，页面的高优先级选择器
 *    （如 !important、内联 style）仍可能穿透
 *  - Shadow DOM 提供真正的双向隔离：
 *      页面 CSS 选不中 shadow 内部节点；shadow 内部样式也不影响页面
 *  - React 组件挂载到 shadow root 里，UI 可以用完整的组件化开发
 *
 * 注意：Shadow DOM 也不是万能的 —— 它隔离 CSS 但不隔离 JS 事件冒泡逻辑，
 * 且 position: fixed 的参照仍是视口（可用），z-index 竞争由宿主节点决定。
 */
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { storage } from '../shared/storage';
import panelCss from './panel.css?inline'; // 【CRXJS 特性】?inline 把 CSS 打包成字符串注入 shadow

// ---------------------------------------------------------------------------
// React 组件：浮动面板 + Toast
// ---------------------------------------------------------------------------
function Panel() {
  const [color, setColor] = useState('#ffe58f');
  const [noteCount, setNoteCount] = useState(0);
  const [toast, setToast] = useState('');

  // 订阅 storage：options 页改颜色 / 其他标签页保存笔记 → 本页实时更新
  useEffect(() => {
    storage.get('highlightColor').then(setColor);
    storage.get('notes').then((notes) => setNoteCount(notes.length));
    const unsubColor = storage.subscribe('highlightColor', setColor);
    const unsubNotes = storage.subscribe('notes', (notes) => setNoteCount(notes.length));
    return () => {
      unsubColor();
      unsubNotes();
    };
  }, []);

  // 监听 background 的反馈消息（保存成功 / 切换高亮模式）
  useEffect(() => {
    const listener = (message: { type: string }) => {
      if (message.type === 'SAVE_NOTE_FEEDBACK') {
        highlightSelection();
        setToast('已保存 ✓');
        setTimeout(() => setToast(''), 2000);
      }
      if (message.type === 'TOGGLE_HIGHLIGHT_MODE') {
        document.body.classList.toggle('crx-ent-highlight-mode');
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  return (
    <div className="panel" style={{ ['--hl-color' as string]: color }}>
      <div className="title">📝 划词笔记（企业版）</div>
      <div className="tip">选中文字 → 右键保存 · 已存 {noteCount} 条</div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 划词高亮（DOM 操作在 shadow 外，直接操作页面 DOM）
// ---------------------------------------------------------------------------
function highlightSelection() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
  const range = selection.getRangeAt(0);
  const mark = document.createElement('mark');
  mark.className = 'crx-ent-highlight';
  try {
    range.surroundContents(mark);
  } catch {
    mark.appendChild(range.extractContents());
    range.insertNode(mark);
  }
  selection.removeAllRanges();
}

// ---------------------------------------------------------------------------
// 挂载：创建宿主节点 + attachShadow，React 渲染进 shadow root
// ---------------------------------------------------------------------------
function mount() {
  const hostId = 'crx-ent-note-root';
  if (document.getElementById(hostId)) return;

  const host = document.createElement('div');
  host.id = hostId;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  // 样式注入 shadow 内部：页面 CSS 完全进不来，我们的 CSS 也出不去
  const style = document.createElement('style');
  style.textContent = panelCss;
  shadow.appendChild(style);

  const container = document.createElement('div');
  shadow.appendChild(container);
  createRoot(container).render(<Panel />);
}

// 高亮 <mark> 的样式需要作用在页面 DOM 上（不在 shadow 内），
// 用 CSS 变量传递配置颜色，通过 style 标签注入页面 head
function injectPageStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .crx-ent-highlight {
      background-color: var(--crx-ent-hl-color, #ffe58f) !important;
      color: inherit !important;
      border-radius: 2px;
    }
    body.crx-ent-highlight-mode { cursor: crosshair !important; }
    body.crx-ent-highlight-mode ::selection {
      background-color: var(--crx-ent-hl-color, #ffe58f) !important;
    }
  `;
  document.head.appendChild(style);

  // 同步颜色配置到页面级 CSS 变量
  const applyColor = (color: string) =>
    document.documentElement.style.setProperty('--crx-ent-hl-color', color);
  storage.get('highlightColor').then(applyColor);
  storage.subscribe('highlightColor', applyColor);
}

mount();
injectPageStyle();
