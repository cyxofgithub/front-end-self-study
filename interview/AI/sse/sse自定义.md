## sse自定义

### 基于 fetch + AbortController（推荐，现代浏览器）

AbortController是浏览器原生的请求中断控制器，是终止 fetch 请求的标准方式，适配自定义 SSE 的关闭逻辑最优雅。

```javascript
class CustomSSE {
  constructor(url, options = {}) {
    this.url = url;
    // 配置默认值：必选SSE请求头、回调函数等
    this.options = {
      headers: { 'Accept': 'text/event-stream' }, // SSE核心请求头
      // 是否携带跨域cookie（目前fetch标准下SSE一般不需要携带cookie，默认false）
      withCredentials: false,
      onMessage: () => {}, // 消息接收回调
      onError: () => {},   // 错误回调
      ...options
    };
    this.controller = null; // AbortController实例（中断请求核心）
    this.reader = null;     // 响应体读取器
    this.isClosed = false;  // 标记是否主动关闭
  }

  // 解析SSE格式消息（处理分块返回的核心逻辑）
  async parseSSEStream(stream) {
    const decoder = new TextDecoder('utf-8');
    this.reader = stream.getReader();
    let buffer = ''; // 缓存未完整解析的字符

    try {
      while (!this.isClosed) {
        const { done, value } = await this.reader.read();
        if (done) break; // 流结束则退出解析

        // 解码并拼接缓存
        buffer += decoder.decode(value, { stream: true });
        // 按SSE规范分割消息（\n\n是消息分隔符）
        const lines = buffer.split(/\r?\n\r?\n/);
        // 最后一行可能不完整，放回缓存
        buffer = lines.pop() || '';

        // 解析每条完整的SSE消息
        for (const line of lines) {
          if (!line.trim()) continue;
          const dataMatch = line.match(/^data:\s*(.+)$/m);
          if (dataMatch) {
            this.options.onMessage({ data: dataMatch[1] }); // 透传消息
          }
        }
      }
    } catch (error) {
      // 仅处理非主动关闭的错误
      if (!this.isClosed) this.options.onError(error);
    } finally {
      // 释放读取器，避免内存泄漏
      if (this.reader) {
        await this.reader.releaseLock();
        this.reader = null;
      }
    }
  }

  // 建立自定义SSE连接
  async connect() {
    // 避免重复连接
    if (this.isClosed || (this.controller && !this.controller.signal.aborted)) return;

    // 创建新的中断控制器
    this.controller = new AbortController();
    const signal = this.controller.signal;

    try {
      const response = await fetch(this.url, {
        method: 'GET',
        headers: this.options.headers,
        withCredentials: this.options.withCredentials,
        signal // 绑定中断信号到请求
      });

      if (!response.ok) throw new Error(`HTTP错误：${response.status}`);
      // 流式读取响应体
      await this.parseSSEStream(response.body);
    } catch (error) {
      // 排除主动中断的AbortError，避免误判为异常
      if (error.name !== 'AbortError' && !this.isClosed) {
        this.options.onError(error);
        // 可选：非主动关闭时自动重连
        // setTimeout(() => this.connect(), 3000);
      }
    }
  }

  // 关闭/中断自定义SSE连接（核心方法）
  close() {
    this.isClosed = true; // 标记主动关闭，阻止后续解析

    // 1. 终止HTTP长连接（核心操作）
    if (this.controller) {
      this.controller.abort(); // 中断fetch请求
      this.controller = null;
    }

    // 2. 取消响应体读取（如果正在读取）
    if (this.reader && !this.reader.closed) {
      this.reader.cancel('主动关闭SSE连接');
    }

    console.log('基于fetch的自定义SSE连接已关闭');
  }
}

// 使用示例
const customSSE = new CustomSSE('/api/sse', {
  onMessage: (event) => console.log('收到消息:', event.data),
  onError: (error) => console.error('SSE错误:', error)
});

// 建立连接
customSSE.connect();

// 手动关闭（比如点击按钮）
document.getElementById('closeBtn').addEventListener('click', () => {
  customSSE.close();
});

// 页面卸载时强制关闭（必做，避免残留连接）
window.addEventListener('beforeunload', () => {
  customSSE.close();
});
```

### 基于 XMLHttpRequest（兼容旧浏览器）
如果需要兼容低版本浏览器（如 IE），可使用 XHR 实现，核心是调用xhr.abort()终止请求：
```javascript
class CustomSSE_XHR {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      headers: { 'Accept': 'text/event-stream' },
      onMessage: () => {},
      onError: () => {},
      ...options
    };
    this.xhr = null;       // XHR实例
    this.lastPosition = 0; // 记录已读取的响应长度
    this.isClosed = false;
  }

  // 解析SSE消息（基于XHR的流式读取）
  parseSSEData() {
    if (!this.xhr || this.isClosed) return;

    // 截取新增的响应内容（避免重复解析）
    const responseText = this.xhr.responseText || '';
    const newData = responseText.substring(this.lastPosition);
    if (!newData) return;

    this.lastPosition = responseText.length;
    // 解析逻辑与fetch版本一致
    const lines = newData.split(/\r?\n\r?\n/);
    for (const line of lines) {
      if (!line.trim()) continue;
      const dataMatch = line.match(/^data:\s*(.+)$/m);
      if (dataMatch) this.options.onMessage({ data: dataMatch[1] });
    }
  }

  // 建立连接
  connect() {
    if (this.isClosed || (this.xhr && this.xhr.readyState !== 4)) return;

    this.xhr = new XMLHttpRequest();
    this.xhr.open('GET', this.url);

    // 设置SSE请求头
    Object.entries(this.options.headers).forEach(([key, value]) => {
      this.xhr.setRequestHeader(key, value);
    });

    // 监听响应状态变化（readyState=3表示正在接收数据）
    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState === 3 && !this.isClosed) {
        this.parseSSEData(); // 实时解析新增数据
      } else if (this.xhr.readyState === 4 && !this.isClosed) {
        // 连接意外断开，触发错误回调
        this.options.onError(new Error('SSE连接意外断开'));
        // 可选重连：setTimeout(() => this.connect(), 3000);
      }
    };

    // 监听XHR错误
    this.xhr.onerror = (error) => {
      if (!this.isClosed) this.options.onError(error);
    };

    this.xhr.send();
  }

  // 关闭连接
  close() {
    this.isClosed = true;

    // 1. 终止XHR长连接（核心）
    if (this.xhr) {
      this.xhr.abort(); // 中断请求
      // 清理事件监听，避免内存泄漏
      this.xhr.onreadystatechange = null;
      this.xhr.onerror = null;
      this.xhr = null;
    }

    this.lastPosition = 0; // 重置读取位置
    console.log('基于XHR的自定义SSE连接已关闭');
  }
}

// 使用示例
const customSSE_XHR = new CustomSSE_XHR('/api/sse', {
  onMessage: (event) => console.log('XHR版SSE消息:', event.data)
});
customSSE_XHR.connect();

// 关闭连接
document.getElementById('closeXhrBtn').addEventListener('click', () => {
  customSSE_XHR.close();
});
```