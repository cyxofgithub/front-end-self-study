/**
 * background.js —— MV3 Service Worker（后台脚本）
 *
 * 【考点】MV3 的 background 不再是常驻页面（MV2 persistent background page），
 * 而是事件驱动的 Service Worker：
 *  - 空闲约 30 秒就会被浏览器回收（休眠），有事件到来时再被唤醒
 *  - 因此【不能】把状态放在全局变量里指望它一直在（worker 重启后丢失）
 *  - 因此【不能】用 setInterval/setTimeout 做长延时任务（休眠后定时器被清掉），
 *    要用 chrome.alarms
 *  - 所有监听器必须在【顶层同步注册】，不能放在异步回调里，
 *    否则 worker 冷启动唤醒时来不及注册，事件会丢失
 */

// ---------------------------------------------------------------------------
// 1. 扩展安装/更新时初始化（chrome.runtime.onInstalled）
// 【考点】右键菜单（contextMenus）为什么要在 onInstalled 里创建？
//   菜单创建后是持久化的；如果每次 worker 启动都创建会报重复 id 错误。
//   onInstalled 只在安装/更新/浏览器升级时触发一次，是初始化的正确时机。
// ---------------------------------------------------------------------------
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[background] onInstalled, reason =', details.reason);

  // 创建右键菜单：选中文字时出现"保存笔记"
  chrome.contextMenus.create({
    id: 'save-note',
    title: '保存笔记："%s"', // %s 会被替换为选中的文字
    contexts: ['selection'], // 只在有文字选中时显示
  });

  // 写入默认配置（storage.local：本机持久化，重启浏览器还在）
  const { highlightColor } = await chrome.storage.local.get('highlightColor');
  if (!highlightColor) {
    await chrome.storage.local.set({ highlightColor: '#ffe58f', notes: [] });
  }
});

// ---------------------------------------------------------------------------
// 2. 右键菜单点击 → 通知 content script 取选中文字
// 【考点】消息方向：background → content 必须走 chrome.tabs.sendMessage，
//   并指定 tabId（background 不知道当前页面，要通过 tab 找到它）。
// ---------------------------------------------------------------------------
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-note' && tab?.id) {
    // info.selectionText 已带选中文字，可直接用；
    // 这里演示 background → content 的消息通道，让 content 做 DOM 高亮
    chrome.tabs.sendMessage(tab.id, {
      type: 'SAVE_NOTE',
      payload: { text: info.selectionText },
    });
  }
});

// ---------------------------------------------------------------------------
// 3. 快捷键（commands）→ 通知当前标签页切换高亮模式
// ---------------------------------------------------------------------------
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-highlight') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_HIGHLIGHT_MODE' });
  }
});

// ---------------------------------------------------------------------------
// 4. 消息中转站：接收来自 popup / content 的消息
// 【考点】chrome.runtime.onMessage 三种返回响应的方式：
//   a) 同步 return 一个值（但通常用 sendResponse）
//   b) 同步调用 sendResponse(data)
//   c) 异步调用 sendResponse —— 必须 return true 保持消息通道不关闭！
//      （经典面试题：为什么异步响应要 return true）
// ---------------------------------------------------------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[background] onMessage:', message, 'from:', sender.tab ? `content(tab ${sender.tab.id})` : 'popup/options');

  switch (message.type) {
    case 'ADD_NOTE': {
      // 异步操作 → return true 保持通道
      (async () => {
        const { notes = [] } = await chrome.storage.local.get('notes');
        notes.push({
          id: Date.now(),
          text: message.payload.text,
          url: message.payload.url,
          createdAt: new Date().toISOString(),
        });
        await chrome.storage.local.set({ notes });
        updateBadge(notes.length);
        sendResponse({ ok: true, total: notes.length });
      })();
      return true; // ← 关键！告诉 Chrome：我要异步 sendResponse，别关通道
    }

    case 'GET_NOTES': {
      (async () => {
        const { notes = [] } = await chrome.storage.local.get('notes');
        sendResponse({ ok: true, notes });
      })();
      return true;
    }

    case 'DELETE_NOTE': {
      (async () => {
        const { notes = [] } = await chrome.storage.local.get('notes');
        const next = notes.filter((n) => n.id !== message.payload.id);
        await chrome.storage.local.set({ notes: next });
        updateBadge(next.length);
        sendResponse({ ok: true, total: next.length });
      })();
      return true;
    }

    case 'GET_PAGE_INFO': {
      // popup 请求提取当前页面信息 → 用 chrome.scripting 在当前页执行函数
      // 【考点】chrome.scripting.executeScript + activeTab 权限：
      //   用户点击 popup（即"主动激活"）后，activeTab 授予对当前页的临时访问权，
      //   无需声明 <all_urls> 主机权限，权限最小化，商店审核更容易过。
      (async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) return sendResponse({ ok: false });
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          // 直接注入函数（也可以是 files: ['xxx.js']）
          func: () => ({
            title: document.title,
            linkCount: document.querySelectorAll('a').length,
            words: document.body.innerText.length,
          }),
        });
        sendResponse({ ok: true, info: result.result });
      })();
      return true;
    }
  }
});

// ---------------------------------------------------------------------------
// 5. 徽章（badge）：action 图标上的小红字
// 【考点】worker 休眠后 badge 会保留吗？—— 会，badge 状态由浏览器托管。
// ---------------------------------------------------------------------------
function updateBadge(count) {
  chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#f5222d' });
}

// worker 每次被唤醒时，从 storage 恢复 badge（演示"状态不能放内存"）
(async () => {
  const { notes = [] } = await chrome.storage.local.get('notes');
  updateBadge(notes.length);
})();

// ---------------------------------------------------------------------------
// 6. chrome.alarms —— MV3 中替代 setInterval 的定时方案
// 【考点】alarms 最短周期 30 秒，且 worker 休眠后闹钟响时会唤醒 worker。
//   演示：每分钟检查一次（实际场景如定时同步、定时清理过期数据）
// ---------------------------------------------------------------------------
chrome.alarms.create('heartbeat', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'heartbeat') {
    console.log('[background] alarm fired at', new Date(alarm.scheduledTime).toLocaleTimeString());
  }
});

// ---------------------------------------------------------------------------
// 7. 长连接（Port）演示：popup 打开期间与 background 保持连接
// 【考点】sendMessage 是"一问一答"；需要持续双向通信时用 chrome.runtime.connect。
//   popup 关闭 → Port 自动断开（onDisconnect）。
// ---------------------------------------------------------------------------
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'popup-channel') return;
  console.log('[background] popup 已建立长连接');
  port.onMessage.addListener((msg) => {
    if (msg.type === 'PING') {
      port.postMessage({ type: 'PONG', time: new Date().toLocaleTimeString() });
    }
  });
  port.onDisconnect.addListener(() => {
    console.log('[background] popup 长连接断开（popup 关闭了）');
  });
});
