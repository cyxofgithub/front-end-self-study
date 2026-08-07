/**
 * types.ts —— 全局共享类型
 *
 * 【企业级考点】消息协议集中定义：
 *   裸写 chrome.runtime.sendMessage 时，消息只是 `{type: string, ...}` 的约定，
 *   没有类型约束，重构时全靠全局搜索字符串。企业级做法是：
 *   1. 用一个 discriminated union 定义【全部消息协议】（这里）
 *   2. 用泛型封装 send/on（messaging.ts），收发都有完整类型推导
 */

export interface Note {
  id: number;
  text: string;
  url: string;
  createdAt: string;
}

/** 消息映射表：消息名 → { payload, response } */
export interface MessageMap {
  ADD_NOTE: {
    payload: { text: string; url: string };
    response: { ok: boolean; total: number };
  };
  GET_NOTES: {
    payload: void;
    response: { ok: boolean; notes: Note[] };
  };
  DELETE_NOTE: {
    payload: { id: number };
    response: { ok: boolean; total: number };
  };
  GET_PAGE_INFO: {
    payload: void;
    response: { ok: boolean; info?: { title: string; linkCount: number; words: number } };
  };
  TOGGLE_HIGHLIGHT_MODE: {
    payload: void;
    response: void;
  };
}

export type MessageType = keyof MessageMap;

export type MessagePayload<T extends MessageType> = MessageMap[T]['payload'];
export type MessageResponse<T extends MessageType> = MessageMap[T]['response'];
