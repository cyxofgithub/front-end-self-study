
### 一、自定义指令的核心概念
自定义指令主要用来处理**底层DOM操作**（比如输入框聚焦、图片懒加载、按钮防抖等），这些逻辑如果用组件/普通方法实现会很繁琐，而指令可以直接绑定到元素上，写法更优雅。


### 二、自定义指令的定义方式
分为**全局指令**（全项目可用）和**局部指令**（仅当前组件可用）两种：

#### 1. 全局自定义指令
通过`app.directive()`定义，注册后整个项目的组件都能使用：
```javascript
<!-- main.js -->
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 定义全局指令 v-focus：让输入框自动聚焦
app.directive('focus', {
  // 钩子函数：元素挂载到DOM后触发（最常用）
  mounted(el) {
    el.focus() // el是绑定指令的DOM元素，可直接操作
  }
})

app.mount('#app')
```

#### 2. 局部自定义指令
在组件内通过`directives`（组合式API中直接定义变量）注册，仅当前组件可用：
```javascript
<!-- Hello.vue -->
<script setup>
// 定义局部指令 v-focus（变量名需以v开头，符合Vue命名规范）
const vFocus = {
  mounted(el) {
    el.focus()
  }
}
</script>

<template>
  <!-- 直接使用v-focus指令 -->
  <input v-focus placeholder="自动聚焦的输入框" />
</template>
```

### 三、核心：钩子函数与参数
自定义指令的逻辑写在**钩子函数**中，Vue 3提供了7个钩子（常用的是`mounted`/`updated`），同时钩子会接收核心参数，用于获取指令的绑定值、参数等。

#### 1. 全部钩子函数说明（Vue 3）

| 钩子函数      | 触发时机                                                                 | 常用场景举例                     |
|---------------|--------------------------------------------------------------------------|----------------------------------|
| `created`     | 指令绑定到元素上时（元素尚未插入 DOM）                                   | 初始化一次性的静态资源、预处理数据（极少用） |
| `beforeMount` | 绑定元素即将插入 DOM 前                                                  | 准备挂载相关的操作（一般不用）   |
| `mounted`     | 绑定元素已插入到 DOM 后                                                  | 操作真实 DOM，如聚焦、设置初始样式 |
| `beforeUpdate`| 组件更新前且相关元素还未更新，指令绑定的值已更新                          | 更新前进行同步/校验（较少用）    |
| `updated`     | 组件更新后，且相关元素内容已更新                                          | 根据绑定值变化动态同步 DOM、重设事件 |
| `beforeUnmount`| 元素即将被卸载（移出 DOM）                                               | 卸载前做一些准备性清理（较少用） |
| `unmounted`   | 元素已经解绑且移出了 DOM                                                  | 清理副作用、移除事件监听等       |

**说明：**
- 实际开发最常用的是 `mounted`、`updated`、`unmounted`。
- 钩子函数顺序与 Vue 生命周期类似，可根据业务场景定制指令行为。

#### 2. 钩子函数的核心参数
| 参数       | 说明                                                                 |
|------------|----------------------------------------------------------------------|
| `el`       | 绑定指令的DOM元素（可直接操作，如`el.style.color = 'red'`）           |
| `binding`  | 指令的绑定信息对象，包含`value`（绑定值）、`arg`（参数）、`modifiers`（修饰符） |
| `instance` | 使用该指令的组件实例（可访问组件的data/methods）                     |

### 四、实战示例：带参数/修饰符的指令
以`v-color:bg.hover="blue"`为例（设置背景色，鼠标悬浮时变色），完整示例：
```vue
<script setup>
// 定义带参数、修饰符的指令 v-color
const vColor = {
  mounted(el, binding) {
    // 解构binding中的核心属性
    const { value, arg, modifiers } = binding
    // arg是指令参数（:bg），决定改背景色还是文字色
    const styleProp = arg === 'bg' ? 'backgroundColor' : 'color'
    // 设置初始样式
    el.style[styleProp] = value

    // 修饰符.hover：鼠标悬浮时切换样式
    if (modifiers.hover) {
      const hoverHandler = () => {
        el.style[styleProp] = '#333'
        el.style.color = '#fff'
      }
      const leaveHandler = () => {
        el.style[styleProp] = value
        el.style.color = ''
      }
      // 绑定事件
      el.addEventListener('mouseenter', hoverHandler)
      el.addEventListener('mouseleave', leaveHandler)
      // 缓存事件函数，方便卸载时清理
      el._colorHandlers = [hoverHandler, leaveHandler]
    }
  },
  // 卸载时清理事件，避免内存泄漏
  unmounted(el, binding) {
    if (modifiers.hover && el._colorHandlers) {
      el.removeEventListener('mouseenter', el._colorHandlers[0])
      el.removeEventListener('mouseleave', el._colorHandlers[1])
    }
  }
}
</script>

<template>
  <!-- 使用指令：参数bg（背景色）、修饰符hover（悬浮）、绑定值blue -->
  <div v-color:bg.hover="blue" style="padding: 20px;">
    鼠标悬浮我会变色
  </div>
</template>
```

#### 简化写法：函数式指令
如果只需要在`mounted`和`updated`执行相同逻辑，可简化为函数：
```vue
<script setup>
// 函数式指令：v-color="red" 直接设置文字色
const vColor = (el, binding) => {
  el.style.color = binding.value
}
</script>

<template>
  <div v-color="red">红色文字</div>
</template>
```

### 五、Vue 2 vs Vue 3 差异（简要）
| 维度       | Vue 2                          | Vue 3                          |
|------------|--------------------------------|--------------------------------|
| 全局注册   | `Vue.directive('focus', { ... })` | `app.directive('focus', { ... })` |
| 核心钩子   | `bind`/`inserted`/`unbind`     | `mounted`/`unmounted`（更直观） |
| 局部注册   | 组件内`directives`选项         | 组合式API中直接定义`vXXX`变量  |

### 六、常用应用场景
1. 输入框自动聚焦（`v-focus`）
2. 图片懒加载（`v-lazy`）
3. 按钮防抖/节流（`v-debounce`/`v-throttle`）
4. 权限控制（`v-permission`：无权限则隐藏元素）
5. 拖拽功能（`v-drag`）

### 总结
1. Vue自定义指令专注于**封装DOM相关的可复用逻辑**，是内置指令的补充，适合处理聚焦、防抖、样式控制等场景；
2. 指令分全局/局部定义，核心是钩子函数（常用`mounted`）和参数（`el`/`binding`）；
3. 简单场景用**函数式指令**简化写法，复杂场景需注意清理副作用（如移除事件监听），避免内存泄漏。