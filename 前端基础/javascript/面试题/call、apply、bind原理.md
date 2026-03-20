## call、apply、bind 原理

-   call：参数需要逐个传递
-   apply：参数是一个数组
-   bind：参数需要逐个传递，不过返回的是一个函数

### js 版本

```html
<script>
    // 1.将方法挂载到我们传入的 ctx
    // 2.将挂在以后的方法调用
    // 3.将我们添加的这个属性删除掉
    Function.prototype.luckyCall = function(ctx, ...args) {
        // 给我们要指定的那个上下文对象添加一个属性，值是我们要调用的方法，因为 luckyCall 是我们所调用的方法调的，所以 this 指向它
        // 这里有个优化可以做就是 fn 这个名字可能本身在上下文对象就是一个属性，这样写可能会覆盖掉上下文对象的属性
        // 可以通过 let fn = symbol(1) 定义一个唯一的属性名
        ctx.fn = this;

        // 调用这个属性方法， this 便变成了上下文对象
        ctx.fn(...args);

        delete ctx.fn;
    };

    // 1.将方法挂载到我们传入的 ctx
    // 2.将挂在以后的方法调用
    // 3.将我们添加的这个属性删除掉
    Function.prototype.luckyApply = function(ctx, args = []) {
        // 判断参数是否是数组
        if (args && !(args instanceof Array)) {
            throw '参数得是数组';
        }

        // 给我们要指定的那个上下文对象添加一个属性，值是我们要调用的方法，因为 luckyCall 是我们所调用的方法调的，所以 this 指向它
        ctx.fn = this;

        // 调用这个属性方法， this 便变成了上下文对象
        ctx.fn(...args);

        delete ctx.fn;
    };

    Function.prototype.luckyBind = function(ctx, ...args) {
        // 返回一个函数
        return (...args2) => {
            ctx.fn = this;

            // 拼接第二次调用的参数并执行
            ctx.fn(...args.concat(args2));

            // 删除属性
            delete ctx.fn;
        };
    };
</script>
```

### ts 版本

```javascript
class BindThisUtil {
    public static call(
        fn: (...args: any[]) => any,
        obj: Record<string, any>,
        ...args: any[]
    ) {
        obj.fn = fn;
        obj.fn(...args);
        delete obj.fn;
    }

    public static apply(
        fn: (...args: any[]) => any,
        obj: Record<string, any>,
        args: any[]
    ) {
        obj.fn = fn;
        obj.fn(...args);
        delete obj.fn;
    }

    public static bind(
        fn: (...args: any[]) => any,
        obj: Record<string, any>,
        ...args: any[]
    ): (...args: any) => any {
        obj.fn = fn;

        return function (...args2: any) {
            obj.fn(...args, ...args2);
            delete obj.fn;
        };
    }
}

this.value = 456;

function testCall(a: number, b: number) {
    console.log("🚀 ~ testCall ~ a:", a);
    console.log("🚀 ~ testCall ~ b:", b);
    console.log("🚀 ~ testCall ~ this.value:", this.value);
}

// 打印 123， 123
BindThisUtil.call(
    testCall,
    {
        value: 123,
    },
    "call"
);

BindThisUtil.apply(
    testCall,
    {
        value: 123,
    },
    ["apply"]
);

const bindFn = BindThisUtil.bind(
    testCall,
    {
        value: 123,
    },
    "bind1"
);

bindFn("bind2");

```
