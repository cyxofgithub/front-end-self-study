/**
 * popup/App.tsx —— popup 主组件
 *
 * 与 vanilla 版对照：同样的功能，企业级写法
 *  - 消息用封装的 sendToBackground（Promise + 类型推导）
 *  - 状态用 React state + storage.subscribe 订阅
 *  - i18n 用 chrome.i18n.getMessage
 */
import { useCallback, useEffect, useState } from 'react';
import { sendToBackground } from '../shared/messaging';
import { storage } from '../shared/storage';
import type { Note } from '../shared/types';

interface PageInfo {
  title: string;
  linkCount: number;
  words: number;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tabInfo, setTabInfo] = useState('');
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  // 笔记列表：初始读取 + 订阅变化（content 保存后 popup 实时刷新）
  useEffect(() => {
    storage.get('notes').then(setNotes);
    return storage.subscribe('notes', setNotes);
  }, []);

  // 当前标签页信息
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab) setTabInfo(`${tab.title ?? ''}\n${tab.url ?? ''}`);
    });
  }, []);

  const extractPageInfo = useCallback(async () => {
    // 类型推导：response 自动是 { ok, info? }，写错字段名会报错
    const response = await sendToBackground('GET_PAGE_INFO', undefined);
    if (response.ok && response.info) setPageInfo(response.info);
  }, []);

  const deleteNote = useCallback(async (id: number) => {
    await sendToBackground('DELETE_NOTE', { id });
    // 无需手动刷新：storage.subscribe 会推送新列表
  }, []);

  return (
    <div className="app">
      <header className="header">
        {/* i18n：chrome.i18n.getMessage 读取 _locales/{locale}/messages.json */}
        <h1>{chrome.i18n.getMessage('extName')}</h1>
        <span className="count">{notes.length}</span>
      </header>

      <section className="section">
        <h2>当前页面</h2>
        <div className="tab-info">{tabInfo}</div>
        <button onClick={extractPageInfo}>提取页面信息</button>
        {pageInfo && <pre className="page-info">{JSON.stringify(pageInfo, null, 2)}</pre>}
      </section>

      <section className="section">
        <h2>我的笔记</h2>
        <ul className="note-list">
          {notes.length === 0 && <li className="empty">暂无笔记，去页面划词试试吧</li>}
          {notes
            .slice()
            .reverse()
            .map((note) => (
              <li key={note.id} className="note-item">
                <div className="note-text">{note.text}</div>
                <div className="note-meta">{safeHostname(note.url)}</div>
                <button className="note-del" onClick={() => deleteNote(note.id)}>
                  删除
                </button>
              </li>
            ))}
        </ul>
      </section>

      <footer className="footer">
        <button className="ghost" onClick={() => chrome.runtime.openOptionsPage()}>
          ⚙ 设置
        </button>
      </footer>
    </div>
  );
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}
