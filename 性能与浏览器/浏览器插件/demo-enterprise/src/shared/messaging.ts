/**
 * messaging.ts —— 类型安全的消息层（企业级核心实践）
 *
 * 【企业级考点】为什么真实项目要封装消息层？
 *  1. 类型安全：sendMessage('ADD_NOTE', {...}) 的 payload 和返回值都有类型推导，
 *     写错消息名/字段名直接编译报错
 *  2. Promise 化：原生是回调风格，封装后 await 即可，配合 async/await
 *  3. 统一出口：消息协议改动只需改 types.ts 一处，全项目联动检查
 *  4. 集中打点/日志：封装层可以统一加监控（真实项目会接埋点上报）
 *
 * 真实大厂项目还会进一步用 webext-bridge / @extend-chrome/messages 等库，
 * 解决 content script 无法直接给 popup 发消息等场景。
 */
import type {
  MessageMap,
  MessagePayload,
  MessageResponse,
  MessageType,
} from './types';

interface Envelope<T extends MessageType> {
  type: T;
  payload: MessagePayload<T>;
}

/** 发送消息给 background（popup / options / content 都可用） */
export function sendToBackground<T extends MessageType>(
  type: T,
  payload: MessagePayload<T>
): Promise<MessageResponse<T>> {
  const envelope: Envelope<T> = { type, payload };
  return chrome.runtime.sendMessage(envelope);
}

/** 发送消息给指定标签页的 content script（background / popup 可用） */
export function sendToContent<T extends MessageType>(
  tabId: number,
  type: T,
  payload: MessagePayload<T>
): Promise<MessageResponse<T>> {
  const envelope: Envelope<T> = { type, payload };
  return chrome.tabs.sendMessage(tabId, envelope);
}

type Handler<T extends MessageType> = (
  payload: MessagePayload<T>,
  sender: chrome.runtime.MessageSender
) => Promise<MessageResponse<T>> | MessageResponse<T>;

/**
 * 注册消息处理器（background / content 侧使用）
 *
 * 自动处理 MV3 的"异步响应必须 return true"坑：
 * 封装层统一 return true，业务 handler 只管返回 Promise。
 */
export function onMessage<T extends MessageType>(
  type: T,
  handler: Handler<T>
): void {
  chrome.runtime.onMessage.addListener((envelope: Envelope<MessageType>, sender, sendResponse) => {
    if (envelope.type !== type) return false;

    Promise.resolve(handler(envelope.payload as MessagePayload<T>, sender))
      .then(sendResponse)
      .catch((err) => {
        console.error(`[messaging] handler for "${type}" failed:`, err);
        sendResponse({ ok: false, error: String(err) });
      });

    return true; // 统一保持通道开放，业务代码不用记这个坑
  });
}

/** 一次性注册多个 handler（background 入口用，保持入口文件干净） */
export function registerHandlers(handlers: {
  [T in MessageType]?: Handler<T>;
}): void {
  for (const [type, handler] of Object.entries(handlers)) {
    if (handler) onMessage(type as MessageType, handler as Handler<MessageType>);
  }
}
