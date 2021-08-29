# 关于 CSRF（跨站请求伪造）

有一个 恶意网站，当用户访问这个网站时对目标网站发出请求（浏览器会将目标网站的Cookie发送到服务器），尽管这个请求是来自恶意网站，但是服务器并不知情，用户也不知情。

预防：每次请求都要校验 token值，因为 token 是用户登录后生成的，token 我们一定要存在 sessionStorage 中，这样用户去访问恶意网站也不用担心被 csrf 攻击，因为你在当前页面访问另一个网址，拿到的 sessionStorage 的内容是不一样的（以理解为一个网址对应一个 sessionStorage）

![image-20210723104122572](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210723104122572.png)