/**
 * storage.ts —— schema 化的存储封装（企业级核心实践）
 *
 * 【企业级考点】裸写 chrome.storage 的问题：
 *  1. key 是裸字符串，全项目散落，改 key 要全局搜索
 *  2. get 返回 any，没有类型
 *  3. 默认值处理散落在各处（`result.notes ?? []` 写得到处都是）
 *  4. 没有变更订阅的统一入口
 *
 * 封装后：schema 集中定义 key + 默认值 + 类型，一处定义全局受益。
 */

/** 存储 schema：key → 值类型与默认值 */
interface StorageSchema {
  notes: import('./types').Note[];
  highlightColor: string;
}

const DEFAULTS: StorageSchema = {
  notes: [],
  highlightColor: '#ffe58f',
};

type Key = keyof StorageSchema;

export const storage = {
  /** 读取单个 key，自动填默认值，返回确定类型（非 undefined） */
  async get<K extends Key>(key: K): Promise<StorageSchema[K]> {
    // 把默认值传给 storage.get：未写入过时直接返回默认值
    const result = await chrome.storage.local.get({ [key]: DEFAULTS[key] });
    return result[key] as StorageSchema[K];
  },

  async set<K extends Key>(key: K, value: StorageSchema[K]): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  },

  /**
   * 订阅某个 key 的变化（组件内配合 useEffect 使用）
   * 返回取消订阅函数 —— React 组件卸载时清理，防止内存泄漏
   */
  subscribe<K extends Key>(key: K, callback: (newValue: StorageSchema[K]) => void): () => void {
    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string
    ) => {
      if (areaName === 'local' && changes[key]) {
        callback((changes[key].newValue ?? DEFAULTS[key]) as StorageSchema[K]);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  },
};
