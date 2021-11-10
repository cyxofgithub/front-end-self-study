# 创建第一个应用

## 	Web 框架选择

# 控制器

## 状态码

默认情况下，响应的**状态码**总是**200**，我们可以通过在处理程序层添加 `@HttpCode` 装饰器来轻松更改此行为。

```typescript
import { Controller, Get, Provide, HttpCode } from '@midwayjs/decorator';
@Provide()
@Controller('/')
export class HomeController {  
    @Get('/')  
    @HttpCode(201)  
    async home() {    return 'Hello Midwayjs!';  }
}
```

tips：状态码装饰器不能在响应流关闭后（response.end 之后）修改。

## 响应头

Midway 提供 `@SetHeader` 装饰器来简单的设置自定义响应头。

```typescript
import { Controller, Get, Provide, SetHeader } from '@midwayjs/decorator';
@Provide()
@Controller('/')
export class HomeController {  
    @Get('/')  
    @SetHeader('x-bbb', '123')  
    async home() {    return 'Hello Midwayjs!';  }
}
```

当有多个响应头需要修改的时候，你可以直接传入对象。

```typescript
import { Controller, Get, Provide, SetHeader } from '@midwayjs/decorator';
@Provide()
@Controller('/')
export class HomeController {  
    @Get('/')  
    @SetHeader({    'x-bbb': '123',    'x-ccc': '234',  })  
    async home() {    return 'Hello Midwayjs!';  }
}
```

tips：响应头装饰器不能在响应流关闭后（response.end 之后）修改。

## 重定向

如果需要简单的将某个路由重定向到另一个路由，可以使用 `@Redirect` 装饰器。 `@Redirect` 装饰器的参数为一个跳转的 URL，以及一个可选的状态码，默认跳转的状态码为 `302` 。

```typescript
import { Controller, Get, Provide, Redirect } from '@midwayjs/decorator';
@Provide()
@Controller('/')
export class LoginController {  
  @Get('/login_check')  
  async check() {    // TODO  
  }
  @Get('/login')  
  @Redirect('/login_check')  
  async login() {    // TODO  }
  @Get('/login_another')  
  @Redirect('/login_check', 302)  
  async loginAnother() {    // TODO  }
}
```

tips：重定向装饰器不能在响应流关闭后（response.end 之后）修改。

## 响应类型

虽然浏览器会自动根据内容判断最佳的响应内容，但是我们经常会碰到需要手动设置的情况。我们也提供了 `@ContentType` 装饰器用于设置响应类型。

```typescript
import { Controller, Get, Provide, ContentType } from '@midwayjs/decorator';
@Provide()
@Controller('/')
export class HomeController {  
    @Get('/')  
    @ContentType('html')  
    async login() {    return '<body>hello world</body>';  }
}
```

tips：响应类型装饰器不能在响应流关闭后（response.end 之后）修改。

## 优先级

midway 已经统一对路由做排序，通配的路径将自动降低优先级，在最后被加载。

规则如下：

- 1、绝对路径规则优先级最高如 `/ab/cb/e`
- 2、星号只能出现最后且必须在/后面，`如 /ab/cb/**`
- 3、如果绝对路径和通配都能匹配一个路径时，绝对规则优先级高，比如 `/abc/*` 和 `/abc/d`，那么请求 `/abc/d` 时，会匹配到后一个绝对的路由
- 4、有多个通配能匹配一个路径时，最长的规则匹配，如 `/ab/**` 和 `/ab/cd/**` 在匹配 `/ab/cd/f` 时命中 `/ab/cd/**`
- 5、如果 `/` 与 `/*` 都能匹配 `/` ,但 `/` 的优先级高于 `/*`
- 6、如果都为通配，但是其余权重都一样，比如 `/:page/page` 和 `/page/:page` ，那么两者权重等价，以编码加载顺序为准

此规则也与 Serverless 下函数的路由规则保持一致。

简单理解为，“明确的路由优先级最高，长的路由优先级高，通配的优先级最低”。

比如：

```typescript
@Controller('/api')export class APIController {  
    @Get('/invoke/*')  
    async invokeAll() {}
  	@Get('/invoke/abc')  
    async invokeABC() {}
}
```

这种情况下，会先注册 `/invoke/abc` ，保证优先级更高。

不同的 Controller 的优先级，我们会以长度进行排序， `/` 根 Controller 我们将会最后加载。

# 服务和注入