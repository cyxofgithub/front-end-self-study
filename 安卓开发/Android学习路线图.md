# Android 学习路线图

> 基于团队要求的 Android 开发知识体系，分五个阶段循序渐进。
> 每个知识点包含核心概念说明和前端类比，方便有前端经验的开发者快速建立理解。

---

## 阶段一：语言基础

### 1.1 Java 语法

#### 基础语法

**变量与数据类型**

Java 是静态类型语言，变量必须先声明类型再使用。

```java
// 基本数据类型
int age = 25;
double price = 99.9;
boolean isActive = true;
char grade = 'A';

// 引用类型
String name = "Android";
int[] numbers = {1, 2, 3};
```

| 概念 | 说明 | 前端类比 |
|------|------|----------|
| `int`, `double`, `boolean` | 基本类型（原始类型） | JS 的 `number`, `boolean`，但 Java 不会隐式转换 |
| `String` | 字符串，引用类型 | JS 的 `string`，但 Java 中 String 不可变 |
| `int[]` | 数组 | JS 的 `Array`，但长度固定 |
| `final` | 常量修饰符 | JS 的 `const` |

**运算符**

与 JS/TS 基本一致（`+`, `-`, `*`, `/`, `%`, `&&`, `||`, `==`, `!=`）。

关键区别：
- Java 的 `==` 比较基本类型是值比较，比较对象是引用比较（类似 JS 的 `===` 对对象的行为）
- 字符串比较用 `.equals()` 方法，不用 `==`

```java
String a = "hello";
String b = new String("hello");
a.equals(b);  // true — 值比较
a == b;       // false — 引用比较
```

**流程控制**

```java
// if-else — 与 JS 一致
if (score >= 90) {
    // ...
} else if (score >= 60) {
    // ...
} else {
    // ...
}

// switch — Java 支持String、enum，类似 TS
switch (day) {
    case "Monday": break;
    case "Friday": break;
    default: break;
}

// for 循环
for (int i = 0; i < 10; i++) { /* ... */ }
for (String item : list) { /* ... */ }  // 增强for，类似 for...of

// while / do-while — 与 JS 一致
```

---

#### 面向对象

**类与对象**

```java
public class User {
    // 字段（成员变量）
    private String name;
    private int age;

    // 构造函数
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 方法
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

// 使用
User user = new User("张三", 25);
```

前端类比：类语法与 ES6 Class 非常相似，但 Java 的访问控制（`public`/`private`/`protected`）是语言级别强制的。

**封装**

通过访问修饰符控制字段可见性，配合 getter/setter：

```java
public class User {
    private String name;  // 外部不能直接访问

    public String getName() { return name; }          // 只读
    public void setName(String name) {                 // 可写
        this.name = name;
    }
}
```

**继承**

```java
// 父类
public class Animal {
    protected String name;

    public void eat() {
        System.out.println(name + " is eating");
    }
}

// 子类
public class Dog extends Animal {  // 单继承
    public void bark() {
        System.out.println(name + " is barking");
    }
}
```

前端类比：`extends` 关键字一样，Java 是单继承（只能继承一个类）。

**多态**

```java
Animal animal = new Dog();  // 父类引用指向子类对象
animal.eat();               // 调用 Dog 的 eat（如果 Dog 重写了的话）

// 方法重写
@Override
public void eat() {
    System.out.println("Dog eats bone");
}
```

---

#### 抽象类与接口

```java
// 抽象类 — 不能实例化，可以包含具体方法
public abstract class Shape {
    abstract double area();           // 抽象方法，子类必须实现
    public void print() { ... }       // 具体方法
}

// 接口 — 纯契约（Java 8+ 可有 default 方法）
public interface Clickable {
    void onClick();
    default void onLongClick() { }    // 默认实现
}

// 一个类可以实现多个接口
public class Button implements Clickable, Viewable {
    @Override
    public void onClick() { /* ... */ }
}
```

前端类比：接口类似 TypeScript 的 `interface`，抽象类类似带有部分实现的 abstract class。

---

#### 异常处理

