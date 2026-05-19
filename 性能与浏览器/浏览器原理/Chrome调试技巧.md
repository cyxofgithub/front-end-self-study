# Chrome 调试技巧速查手册

## chrome://inspect 支持范围

| 调试目标 | 是否支持 | 依赖 |
|---|---|---|
| Android 设备 | ✅ | ADB (Android Debug Bridge) |
| iOS 设备 | ❌ | 需改用 Safari 远程调试 |
| Node.js 进程 | ✅ | 无需 ADB |
| Chrome 扩展 | ✅ | 无需 ADB |

---

## 安卓远程调试（ADB 依赖）

### 前置条件

1. **安装 ADB**

   ```bash
   # macOS
   brew install android-platform-tools

   # 或下载 Android Studio，ADB 在 SDK/platform-tools/ 目录下
   ```

2. **手机开启 USB 调试**
   - 设置 → 关于手机 → 连续点击「版本号」7 次，开启开发者选项
   - 设置 → 开发者选项 → 开启 USB 调试

3. **USB 连接电脑**，手机弹窗选择「允许 USB 调试」

### 连接步骤

```bash
# 1. 确认设备已连接
adb devices
# 输出示例：
# List of devices attached
# emulator-5554  device
# R9HT80XXXXX    device

# 2. 打开 Chrome，访问
chrome://inspect/#devices
```

- 勾选 **Discover USB devices**
- 可看到设备上已打开的页面，点击 **inspect** 即可打开 DevTools

### 无线调试（Android 11+）

```bash
# 手机：开发者选项 → 无线调试 → 配对码配对
adb pair <ip>:<port>     # 输入配对码
adb connect <ip>:<port>  # 连接
adb devices              # 确认连接
```

---

## iOS 替代方案（Safari 远程调试）

Chrome inspect 不支持 iOS，原因：iOS 上 Chrome 强制使用 WebKit，非 V8。

**替代方案：Safari 远程调试**

1. iPhone：设置 → Safari → 高级 → 开启 Web 检查器
2. macOS Safari：偏好设置 → 高级 → 勾选「在菜单栏中显示开发菜单」
3. USB 连接后，Safari 菜单栏 → 开发 → 找到设备 → 选择页面

**第三方工具（跨平台 DevTools 调试 iOS WebView）**

```bash
# ios-webkit-debug-proxy：将 Safari 调试协议转换为 Chrome DevTools Protocol
brew install ios-webkit-debug-proxy
ios_webkit_debug_proxy -f chrome-devtools://devtools/bundled/inspector.html
```

---

## ADB 常用命令速查

| 命令 | 说明 |
|---|---|
| `adb devices` | 查看已连接设备 |
| `adb shell` | 进入设备 Shell |
| `adb logcat` | 查看实时日志 |
| `adb logcat \| grep "TAG"` | 过滤日志 |
| `adb install app.apk` | 安装 APK |
| `adb uninstall com.package.name` | 卸载应用 |
| `adb pull /sdcard/file ./` | 从设备拉取文件 |
| `adb push ./file /sdcard/` | 推送文件到设备 |
| `adb forward tcp:9222 localabstract:chrome_devtools_remote` | 端口转发（手动映射 DevTools） |
| `adb reverse tcp:8080 tcp:8080` | 反向代理，让手机访问电脑 localhost |

---

## Chrome DevTools 速查

### 面板概览

| 面板 | 用途 |
|---|---|
| Elements | 查看/修改 DOM 和 CSS |
| Console | JS 执行、日志输出 |
| Sources | 源码查看、断点调试 |
| Network | 请求抓包、耗时分析 |
| Performance | 帧率、渲染、JS 执行耗时 |
| Application | Cookie、Storage、Service Worker |
| Lighthouse | 综合性能评分与建议 |

---

### 断点类型速查

| 断点类型 | 位置 | 说明 |
|---|---|---|
| 普通行断点 | Sources → 行号点击 | 执行到该行暂停 |
| 条件断点 | 行号右键 → Add conditional breakpoint | 满足条件才暂停 |
| 日志断点 | 行号右键 → Add logpoint | 不暂停，只打印日志 |
| XHR 断点 | Sources → XHR/fetch Breakpoints | 匹配 URL 的请求触发 |
| DOM 断点 | Elements → 节点右键 → Break on | 监听 DOM 修改 |
| 事件断点 | Sources → Event Listener Breakpoints | 监听特定事件（如 click） |
| 异常断点 | Sources → ⊘ 按钮 | 遇到异常自动暂停 |

---

### Console 快捷命令

```js
$0              // 当前在 Elements 面板选中的 DOM 节点
$1              // 上一个选中的节点（$2、$3 以此类推，最多 $4）
$(selector)     // 等价于 document.querySelector
$$(selector)    // 等价于 document.querySelectorAll，返回数组
$x('//path')    // XPath 查询

copy(obj)       // 将对象复制到剪贴板

console.table(arr)          // 以表格格式输出数组/对象
console.time('tag')         // 计时开始
console.timeEnd('tag')      // 计时结束，输出耗时
console.trace()             // 输出当前调用栈
console.group('name')       // 分组输出
console.groupEnd()

monitorEvents(element, 'click')    // 监听元素事件，打印事件对象
unmonitorEvents(element)           // 取消监听

monitor(fn)     // 监听函数调用，每次调用时打印参数
unmonitor(fn)   // 取消监听

getEventListeners(element)  // 获取元素上绑定的所有事件监听器
```

---

### Network 抓包技巧

| 功能 | 操作 |
|---|---|
| 过滤请求类型 | 工具栏 Fetch/XHR / JS / CSS 等 |
| 关键字过滤 | Filter 输入框，支持 `-` 排除，如 `-gif` |
| 模拟弱网 | Throttling → Slow 3G / 自定义 |
| 阻止请求 | Network 面板右键请求 → Block request URL |
| 查看 Websocket | Filter → WS |
| 持久化日志 | 勾选 Preserve log |
| 禁用缓存 | 勾选 Disable cache（DevTools 打开时生效）|
| 重发请求 | 右键请求 → Replay XHR |

---

### Overrides 替换线上资源

用于在不修改服务器的情况下，本地覆盖线上 JS/CSS/接口响应。

1. Sources → Overrides → 选择本地文件夹 → 允许授权
2. Network 面板 → 右键请求 → Save for overrides
3. 修改本地文件后刷新页面即生效，文件图标显示 `•` 表示已被覆盖

---

## 快捷键速查

| 快捷键 | 说明 |
|---|---|
| `F8` / `Cmd+\` | 暂停/继续执行 |
| `F10` / `Cmd+'` | 单步跳过（Step over） |
| `F11` / `Cmd+;` | 单步进入（Step into） |
| `Shift+F11` | 单步跳出（Step out） |
| `Ctrl+P` | 快速打开文件（Sources 内） |
| `Ctrl+Shift+F` | 全局搜索代码 |
| `Ctrl+Shift+P` | 命令面板（Run command） |
| `Esc` | 在任意面板打开/关闭 Console 抽屉 |
