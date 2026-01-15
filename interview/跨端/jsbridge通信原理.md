# JSBridge 通信原理

## 什么是 JSBridge

**JSBridge** 是连接 JavaScript（Web 端）和 Native（原生端）的桥梁，实现两者之间的双向通信，让 Web 页面可以调用原生能力（如相机、定位、支付等），原生也可以调用 Web 页面的方法。

## 核心原理

### 通信架构

```
┌─────────────┐         JSBridge          ┌─────────────┐
│   WebView   │ ◄──────────────────────► │   Native    │
│  (JS 环境)  │     双向通信桥梁          │  (原生环境) │
└─────────────┘                           └─────────────┘
```

**关键点**：WebView 和 Native 运行在**隔离的运行时环境**中，需要通过 JSBridge 进行数据传递和方法调用。

## JS 调用 Native

### 方式 1：URL Scheme 拦截（通用方案）

**原理**：JS 构造特定格式的 URL，Native 拦截并解析执行。

**实现步骤**：

1. **JS 端发起请求**：

```javascript
// 使用 iframe 避免页面跳转
const iframe = document.createElement('iframe');
iframe.style.display = 'none';
iframe.src = 'jsbridge://methodName?params=xxx&callbackId=123';
document.body.appendChild(iframe);
setTimeout(() => document.body.removeChild(iframe), 100);
```

2. **Native 端拦截**：

```java
// Android
webView.setWebViewClient(new WebViewClient() {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        if (url.startsWith("jsbridge://")) {
            // 解析 URL，执行对应方法
            parseAndExecute(url);
            return true; // 拦截
        }
        return false;
    }
});
```

```swift
// iOS WKWebView
func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
    if let url = navigationAction.request.url, url.scheme == "jsbridge" {
        parseAndExecute(url)
        decisionHandler(.cancel) // 拦截
        return
    }
    decisionHandler(.allow)
}
```

**优点**：跨平台兼容性好  
**缺点**：URL 长度限制、异步处理复杂

### 方式 2：注入 API（平台特有）

#### Android：addJavascriptInterface

```java
// Native 注入对象
webView.addJavascriptInterface(new JSBridge(), "JSBridge");

public class JSBridge {
    @JavascriptInterface
    public void callNative(String method, String params) {
        // 执行原生方法
    }
}
```

```javascript
// JS 调用
window.JSBridge.callNative('getLocation', JSON.stringify({ type: 'gps' }));
```

**注意**：API 17 以下存在安全漏洞，需限制版本。

#### iOS：WKScriptMessageHandler

```swift
// Native 注册消息处理器
let config = WKWebViewConfiguration()
config.userContentController.add(self, name: "jsBridge")

class ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "jsBridge" {
            // 处理消息
            handleMessage(message.body)
        }
    }
}
```

```javascript
// JS 发送消息
window.webkit.messageHandlers.jsBridge.postMessage({
    method: 'getLocation',
    params: { type: 'gps' },
});
```

**优点**：性能好、支持复杂参数  
**缺点**：平台特定实现

## 总结

JSBridge 通过 **URL Scheme 拦截** 或 **API 注入** 实现 JS 调用 Native，通过 **evaluateJavascript** 实现 Native 调用 JS，配合 **回调 ID 机制** 处理异步通信，是 Hybrid 开发和跨端开发的核心技术。