```java
try {
    int result = 10 / 0;  // 会抛出 ArithmeticException
} catch (ArithmeticException e) {
    System.out.println("计算错误: " + e.getMessage());
} catch (Exception e) {
    System.out.println("通用异常: " + e.getMessage());
} finally {
    // 无论是否异常都会执行，类似 JS 的 finally
    System.out.println("清理资源");
}
```

异常体系：
- `Throwable` — 所有错误的祖先
  - `Error` — 系统级错误（如 OutOfMemoryError），不应捕获
  - `Exception` — 可处理的异常
    - 受检异常（Checked）— 必须 try-catch 或 throws 声明，如 `IOException`
    - 非受检异常（Unchecked / RuntimeException）— 可选处理，如 `NullPointerException`

---

#### 反射基础

运行时检查和操作类、方法、字段的能力。

```java
Class<?> clazz = Class.forName("com.example.User");
Method[] methods = clazz.getDeclaredMethods();
Field[] fields = clazz.getDeclaredFields();

// 通过反射创建实例、调用方法
Object instance = clazz.newInstance();
Method method = clazz.getMethod("setName", String.class);
method.invoke(instance, "张三");
```

前端类比：类似 JS 的 `obj[methodName]()` 动态调用，但 Java 的反射是类型安全的且功能更强大。Android 中 Retrofit、Gson 等库大量使用反射。

---

### 1.2 Kotlin 语法

Kotlin 是 Android 官方推荐语言，更简洁安全。

#### 基础语法

**val / var**

```kotlin
val name = "张三"    // 只读变量（类似 Java final），类比 JS const
var age = 25         // 可变变量，类比 JS let
```

**类型推断**

Kotlin 编译器能自动推断类型，不需要显式声明：

```kotlin
val message = "Hello"      // 推断为 String
val count = 42             // 推断为 Int
val list = listOf(1, 2, 3) // 推断为 List<Int>
```

**空安全（核心特性）**

```kotlin
var name: String = "张三"   // 不可为 null
var nickname: String? = null // 可为 null（类型后加 ?）

// 安全调用操作符 ?.
val len = nickname?.length   // 如果 nickname 为 null，返回 null，不崩溃

// Elvis 操作符 ?:
val len2 = nickname?.length ?: 0  // 如果为 null，使用默认值 0

// 非空断言 !!（谨慎使用）
val len3 = nickname!!.length  // 如果为 null，抛出 NullPointerException
```

前端类比：类似 TypeScript 的可选链 `?.` 和空值合并 `??`，但 Kotlin 在编译期强制检查空安全。

**函数定义**

```kotlin
// 普通函数
fun add(a: Int, b: Int): Int {
    return a + b
}

// 单表达式函数
fun add(a: Int, b: Int): Int = a + b

// 默认参数
fun greet(name: String, greeting: String = "你好") {
    println("$greeting, $name")  // 字符串模板，类似 JS 模板字符串
}

// 命名参数调用
greet(name = "张三", greeting = "早上好")
```

---

#### 类与对象

```kotlin
// 主构造函数 + init 块
class User(val name: String, var age: Int) {
    init {
        // 初始化时执行，类似 JS constructor 中的逻辑
        require(age >= 0) { "Age cannot be negative" }
    }
}

// data class — 自动生成 equals、hashCode、toString、copy
data class Article(
    val id: Int,
    val title: String,
    val author: String
)

// object — 单例对象
object DatabaseHelper {
    fun connect() { /* ... */ }
}
// 调用：DatabaseHelper.connect()，类似 JS 的单例模式
```

---

#### 继承与接口

```kotlin
// Kotlin 类默认是 final 的，需要 open 才能被继承
open class Animal(val name: String) {
    open fun sound() = "Some sound"  // 需要 open 才能被重写
}

class Dog(name: String) : Animal(name) {
    override fun sound() = "Woof!"   // 重写必须加 override
}

// 抽象类
abstract class Shape {
    abstract fun area(): Double
}

// 接口 — 可以有默认实现
interface Clickable {
    fun onClick()
    fun onLongClick() { /* 默认实现 */ }
}

// 接口委托（delegation）
class Button(clickHandler: ClickHandler) : Clickable by clickHandler
// Button 把 Clickable 的实现委托给 clickHandler
```

---

#### 集合

