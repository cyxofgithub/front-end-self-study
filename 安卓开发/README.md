# Android 学习文档导航

> 面向前端开发者的 Android 学习资料库，按 5 个阶段循序渐进。

---

## 阶段一：语言基础（16 篇）

### Java 语法

| 文件 | 主题 | 核心内容 |
|------|------|----------|
| [1.1 Java 基础语法](阶段一-语言基础/1.1-Java基础语法.md) | 变量、类型、运算符、流程控制 | 强类型 vs JS 弱类型，`==` vs `.equals()` |
| [1.2 Java 面向对象](阶段一-语言基础/1.2-Java面向对象.md) | 类、封装、继承、多态 | `extends` 单继承，`@Override`，`instanceof` |
| [1.3 Java 抽象类与接口](阶段一-语言基础/1.3-Java抽象类与接口.md) | abstract class、interface | 抽象类 = 模板，接口 = 契约 |
| [1.4 Java 异常处理](阶段一-语言基础/1.4-Java异常处理.md) | try-catch-finally、throw | 受检 vs 非受检异常，try-with-resources |
| [1.5 Java 反射基础](阶段一-语言基础/1.5-Java反射基础.md) | 运行时检查类、方法、字段 | `Class.forName()`，`getDeclaredMethod()` |

### Kotlin 语法

| 文件 | 主题 | 核心内容 |
|------|------|----------|
| [1.6 Kotlin 基础语法](阶段一-语言基础/1.6-Kotlin基础语法.md) | val/var、空安全、函数 | `?.` `?:` `!!`，字符串模板，`when` 表达式 |
| [1.7 Kotlin 类与对象](阶段一-语言基础/1.7-Kotlin类与对象.md) | 构造函数、data class、object | `data class` 自动生成 equals/copy，`object` 单例 |
| [1.8 Kotlin 继承与接口](阶段一-语言基础/1.8-Kotlin继承与接口.md) | open/abstract、接口默认实现 | 默认 `final`，`by` 委托，智能转换 |
| [1.9 Kotlin 集合](阶段一-语言基础/1.9-Kotlin集合.md) | List/Set/Map、操作符、Sequence | `filter`/`map`/`fold`，`asSequence()` 惰性求值 |
| [1.10 Kotlin 扩展函数与 Lambda](阶段一-语言基础/1.10-Kotlin扩展函数与Lambda.md) | 扩展函数、高阶函数、作用域函数 | `let`/`apply`/`also`/`run`/`with` |
| [1.11 Kotlin 高级特性](阶段一-语言基础/1.11-Kotlin高级特性.md) | Sealed Class、委托 | 穷举检查，`by lazy`，自定义属性委托 |

### Android 基础

| 文件 | 主题 | 核心内容 |
|------|------|----------|
| [1.12 Activity 与 Fragment 生命周期](阶段一-语言基础/1.12-Activity与Fragment生命周期.md) | 生命周期回调、状态保存 | onCreate→onResume→onPause→onDestroy |
| [1.13 Fragment 管理](阶段一-语言基础/1.13-Fragment管理.md) | add/replace/hide/show、返回栈 | Tab 切换模式，ViewPager 模式 |
| [1.14 Context 与 Intent](阶段一-语言基础/1.14-Context与Intent.md) | Context 类型、页面跳转、传参 | 显式/隐式 Intent，Activity Result API |
| [1.15 Handler 与 View 体系](阶段一-语言基础/1.15-Handler与View体系.md) | 线程通信、View 绘制、触摸事件 | onMeasure→onLayout→onDraw，事件分发 |
| [1.16 资源管理](阶段一-语言基础/1.16-资源管理.md) | res 目录、字符串/颜色/布局/Drawable | Shape、Selector，屏幕适配 |

---

## 阶段二：开发环境与工程认知（2 篇）

| 文件 | 主题 | 核心内容 |
|------|------|----------|
| [2.1 Android Studio 与真机调试](阶段二-开发环境与工程认知/2.1-AndroidStudio与真机调试.md) | 环境搭建、adb、打包构建、Gradle | `adb logcat`，Debug/Release，依赖管理 |
| [2.2 项目结构与仓库规范](阶段二-开发环境与工程认知/2.2-项目结构与仓库规范.md) | 多模块结构、仓库规范、开发规范 | 模块职责，路由通信，Code Review |

---

## 阶段三：业务开发能力（3 篇）

| 文件 | 主题 | 核心内容 |
|------|------|----------|
| [3.1 网络请求（FANet 基础）](阶段三-业务开发能力/3.1-网络请求-FANet.md) | FANet 同步/异步、接口定义、图片加载 | BaseResponse，分页接口，Glide/Coil |
| [3.2 线程处理](阶段三-业务开发能力/3.2-线程处理.md) | Thread、线程池、协程、Flow | `Dispatchers.IO/Main`，`suspend`，`StateFlow` |
| [3.3 MVVM 与架构模式](阶段三-业务开发能力/3.3-MVVM与架构模式.md) | MVVM、MVP、单例 | View→ViewModel→Repository，Sealed UI State |

---

## 阶段四：调试与质量（2 篇）

| 文件 | 主题 | 核心内容 |
|------|------|----------|
| [4.1 调试工具](阶段四-调试与质量/4.1-调试工具.md) | Debugger、Logcat、Layout Inspector、CodeLocator | 条件断点，APK 反编译 |
| [4.2 常见崩溃与性能优化](阶段四-调试与质量/4.2-常见崩溃与性能优化.md) | 崩溃类型、UI/内存/卡顿优化 | 内存泄漏排查，过度绘制，DiffUtil |

---

## 阶段五：业务实战（1 篇）

| 文件 | 主题 | 核心内容 |
|------|------|----------|
| [5.1 业务实战指南](阶段五-业务实战/5.1-实战指南.md) | 完整开发流程、歌曲列表示例 | 修改已有功能 → 独立开发页面 → Code Review |

---

## 推荐学习顺序

```
1.1 → 1.2 → 1.3 → 1.4 → 1.5     Java 基础（1 周）
                ↓
1.6 → 1.7 → 1.8 → 1.9 → 1.10 → 1.11   Kotlin 基础（1-2 周）
                ↓
1.12 → 1.13 → 1.14 → 1.15 → 1.16   Android 基础（1 周）
                ↓
2.1 → 2.2                         开发环境（3 天）
                ↓
3.1 → 3.2 → 3.3                   业务开发（1-2 周）
                ↓
4.1 → 4.2                         调试质量（1 周）
                ↓
5.1                               业务实战（持续）
```
