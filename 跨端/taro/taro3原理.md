### Taro3 运行时适配的核心原理

Taro3 实现跨端运行时适配的核心是 **“中间层抽象 + 运行时桥接”**：

1. **统一抽象层**：定义一套与端无关的标准组件/API 接口（如 `<View>`、`wx.navigateTo` 等）；
2. **运行时适配器**：不同端（微信小程序、H5、React Native）提供对应的适配器，将抽象层的调用映射到原生能力；
3. **动态挂载**：运行时根据当前环境自动加载对应的适配器，完成“抽象调用 → 原生实现”的转换。

---

### 极简版 Taro 运行时适配框架（mini-taro）

下面我会写一个只有核心逻辑的 mini 版本，包含 **抽象层、适配器、运行时核心** 三部分，能清晰体现 Taro3 的适配原理。

```javascript
// ====================== 1. 核心抽象层（统一接口定义） ======================
// 定义跨端组件的抽象类
class AbstractComponent {
    constructor(props) {
        this.props = props;
    }
    // 渲染方法（由各端适配器实现）
    render() {
        throw new Error('子类必须实现 render 方法');
    }
}

// 定义跨端 API 的抽象对象
const AbstractAPI = {
    navigateTo(url) {
        throw new Error('当前环境未实现 navigateTo 方法');
    },
    showToast(title) {
        throw new Error('当前环境未实现 showToast 方法');
    },
};

// ====================== 2. 各端适配器实现 ======================
// 微信小程序适配器
const WeappAdapter = {
    // 组件适配器
    View: class WeappView extends AbstractComponent {
        render() {
            return `<view ${this.props ? JSON.stringify(this.props) : ''}>${
                this.props.children
            }</view>`;
        }
    },
    Text: class WeappText extends AbstractComponent {
        render() {
            return `<text>${this.props.children}</text>`;
        }
    },
    // API 适配器
    api: {
        navigateTo(url) {
            console.log(`【微信小程序】跳转到: ${url}`);
            // 实际会调用 wx.navigateTo({ url })
        },
        showToast(title) {
            console.log(`【微信小程序】提示: ${title}`);
            // 实际会调用 wx.showToast({ title })
        },
    },
};

// H5 适配器
const H5Adapter = {
    // 组件适配器
    View: class H5View extends AbstractComponent {
        render() {
            return `<div ${this.props ? JSON.stringify(this.props) : ''}>${
                this.props.children
            }</div>`;
        }
    },
    Text: class H5Text extends AbstractComponent {
        render() {
            return `<span>${this.props.children}</span>`;
        }
    },
    // API 适配器
    api: {
        navigateTo(url) {
            console.log(`【H5】跳转到: ${url}`);
            window.location.href = url;
        },
        showToast(title) {
            console.log(`【H5】提示: ${title}`);
            alert(title);
        },
    },
};

// ====================== 3. 运行时核心（环境检测 + 适配器挂载） ======================
class MiniTaro {
    constructor() {
        this.adapter = null;
        this.components = {};
        this.api = {};
        // 初始化：检测环境并挂载适配器
        this.init();
    }

    // 检测当前运行环境
    detectEnv() {
        // 简化版环境检测：实际 Taro 会通过 process.env.TARO_ENV 或全局变量判断
        if (typeof wx !== 'undefined' && wx.miniProgram) {
            return 'weapp';
        } else if (typeof window !== 'undefined') {
            return 'h5';
        } else {
            throw new Error('不支持的运行环境');
        }
    }

    // 初始化适配器
    init() {
        const env = this.detectEnv();
        // 根据环境加载对应适配器
        switch (env) {
            case 'weapp':
                this.adapter = WeappAdapter;
                break;
            case 'h5':
                this.adapter = H5Adapter;
                break;
        }
        // 挂载组件和 API 到全局
        this.components = this.adapter;
        this.api = this.adapter.api;
    }

    // 创建组件（对外暴露的统一接口）
    createComponent(type, props) {
        const ComponentClass = this.components[type];
        if (!ComponentClass) {
            throw new Error(`未找到 ${type} 组件的适配实现`);
        }
        return new ComponentClass(props);
    }
}

// ====================== 4. 使用示例 ======================
// 初始化 mini-taro
const taro = new MiniTaro();

// 1. 创建跨端组件
const view = taro.createComponent('View', {
    className: 'container',
    children: taro
        .createComponent('Text', { children: 'Hello Mini Taro' })
        .render(),
});
console.log('组件渲染结果:', view.render());

// 2. 调用跨端 API
taro.api.navigateTo('/pages/home');
taro.api.showToast('运行时适配成功！');
```

### 代码核心解释

1. **抽象层（AbstractComponent/AbstractAPI）**  
   定义了所有端都要遵守的“标准接口”，不管是小程序还是 H5，组件都必须实现 `render` 方法，API 都必须实现 `navigateTo/showToast` 方法，这是跨端的基础。

2. **适配器层（WeappAdapter/H5Adapter）**  
   针对不同端的特性，实现抽象层定义的接口：

    - 组件：小程序的 `<view>` 对应 H5 的 `<div>`，`<text>` 对应 `<span>`；
    - API：小程序的 `wx.navigateTo` 对应 H5 的 `window.location.href`。

3. **运行时核心（MiniTaro 类）**
    - `detectEnv`：检测当前运行环境（小程序/H5），对应 Taro 中的环境判断逻辑；
    - `init`：根据环境加载对应的适配器，完成“抽象接口 → 原生实现”的映射；
    - `createComponent`：对外暴露统一的组件创建方法，用户无需关心底层是哪个端的实现。

### 总结

Taro3 运行时适配的核心要点：

1. **接口抽象**：定义与端无关的统一组件/API 接口，屏蔽各端差异；
2. **适配器模式**：为每个端实现对应的适配器，完成抽象接口到原生能力的映射；
3. **运行时挂载**：启动时检测环境，动态加载对应适配器，让同一套代码能调用不同端的原生能力。

这个极简版框架剥离了 Taro3 的编译、虚拟 DOM 等复杂逻辑，只保留了**运行时适配的核心骨架**，你可以基于这个基础，进一步扩展（比如添加 RN 适配器、更多 API），加深对原理的理解。