```kotlin
// 不可变集合（默认）
val list = listOf(1, 2, 3)           // List<Int>
val set = setOf("a", "b", "c")       // Set<String>
val map = mapOf("key" to "value")    // Map<String, String>

// 可变集合
val mutableList = mutableListOf(1, 2, 3)
mutableList.add(4)

// 集合操作符（类似 JS 数组方法）
list.filter { it > 1 }               // 类似 .filter()
     .map { it * 2 }                 // 类似 .map()
     .sorted()                       // 类似 .sort()
     .forEach { println(it) }        // 类似 .forEach()

// 序列（Sequence）— 惰性求值，类似 JS 的生成器链式调用
val result = (1..100).asSequence()
    .filter { it % 2 == 0 }
    .map { it * it }
    .take(5)
    .toList()
```

---

#### 扩展函数

给已有类添加方法，无需修改原始类：

```kotlin
// 给 String 添加扩展函数
fun String.isEmail(): Boolean {
    return this.contains("@") && this.contains(".")
}

// 使用
"test@example.com".isEmail()  // true
```

前端类比：类似 TypeScript 的 declaration merging 或 JS 的 prototype 扩展，但 Kotlin 扩展函数是静态解析的，更安全。

---

#### 高阶函数与 Lambda

```kotlin
// 高阶函数 — 接受函数作为参数
fun performOperation(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

// Lambda 表达式
performOperation(3, 4) { x, y -> x + y }  // 返回 7

// 常见用途：集合操作
list.filter { it > 2 }
list.map { it.toString() }

// it — 单参数 Lambda 的隐式名称
list.forEach { println(it) }
```

前端类比：完全类似 JS 的箭头函数和高阶函数（`Array.map`、`Array.filter` 等）。

---

#### Sealed Class / Object

限定类的继承层级，用于表示有限的状态集合：

```kotlin
sealed class UiState {
    object Loading : UiState()             // 单例状态
    data class Success(val data: String) : UiState()  // 带数据的状态
    data class Error(val message: String) : UiState()
}

// when 表达式必须覆盖所有分支（编译器检查）
fun handleState(state: UiState) = when (state) {
    is UiState.Loading -> showLoading()
    is UiState.Success -> showData(state.data)
    is UiState.Error -> showError(state.message)
}
```

前端类比：类似 TypeScript 的 discriminated union（可辨识联合类型），但 Kotlin 编译器强制穷举检查。

---

#### 委托（by）

```kotlin
// by lazy — 惰性初始化，首次访问时才计算
val expensiveObject: HeavyClass by lazy {
    HeavyClass()  // 只在第一次访问时创建
}

// by map — 用 Map 作为属性存储
class User(map: Map<String, Any?>) {
    val name: String by map
    val age: Int by map
}

// Delegate 接口 — 自定义属性委托
class Observable<T>(initialValue: T) : ReadWriteProperty<Any?, T> {
    private var value = initialValue
    override fun getValue(thisRef: Any?, property: KProperty<*>): T = value
    override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
        println("${property.name} changed from ${this.value} to $value")
        this.value = value
    }
}
```

---

### 1.3 Android 基础

#### Activity / Fragment 生命周期

**Activity 生命周期（核心）**

```
 onCreate()    → 创建，初始化布局和数据
    ↓
 onStart()     → 可见但不可交互
    ↓
 onResume()    → 可见可交互，前台运行
    ↓
 [Activity 运行中]
    ↓
 onPause()     → 失去焦点（如对话框遮挡）
    ↓
 onStop()      → 完全不可见（如切到其他应用）
    ↓
 onDestroy()   → 被销毁
```

前端类比：类似 React 组件的生命周期 — `onCreate` ≈ `constructor` + `componentDidMount`，`onDestroy` ≈ `componentWillUnmount`。

**Fragment 生命周期**

Fragment 是 Activity 中的模块化 UI 片段，生命周期类似 Activity 但更复杂：

```
onAttach → onCreate → onCreateView → onViewCreated → onStart → onResume
[运行中]
onPause → onStop → onDestroyView → onDestroy → onDetach
```

---

#### Fragment 管理

