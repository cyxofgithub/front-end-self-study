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

## Native 调用 JS

Native 调用 JS 主要通过 **evaluateJavascript**（Android）和 **evaluateJavaScript**（iOS）方法，直接执行 WebView 中的 JavaScript 代码。

### Android：evaluateJavascript

**原理**：通过 WebView 的 `evaluateJavascript` 方法执行 JS 代码。

**实现步骤**：

1. **Native 端调用 JS**：

```java
// Android 4.4+ (API 19+)
webView.evaluateJavascript("javascript:window.jsCallback('result data')", new ValueCallback<String>() {
    @Override
    public void onReceiveValue(String value) {
        // JS 返回值（如果有）
    }
});

// 调用带参数的 JS 方法
String jsCode = String.format("javascript:window.handleNativeCall('%s', '%s')",
    methodName,
    jsonParams);
webView.evaluateJavascript(jsCode, null);
```

2. **JS 端接收调用**：

```javascript
// 定义全局回调函数供 Native 调用
window.jsCallback = function (data) {
    console.log('Native 调用结果:', data);
    // 处理 Native 返回的数据
};

window.handleNativeCall = function (method, params) {
    const paramsObj = JSON.parse(params);
    // 根据 method 执行对应逻辑
    switch (method) {
        case 'updateUI':
            updateUI(paramsObj);
            break;
        case 'showToast':
            showToast(paramsObj.message);
            break;
    }
};
```

**注意**：

- API 19 以下使用 `loadUrl("javascript:xxx")`，但无法获取返回值
- 需要确保 WebView 已加载完成（在 `onPageFinished` 中调用）
- JS 代码中的字符串需要正确转义

### iOS：evaluateJavaScript

**原理**：通过 WKWebView 的 `evaluateJavaScript` 方法执行 JS 代码。

**实现步骤**：

1. **Native 端调用 JS**：

```swift
// WKWebView
webView.evaluateJavaScript("window.jsCallback('result data')") { (result, error) in
    if let error = error {
        print("JS 执行错误: \(error)")
    } else if let result = result {
        print("JS 返回值: \(result)")
    }
}

// 调用带参数的 JS 方法
let method = "handleNativeCall"
let params = ["key": "value"]
let jsonParams = try? JSONSerialization.data(withJSONObject: params)
let jsonString = String(data: jsonParams!, encoding: .utf8)!

let jsCode = "window.\(method)('\(method)', '\(jsonString)')"
webView.evaluateJavaScript(jsCode, completionHandler: nil)
```

2. **JS 端接收调用**（与 Android 相同）：

```javascript
// 定义全局回调函数供 Native 调用
window.jsCallback = function (data) {
    console.log('Native 调用结果:', data);
    // 处理 Native 返回的数据
};

window.handleNativeCall = function (method, params) {
    const paramsObj = JSON.parse(params);
    // 根据 method 执行对应逻辑
    switch (method) {
        case 'updateUI':
            updateUI(paramsObj);
            break;
        case 'showToast':
            showToast(paramsObj.message);
            break;
    }
};
```

**注意**：

- 需要在主线程调用
- JS 代码执行是异步的，通过 completionHandler 获取结果
- 字符串参数需要正确转义，避免注入攻击

### 回调机制

**实现双向通信的回调 ID 机制**：

```javascript
// JS 端：维护回调映射
const callbackMap = {};
let callbackId = 0;

// JS 调用 Native，传入回调
function callNative(method, params, callback) {
    const id = ++callbackId;
    callbackMap[id] = callback;

    // 通过 JSBridge 发送请求
    window.JSBridge.callNative(method, JSON.stringify(params), id);
}

// 提供给 Native 调用的 JS 回调函数
window.jsCallback = function (callbackId, result) {
    const callback = callbackMap[callbackId];
    if (callback) {
        callback(result);
        delete callbackMap[callbackId];
    }
};
```

```java
// Android Native 端：执行回调
public void executeCallback(String callbackId, String result) {
    String jsCode = String.format(
        "window.jsCallback('%s', %s)",
        callbackId,
        result
    );
    webView.evaluateJavascript(jsCode, null);
}
```

**优点**：实现简单、性能好、支持返回值  
**缺点**：需要确保 WebView 已加载完成、字符串转义需要注意

## 总结

JSBridge 通过 **URL Scheme 拦截** 或 **API 注入** 实现 JS 调用 Native，通过 **evaluateJavascript** 实现 Native 调用 JS，配合 **回调 ID 机制** 处理异步通信，是 Hybrid 开发和跨端开发的核心技术。
