## 是什么？

我们主要用它进行接口鉴权，它由三部分组成 **header、payload、signature**，并以 . 进行拼接

1、header ：主要声明使用的算法。声明算法的字段名为`alg`，同时还有一个`typ`的字 t 段，默认`JWT`即可。以下示例中算法为 HS256

    -   ```js
        {  "alg": "HS256",  "typ": "JWT" }

        // base64 编码后
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        ```

2、payload：这里会存放实际的内容，也就是`Token`的数据声明，例如用户的`id`和`name`，默认情况下也会携带令牌的签发时间`iat`，同时还可以设置过期时间

-   ```js
    {
      "id": "1234567890",
      "name": "John Doe",
      "iat": 1516239022
    }

    // base64 编码后
    eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9
    ```

-   signature：签名是对头部和载荷内容进行签名，一般情况，设置一个`secretKey`，对前两个的结果进行`HMACSHA25`算法，公式如下：

    -   ```
        Signature = HMACSHA256(base64Url(header)+.+base64Url(payload),secretKey)
        ```

避免结果收到篡改

## 如何实现

**生成**：借助第三方库`jsonwebtoken`，通过`jsonwebtoken` 的 `sign` 方法生成一个 `token`

```js
/** 
第一个参数指的是 Payload

第二个是秘钥，服务端特有

第三个参数是 option，可以定义 token 过期时间
*/
const jwt = require("jsonwebtoken");
const token = jwt.sign(
    {
        name: result.name,
    },
    "test_token", // secret
    { expiresIn: 60 * 60 } // 过期时间：60 * 60 s
);
```

**校验**：使用 `koa-jwt` 中间件进行验证，方式比较简单

```js
// 注意：放在路由前面
app.use(
    koajwt({
        secret: "test_token",
    }).unless({
        // 配置白名单
        path: [/\/api\/register/, /\/api\/login/],
    })
);
```

## 优缺点

优点：

-   json 具有通用性，所以可以跨语言

-   组成简单，字节占用小，便于传输

-   服务端无需保存会话信息，很容易进行水平扩展，token 保存在客户端

-   一处生成，多处使用，可以在分布式系统中，解决单点登录问题

    -   在分布式系统中，每个子系统都要获取到秘钥，那么这个子系统根据该秘钥可以发布和验证令牌，但有些服务器只需要验证令牌

        这时候可以采用非对称加密，主服务器利用自己的私钥发布令牌，子系统就可以用主的公钥验证令牌是否是主服务器发出来的，加密算法可以选择`RS256`

-   可防护 CSRF 攻击

缺点：

-   payload 部分仅仅是进行简单编码，所以只能用于存储逻辑必需的非敏感信息
-   需要保护好加密密钥，一旦泄露后果不堪设想
-   为避免 token 被劫持，最好使用 https 协议

## 真实例子

当使用 Node.js 来实现分布式系统中的非对称加密颁发令牌时，可以使用 Node.js 的加密模块 crypto 来生成密钥对、签名和验证令牌。下面是一个简单的示例代码：

```javascript
const crypto = require("crypto");

// 生成密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
});

// 颁发令牌
function issueToken(payload) {
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(JSON.stringify(payload));
    const signature = sign.sign(privateKey, "base64");
    const token = {
        payload,
        signature,
    };
    return token;
}

// 验证令牌
function verifyToken(token) {
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(JSON.stringify(token.payload));
    const isValid = verify.verify(publicKey, token.signature, "base64");
    return isValid;
}
```

```javascript
// 示例使用
const payload = {
    userId: 123456,
    role: "admin",
};

// 颁发令牌
const issuedToken = issueToken(payload);
console.log("Issued Token:", issuedToken);

// 验证令牌
const isValidToken = verifyToken(issuedToken);
console.log("Is Valid Token:", isValidToken);
```