```kotlin
val fragment = supportFragmentManager.beginTransaction()
// 基本操作
fragment.add(R.id.container, MyFragment())        // 添加
fragment.replace(R.id.container, MyFragment())     // 替换
fragment.hide(existingFragment)                    // 隐藏（不销毁）
fragment.show(existingFragment)                    // 显示
fragment.remove(existingFragment)                  // 移除

// 返回栈（类似浏览器历史栈）
fragment.addToBackStack("tag")  // 按 back 可回退

fragment.commit()  // 提交事务
```

前端类比：Fragment 类似前端的路由组件/页面片段，FragmentManager 类似路由管理器，`addToBackStack` 类似 `history.push`。

---

#### Context

Context 是 Android 的"上帝对象"，提供访问系统资源和类的接口。

| 类型 | 说明 | 类比 |
|------|------|------|
| Activity | 页面级别的 Context | 组件实例（`this`） |
| Application | 应用级别的 Context | 全局 App 实例 |
| 什么时候用哪个 | UI 相关用 Activity Context；生命周期长的（单例）用 Application Context | — |

常见用途：
- 加载资源：`context.getString(R.string.app_name)`
- 启动 Activity：`context.startActivity(intent)`
- 获取系统服务：`context.getSystemService(Context.CONNECTIVITY_SERVICE)`

---

#### Intent 与页面跳转

```kotlin
// 显式 Intent — 跳转到指定页面
val intent = Intent(this, DetailActivity::class.java)
intent.putExtra("id", 123)          // 传递参数
intent.putExtra("name", "张三")
startActivity(intent)

// 接收参数（在目标 Activity 中）
val id = intent.getIntExtra("id", 0)
val name = intent.getStringExtra("name")

// 隐式 Intent — 调用系统功能
val callIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:10086"))
startActivity(callIntent)

// 带回调的跳转
val intent = Intent(this, EditActivity::class.java)
startActivityForResult(intent, REQUEST_CODE)
```

前端类比：Intent 类似路由导航（`router.push({ path, query })`），`putExtra` 类似传 query 参数。

---

#### 基础组件

| 组件 | 说明 | 前端类比 |
|------|------|----------|
| `TextView` | 文本显示 | `<span>` / `<p>` |
| `EditText` | 文本输入 | `<input type="text">` |
| `Button` | 按钮 | `<button>` |
| `ImageView` | 图片 | `<img>` |
| `RecyclerView` | 列表（高性能） | 虚拟滚动列表（如 `react-window`） |
| `ViewPager` | 轮播/滑动页面 | Swiper 组件 |
| `ScrollView` | 可滚动容器 | `overflow: auto` 的 div |

---

#### Handler / Looper / View 体系

**Handler 机制 — 线程间通信**

```
主线程 (UI Thread)
  └─ Looper.loop() 持续运行消息循环
       └─ MessageQueue 消息队列
            └─ Handler 发送/处理消息
```

```kotlin
// 在子线程中更新 UI
val handler = Handler(Looper.getMainLooper())
Thread {
    // 耗时操作
    val data = fetchFromNetwork()
    // 切回主线程更新 UI
    handler.post {
        textView.text = data
    }
}.start()
```

前端类比：类似 JS 的 `setTimeout` / `requestAnimationFrame`，但 Android 中 UI 操作必须在主线程执行，类似 JS 的单线程模型。

**View 绘制流程**

```
onMeasure()  → 测量 View 大小（宽高）
    ↓
onLayout()   → 确定子 View 的位置
    ↓
onDraw()     → 绘制内容（Canvas）
```

前端类比：类似浏览器的 Render 流程 — Layout → Paint → Composite。

**触摸事件处理**

```
Activity.dispatchTouchEvent()
  → ViewGroup.onInterceptTouchEvent()  // 父容器是否拦截
    → View.onTouchEvent()              // 子 View 处理
  ← 事件消费与传递（冒泡/捕获类似 DOM 事件模型）
```

---

#### 资源管理

```
res/
├── drawable/       → 图片、矢量图、shape 定义（类比 CSS 背景/形状）
├── layout/         → XML 布局文件（类比 HTML/Vue 模板）
├── values/
│   ├── strings.xml → 字符串资源（类比 i18n JSON）
│   ├── colors.xml  → 颜色定义（类比 CSS 变量）
│   ├── dimens.xml  → 尺寸定义（类比 CSS 变量）
│   └── styles.xml  → 样式主题（类比 CSS 样式）
└── mipmap/         → 应用图标（不同分辨率）
```

