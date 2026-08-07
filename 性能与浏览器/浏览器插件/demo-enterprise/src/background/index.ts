/**
 * background/index.ts —— Service Worker 入口
 *
 * 【企业级考点】入口文件保持干净：
 *   真实项目的 background 会拆成多个模块（notes.ts / contextMenu.ts /
 *   commands.ts / alarms.ts…），入口只做注册。这里演示这个组织方式。
 */
import { registerHandlers } from '../shared/messaging';
import { storage } from '../shared/storage';
import type { Note } from '../shared/types';

// ---------------------------------------------------------------------------
// 消息处理器：集中注册（协议见 src/shared/types.ts，改动一处全项目检查）
// ---------------------------------------------------------------------------
registerHandlers({
  ADD_NOTE: async (payload) => {
    const notes = await storage.get('notes');
    const note: Note = {
      id: Date.now(),
      text: payload.text,
      url: payload.url,
      createdAt: new Date().toISOString(),
    };
    const next = [...notes, note];
    await storage.set('notes', next);
    updateBadge(next.length);
    return { ok: true, total: next.length };
  },

  GET_NOTES: async () => {
    const notes = await storage.get('notes');
    return { ok: true, notes };
  },

  DELETE_NOTE: async (payload) => {
    const notes = await storage.get('notes');
    const next = notes.filter((n) => n.id !== payload.id);
    await storage.set('notes', next);
    updateBadge(next.length);
    return { ok: true, total: next.length };
  },

  GET_PAGE_INFO: async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return { ok: false };
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({
        title: document.title,
        linkCount: document.querySelectorAll('a').length,
        words: document.body.innerText.length,
      }),
    });
    return { ok: true, info: result.result };
  },
});

// ---------------------------------------------------------------------------
// 右键菜单：onInstalled 中创建（与 vanilla 版相同的考点，不再赘述）
// ---------------------------------------------------------------------------
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-note',
    title: chrome.i18n.getMessage('contextMenuSaveNote'), // i18n 在 manifest/background 中的用法
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-note' && tab?.id && info.selectionText) {
    // background 直接处理存储（数据统一收口在 background），content 只负责 UI 反馈
    void (async () => {
      const notes = await storage.get('notes');
      const note: Note = {
        id: Date.now(),
        text: info.selectionText!,
        url: tab.url ?? '',
        createdAt: new Date().toISOString(),
      };
      const next = [...notes, note];
      await storage.set('notes', next);
      updateBadge(next.length);
      // 通知 content 做页面内反馈（高亮 + toast）
      chrome.tabs.sendMessage(tab.id!, { type: 'SAVE_NOTE_FEEDBACK' });
    })();
  }
});

// ---------------------------------------------------------------------------
// 快捷键 → 通知当前标签页切换高亮模式
// ---------------------------------------------------------------------------
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-highlight') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_HIGHLIGHT_MODE' });
  }
});

// ---------------------------------------------------------------------------
// badge：worker 唤醒时从 storage 恢复（状态不能放内存）
// ---------------------------------------------------------------------------
function updateBadge(count: number) {
  chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#f5222d' });
}

storage.get('notes').then((notes) => updateBadge(notes.length));

// ---------------------------------------------------------------------------
// alarms：MV3 定时任务标准方案（setInterval 在 SW 休眠后会失效）
// ---------------------------------------------------------------------------
chrome.alarms.create('heartbeat', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'heartbeat') {
    console.log('[background] heartbeat:', new Date(alarm.scheduledTime).toLocaleTimeString());
  }
});
