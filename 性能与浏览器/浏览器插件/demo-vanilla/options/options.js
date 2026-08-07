/**
 * options.js —— 选项页脚本
 *
 * 【考点】chrome.storage.local vs chrome.storage.sync：
 *  - local：存本机，容量大（约 10MB），不同步
 *  - sync：跟随 Google 账号跨设备同步，配额严格
 *    （总 100KB，单条 8KB，写频率也有限制）
 *  - session：只存内存，浏览器关闭即清，worker 休眠不丢
 *  - content script 里的 localStorage 是【网站】的，不是扩展的！
 *    扩展自己的持久化统一走 chrome.storage。
 *
 * 本 demo：笔记存 local（量大、不必同步），颜色偏好存 sync（跨设备）。
 */

const colorInput = document.getElementById('color');
const status = document.getElementById('status');

// 读取：sync 优先，local 兜底（演示两个 area 的配合）
(async function init() {
  const syncData = await chrome.storage.sync.get('highlightColor');
  const localData = await chrome.storage.local.get('highlightColor');
  colorInput.value = syncData.highlightColor ?? localData.highlightColor ?? '#ffe58f';
})();

// 保存：同时写 sync（跨设备）和 local（content script 读 local，避免 sync 配额消耗）
colorInput.addEventListener('change', async () => {
  const color = colorInput.value;
  await chrome.storage.sync.set({ highlightColor: color });
  await chrome.storage.local.set({ highlightColor: color });

  status.textContent = '已保存 ✓（所有已打开页面实时生效）';
  setTimeout(() => (status.textContent = ''), 2000);
  // 注意：不需要给 content script 发消息 —— content 里监听了
  // chrome.storage.onChanged，会自动应用新颜色。
});