---

## 阶段二：开发环境 & 工程认知

### 2.1 开发环境搭建

#### Android Studio

1. **安装**：从 [developer.android.com](https://developer.android.com/studio) 下载
2. **配置**：
   - SDK Manager：下载对应版本的 Android SDK
   - 设置 JDK 版本（通常 JDK 17）
   - 配置 Gradle 版本（项目级 `gradle-wrapper.properties`）
3. **常用快捷键**：
   - `Cmd + N`：生成代码（getter/setter/构造函数）
   - `Cmd + Shift + A`：查找操作（类似 VS Code 命令面板）
   - `Ctrl + Space`：代码补全
   - `Cmd + B`：跳转到定义

#### 真机调试

```bash
# USB 连接后
adb devices                    # 查看已连接设备
adb logcat                     # 查看日志
adb install app.apk            # 安装 APK
adb shell am start -n com.example/.MainActivity  # 启动指定 Activity

# 开发者选项开启：设置 → 关于手机 → 连续点击版本号 7 次
```

#### 打包构建

| 类型 | 用途 | 特点 |
|------|------|------|
| Debug | 开发调试 | 默认签名，可调试 |
| Release | 正式发布 | 需配置签名，代码优化 |

```groovy
// build.gradle 签名配置
android {
    signingConfigs {
        release {
            storeFile file("keystore.jks")
            storePassword "password"
            keyAlias "alias"
            keyPassword "password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true  // 代码混淆
        }
    }
}
```

#### Gradle 依赖管理

```groovy
dependencies {
    // implementation — 编译时可见，运行时打包（最常用）
    implementation 'androidx.appcompat:appcompat:1.6.1'

    // api — 编译和运行时都可见（传递依赖）
    api project(':core')

    // compileOnly — 仅编译时使用，不打包（类似 devDependencies）
    compileOnly 'org.projectlombok:lombok:1.18.20'

    // testImplementation — 仅测试使用
    testImplementation 'junit:junit:4.13.2'
}
```

前端类比：`implementation` ≈ `dependencies`，`compileOnly` ≈ `devDependencies`，`api` ≈ workspace 中被其他包引用的公共依赖。

---

### 2.2 项目结构认知

#### 仓库指引和规范

**团队仓库结构理解**

需要理解的关键概念：
- **航母主仓库**：主工程项目
- **繁星主仓库**：繁星业务主工程
- **fanxingalline**：模块化结构

> 详细参考：https://wiki.kugou.net/pages/viewpage.action?pageId=193266810

**各子模块职责划分**（通用认知）：

```
app/                  → 主壳工程（Application 入口）
├── base/             → 基础能力层（网络、存储、工具类）
├── common/           → 公共 UI 组件
├── feature-home/     → 首页模块（按业务拆分）
├── feature-user/     → 用户模块
└── feature-player/   → 播放器模块
```

前端类比：类似 monorepo 的 packages 目录，每个 module 就是一个独立的 npm 包。

---

## 阶段三：业务开发能力

### 3.1 网络能力

#### FANet 基础

```kotlin
// 同步请求（需在子线程执行）
val response = FANet.get("https://api.example.com/data")
    .execute()

// 异步请求（自动切线程）
FANet.get("https://api.example.com/data")
    .enqueue(object : Callback<Response> {
        override fun onSuccess(response: Response) {
            // 主线程回调，可更新 UI
        }
        override fun onFailure(error: Throwable) {
            // 错误处理
        }
    })

// 错误处理
try {
    val response = FANet.post("https://api.example.com/submit")
        .addParam("key", "value")
        .execute()
    if (response.isSuccess) {
        // 处理成功
    }
} catch (e: NetworkException) {
    // 网络异常
} catch (e: ApiException) {
    // 接口异常
}
```

#### 接口定义模式

```kotlin
// 通用响应包装
data class BaseResponse<T>(
    val code: Int,
    val message: String,
    val data: T?
) {
    val isSuccess: Boolean get() = code == 0
}

// 具体接口数据类
data class User(
    val id: Int,
    val name: String,
    val avatar: String
)

// 分页接口
data class PageResponse<T>(
    val list: List<T>,
    val page: Int,
    val size: Int,
    val hasMore: Boolean
)
```

前端类比：`BaseResponse` 类似 axios 拦截器中统一的响应结构，`data class` 类似 TypeScript 的 `interface`。

#### 网络图片加载库

```kotlin
// 使用 Glide（最常用）
Glide.with(context)
    .load("https://example.com/image.jpg")
    .placeholder(R.drawable.placeholder)     // 加载中占位图
    .error(R.drawable.error)                 // 错误图
    .into(imageView)

// 使用 Coil（Kotlin 优先）
imageView.load("https://example.com/image.jpg") {
    placeholder(R.drawable.placeholder)
    transformations(CircleCropTransformation())
}
```

前端类比：类似 `<img>` 配合 loading 骨架屏，但 Android 需要处理内存缓存、图片解码等。

#### 文件下载/上传

```kotlin
// 下载
FANet.download("https://example.com/file.apk")
    .target(savePath)
    .enqueue(object : DownloadCallback {
        override fun onProgress(progress: Int) { /* 更新进度条 */ }
        override fun onSuccess(file: File) { /* 下载完成 */ }
    })
```

---

### 3.2 线程处理

```kotlin
// 线程池
val executor = Executors.newFixedThreadPool(4)
executor.execute {
    // 子线程执行耗时操作
    val result = heavyWork()
    runOnUiThread {
        // 切回主线程更新 UI
        updateUI(result)
    }
}

// Kotlin 协程（推荐方式）
viewModelScope.launch {
    val result = withContext(Dispatchers.IO) {
        // IO 线程执行网络请求
        apiService.fetchData()
    }
    // 自动切回主线程
    textView.text = result
}
```

前端类比：线程池类似 Web Worker 池，协程类似 `async/await`（`withContext(Dispatchers.IO)` ≈ 在 worker 线程执行）。

---

### 3.3 项目常用模式

#### MVVM 模式（推荐）

```
View (Activity/Fragment/XML)
  ↕ 观察 LiveData/StateFlow
ViewModel (业务逻辑、数据持有)
  ↕ 调用
Model (Repository → 网络/数据库)
```

```kotlin
// ViewModel
class UserViewModel : ViewModel() {
    private val _userState = MutableStateFlow<UiState>(UiState.Loading)
    val userState: StateFlow<UiState> = _userState

    fun loadUser() {
        viewModelScope.launch {
            _userState.value = UiState.Loading
            try {
                val user = repository.getUser()
                _userState.value = UiState.Success(user)
            } catch (e: Exception) {
                _userState.value = UiState.Error(e.message ?: "未知错误")
            }
        }
    }
}

// Activity/Fragment 中观察
lifecycleScope.launch {
    viewModel.userState.collect { state ->
        when (state) {
            is UiState.Loading -> showLoading()
            is UiState.Success -> showData(state.data)
            is UiState.Error -> showError(state.message)
        }
    }
}
```

前端类比：MVVM ≈ React 的状态管理模式（ViewModel ≈ 自定义 Hook / Store，LiveData/StateFlow ≈ useState / RxJS Observable）。

#### MVP 模式

```
View (Activity/Fragment) ←→ Presenter (业务逻辑)
                              ↕
                           Model (数据层)
```

与 MVVM 的区别：View 和 Presenter 通过接口直接交互，而不是观察数据变化。

#### 单例用法

```kotlin
// Kotlin object 声明（推荐）
object UserManager {
    private var currentUser: User? = null
    fun login(user: User) { currentUser = user }
    fun getUser() = currentUser
}

// 或 companion object
class DatabaseHelper private constructor() {
    companion object {
        val instance: DatabaseHelper by lazy { DatabaseHelper() }
    }
}
```

---

## 阶段四：调试与质量

### 4.1 调试能力

#### Android Studio Debugger

| 操作 | 快捷键 | 说明 |
|------|--------|------|
| 行断点 | 点击行号 | 执行到该行暂停 |
| 条件断点 | 右键断点 | 满足条件才暂停 |
| 监视断点 | — | 监控字段变化 |
| Step Over | F8 | 执行下一行（不进入方法） |
| Step Into | F7 | 进入方法内部 |
| Resume | F9 | 继续执行到下一个断点 |
| Evaluate Expression | Alt+F8 | 执行任意表达式 |

#### Logcat 日志

```kotlin
// 日志级别
Log.v("TAG", "Verbose — 详细调试信息")
Log.d("TAG", "Debug — 调试信息")
Log.i("TAG", "Info — 一般信息")
Log.w("TAG", "Warn — 警告")
Log.e("TAG", "Error — 错误")
```

```bash
# 命令行过滤
adb logcat -s TAG:D              # 只看 TAG 的 Debug 及以上级别
adb logcat | grep "keyword"      # 关键字过滤
adb logcat *:E                   # 只看所有 Error
```

#### Layout Inspector / CodeLocator

- **Layout Inspector**：Android Studio 内置，查看运行时 View 树结构（类比 Chrome DevTools 的 Elements 面板）
- **CodeLocator**：内部工具，点击屏幕元素直接定位到代码文件和行号

#### Memory Profiler

- **Heap Dump**：查看当前内存中的对象分布，识别内存泄漏
- **Allocation Tracking**：追踪一段时间内的对象分配，发现频繁创建的对象

---

### 4.2 常见崩溃类型与处理

| 崩溃类型 | 原因 | 处理方式 |
|----------|------|----------|
| `NullPointerException` | 访问空对象 | 使用 Kotlin 空安全，避免 `!!` |
| `ClassCastException` | 类型转换错误 | 先 `isinstanceof` 检查 |
| `IndexOutOfBoundsException` | 数组/列表越界 | 检查边界或使用安全取值 |
| `ConcurrentModificationException` | 遍历时修改集合 | 使用 Iterator 或创建副本 |
| `NetworkOnMainThreadException` | 主线程执行网络操作 | 移到子线程/协程 |
| `ActivityNotFoundException` | 跳转目标不存在 | 检查 Intent 配置 |
| OOM (OutOfMemoryError) | 内存不足 | 优化图片加载、检查泄漏 |

---

### 4.3 性能优化

#### UI 性能

- **避免过度绘制**：减少重叠的背景、不必要的层级
- **减少布局层级**：使用 ConstraintLayout 替代多层嵌套的 LinearLayout
- **使用 `include` / `ViewStub`**：复用布局、懒加载

#### 内存优化

```kotlin
// 1. 避免内存泄漏 — Activity 销毁时清理引用
// 错误：静态变量持有 Activity 引用
// 正确：使用 WeakReference 或及时置 null

// 2. 大图处理
Glide.with(context)
    .load(imageUrl)
    .override(targetWidth, targetHeight)  // 降采样，不加载原图大小
    .into(imageView)
```

#### 卡顿优化

- **主线程只做 UI 操作**：耗时任务移到子线程
- **减少 `onDraw()` 中的对象创建**：避免 GC 导致的卡顿
- **使用 Systrace / Perfetto**：分析帧耗时，定位卡顿帧
- **列表优化**：RecyclerView 复用 ViewHolder，DiffUtil 增量更新

---

## 阶段五：业务实战

> 结合以上知识，参与实际项目开发。建议：

1. **从修改已有页面入手**：在现有项目中改一个小功能，熟悉代码结构和提交流程
2. **独立开发简单页面**：从接口定义 → UI 布局 → 数据绑定 → 状态管理，走完一个完整流程
3. **关注代码规范**：遵循团队 Code Style，参与 Code Review
4. **善用调试工具**：遇到问题先用 Debugger 和 Logcat 定位，而不是靠猜
5. **持续学习**：阅读团队 Wiki 和已有代码，理解项目架构设计

---

## 学习建议

| 阶段 | 预估时间 | 优先级 |
|------|----------|--------|
| 阶段一：语言基础 | 2-3 周 | ★★★★★ |
| 阶段二：开发环境 | 1 周 | ★★★★ |
| 阶段三：业务开发 | 2-3 周 | ★★★★ |
| 阶段四：调试质量 | 1-2 周 | ★★★ |
| 阶段五：业务实战 | 持续进行 | ★★★★★ |

**学习方法**：
- 先过一遍概念，不需要死记硬背
- 对照前端已有知识，找对应关系
- 尽早动手写代码，边写边查文档
- 遇到问题优先用 Debugger 定位，培养排查能力
