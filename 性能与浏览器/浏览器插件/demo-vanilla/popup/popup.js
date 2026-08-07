/**
 * popup.js —— 弹窗脚本
 *
 * 【考点】popup 的生命周期：
 *  - 每次点击图标打开 popup，都是一个【全新页面】，重新加载 HTML/JS；
 *    关闭即销毁，页面内状态全部丢失。
 *  - 调试方式：右键扩展图标 → "审查弹出内容"（或在 popup 上右键检查），
 *    关掉 DevTools 窗口前先别点别处，否则 popup 关闭、上下文销毁。
 *  - popup 属于扩展页面，跨域请求不受页面 CORS 限制
 *    （MV3 中需在 host_permissions 声明目标域名才能 fetch）。
 */

// ---------------------------------------------------------------------------
// 1. popup → background：chrome.runtime.sendMessage（一问一答）
// ---------------------------------------------------------------------------
function loadNotes() {
  chrome.runtime.sendMessage({ type: 'GET_NOTES' }, (response) => {
    if (response?.ok) renderNotes(response.notes);
  });
}

function renderNotes(notes) {
  document.getElementById('note-count').textContent = String(notes.length);
  const list = document.getElementById('note-list');
  list.innerHTML = '';

  if (notes.length === 0) {
    list.innerHTML = '<li class="empty">暂无笔记，去页面划词试试吧</li>';
    return;
  }

  for (const note of notes.slice().reverse()) {
    const li = document.createElement('li');
    li.className = 'note-item';

    const text = document.createElement('div');
    text.className = 'note-text';
    text.textContent = note.text;

    const meta = document.createElement('div');
    meta.className = 'note-meta';
    meta.textContent = new URL(note.url).hostname;

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'note-del';
    del.textContent = '删除';
    del.addEventListener('click', () => {
      chrome.runtime.sendMessage(
        { type: 'DELETE_NOTE', payload: { id: note.id } },
        () => loadNotes()
      );
    });

    li.append(text, meta, del);
    list.appendChild(li);
  }
}

// ---------------------------------------------------------------------------
// 2. 显示当前标签页信息（chrome.tabs.query）
// 【考点】tabs 权限：读取 url/title 需要 "tabs" 权限或 activeTab；
//   popup 打开本身视为用户主动激活，activeTab 已授权当前页。
// ---------------------------------------------------------------------------
(async function showTabInfo() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const el = document.getElementById('tab-info');
  if (tab) {
    el.textContent = `${tab.title ?? '(无标题)'}\n${tab.url ?? ''}`;
  }
})();

// ---------------------------------------------------------------------------
// 3. 提取页面信息：popup → background → chrome.scripting.executeScript
// （为什么不直接从 popup 给 content script 发消息？也行！
//   这里演示另一条路：popup → background → scripting 注入函数。
//   面试要点：executeScript 不需要页面预先加载 content script，
//   注入的函数运行在 isolated world，可以访问 DOM。）
// ---------------------------------------------------------------------------
document.getElementById('btn-extract').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'GET_PAGE_INFO' }, (response) => {
    const pre = document.getElementById('page-info');
    pre.textContent = response?.ok
      ? JSON.stringify(response.info, null, 2)
      : '提取失败（chrome:// 等受限页面无法注入）';
  });
});

// ---------------------------------------------------------------------------
// 4. 长连接演示：chrome.runtime.connect（Port）
// 【考点】sendMessage 一次性 vs connect 长连接：
//   Port 存活期间可以反复双向 postMessage；任一方 disconnect 即断开。
//   popup 关闭时其 Port 自动断开 → background 的 onDisconnect 触发。
// ---------------------------------------------------------------------------
const port = chrome.runtime.connect({ name: 'popup-channel' });
port.onMessage.addListener((msg) => {
  if (msg.type === 'PONG') {
    document.getElementById('pong-result').textContent = `PONG @ ${msg.time}`;
  }
});
document.getElementById('btn-ping').addEventListener('click', () => {
  port.postMessage({ type: 'PING' });
});

// ---------------------------------------------------------------------------
// 5. 打开设置页
// ---------------------------------------------------------------------------
document.getElementById('btn-options').addEventListener('click', () => {
  chrome.runtime.openOptionsPage(); // 比 window.open('options.html') 更标准
});

// 初始加载
loadNotes();

// 【考点】popup 里如何感知 storage 变化？同样用 chrome.storage.onChanged。
// 比如在 content script 保存笔记后，已打开的 popup 实时刷新列表。
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.notes) loadNotes();
});
