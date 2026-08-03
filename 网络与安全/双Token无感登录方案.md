# 双 Token 无感登录方案

## 一、为什么需要双 Token？

单 Token 方案的问题：如果只用一根长期有效的 Token，一旦被 XSS 或中间人攻击泄露，攻击者可以长期冒充用户操作，风险极高。

双 Token 的核心思想是**职责分离**：

| Token | 有效期 | 用途 | 存储位置 |
|-------|--------|------|----------|
| **AccessToken** | 短期（15min ~ 2h） | 调用业务接口（查数据、下单等） | 内存 / sessionStorage / localStorage |
| **RefreshToken** | 长期（7 ~ 30 天） | **仅用于刷新 AccessToken**，不参与业务请求 | HttpOnly + Secure + SameSite Cookie |

## 二、存储方案（SPA 前后端分离）

```
AccessToken  →  内存变量（首选）或 sessionStorage
                前端读取后塞进请求头 Authorization: Bearer xxx
                不存 Cookie → 天然免疫 CSRF
                缺点：有 XSS 泄露风险 → 靠短有效期止损

RefreshToken →  HttpOnly + Secure + SameSite=Strict Cookie
                JS 完全无法读取 → XSS 也偷不走
                浏览器自动携带 → 刷新接口无需前端手动传
                缺点：依赖 Cookie，刷新接口需额外做 CSRF 防护（SameSite + CSRF Token / Referer 校验）
```

> **为什么不都用 HttpOnly Cookie？** 因为业务接口如果用 Cookie 传 Token，所有请求都会自动带上，反而暴露给 CSRF。AccessToken 放在请求头里，跨域请求不会自动带，天然安全。

## 三、无感刷新流程

```
用户请求业务接口
       │
       ▼
  服务端返回 401（AccessToken 过期）
       │
       ▼
  前端响应拦截器（axios/fetch）捕获 401
       │
       ├── 判断：是否正在刷新中？
       │      ├── 是 → 把当前请求加入等待队列，不重复刷新
       │      └── 否 → 发起刷新请求 POST /auth/refresh
       │                  （浏览器自动带上 Cookie 里的 RefreshToken）
       │                        │
       │                        ▼
       │                  服务端验证 RefreshToken
       │                        │
       │              ┌─────────┴──────────┐
       │              ▼                    ▼
       │          有效                   无效 / 过期
       │              │                    │
       │              ▼                    ▼
       │     返回新 AccessToken      返回 401
       │              │                    │
       │              ▼                    ▼
       │     前端更新本地存储          清空登录态
       │     重试等待队列中的         跳转登录页
       │     所有失败请求             （用户需重新登录）
       │     用户无感知 ✅
       │     返回业务数据
```

## 四、核心代码实现

### 4.1 Token 刷新管理器

```ts
// utils/refreshToken.ts
let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: Error) => void
}> = []

function addPendingRequest() {
  return new Promise<string>((resolve, reject) => {
    pendingQueue.push({ resolve, reject })
  })
}

function onRefreshed(newToken: string) {
  pendingQueue.forEach(({ resolve }) => resolve(newToken))
  pendingQueue = []
}

function onRefreshFailed(err: Error) {
  pendingQueue.forEach(({ reject }) => reject(err))
  pendingQueue = []
}

export async function refreshAccessToken(): Promise<string> {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'same-origin', // 携带 Cookie
  })
  if (!res.ok) throw new Error('RefreshToken 已过期')
  const data = await res.json()
  return data.accessToken
}

export async function getValidAccessToken(): Promise<string> {
  // 1. 内存中的 AccessToken 还有效 → 直接用
  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken
  }

  // 2. AccessToken 过期，判断是否已有刷新任务在进行
  if (isRefreshing) {
    return addPendingRequest()  // 排队等刷新结果，避免并发刷新
  }

  // 3. 发起刷新
  isRefreshing = true
  try {
    const newToken = await refreshAccessToken()
    accessToken = newToken          // 更新内存变量
    isRefreshing = false
    onRefreshed(newToken)          // 通知所有排队请求
    return newToken
  } catch (err) {
    isRefreshing = false
    onRefreshFailed(err as Error)
    // 刷新失败 → 清空登录态，跳转登录页
    clearAuthState()
    window.location.href = '/login'
    throw err
  }
}
```

### 4.2 Axios 拦截器

```ts
// utils/http.ts
import axios from 'axios'

const http = axios.create({ baseURL: '/api' })

http.interceptors.request.use(async (config) => {
  // 跳过刷新接口本身，避免死循环
  if (config.url === '/auth/refresh') return config

  const token = await getValidAccessToken()
  config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config, response } = err
    // 401 且没重试过 → 尝试刷新
    if (response?.status === 401 && !config._retried) {
      config._retried = true
      const token = await getValidAccessToken()
      config.headers.Authorization = `Bearer ${token}`
      return http(config)   // 重试原请求
    }
    return Promise.reject(err)
  }
)
```

## 五、AccessToken 过期怎么办？

AccessToken 过期是**正常流程**，设计如此：

1. 服务端返回 `401 Unauthorized`（或自定义错误码如 `10001`）
2. 前端拦截器自动调用 `/auth/refresh`，获取新 AccessToken
3. 用新 Token 重试原请求
4. 用户全程无感知

**关键点**：用 `isRefreshing` 标志 + 等待队列，保证多个并发请求只触发一次刷新，其他请求排队等结果即可。

## 六、RefreshToken 过期怎么办？

RefreshToken 过期意味着用户**长时间未使用**（超过 7~30 天）：

1. 刷新接口返回失败（401 或自定义错误码）
2. 前端**清空本地登录态**（内存变量、sessionStorage/localStorage）
3. **跳转到登录页**，用户需要重新输入账号密码
4. 可以在登录页提示："登录已过期，请重新登录"

如果是「记住我」场景，可以搭配更长有效期的 RefreshToken（如 90 天），或在刷新失败时降级为静默重新授权（如弹出的 iframe 指向授权页 + session cookie 仍有效 → 无感续期）。

## 七、进阶：RefreshToken 轮换（Rotation）

每次使用 RefreshToken 刷新后，服务端同时**颁发新的 RefreshToken 并废弃旧的**。如果旧的 RefreshToken 被重放（攻击者先偷到并抢先使用），服务端检测到复用后立即**废弃该用户所有 RefreshToken**，强制重新登录。

```
正常流程：
  发 RefreshToken_A  →  用 A 刷新  →  返回 AccessToken + RefreshToken_B，废弃 A
                        用 A 再刷  →  检测到复用！→ 废弃 B，强制重新登录
```

这能有效**检测令牌泄露**。

## 八、总结

> **AccessToken 抛在外面短期干活，RefreshToken 藏好只负责换票。** AccessToken 过期是无感刷新的正常流程，RefreshToken 过期才是真正的「掉线」，需要用户重新登录。

### 关键禁忌

- RefreshToken 不能用来请求业务接口
- 若所有鉴权依赖 Cookie，必须额外实现 CSRF 防护
- 推荐开启 RefreshToken 轮换，进一步提升安全性
