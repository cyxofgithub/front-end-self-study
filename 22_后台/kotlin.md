## Kotlin 基础语法速览

### 1. 变量与常量

```kotlin
var name: String = "Kotlin"  // 可变变量
val age: Int = 18           // 不可变（只读）变量，类似 Java 的 final
```

-   `var`：可重新赋值。
-   `val`：只读，不可变。

### 2. 基本数据类型

和 Java 类似，常用有：`Int`, `Double`, `Float`, `Boolean`, `Long`, `Short`, `Byte`, `Char`。Kotlin 变量可自动类型推断：

```kotlin
val score = 100      // 推断为 Int
val pi = 3.14        // 推断为 Double
```

### 3. 函数定义

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}

// 表达式形式（单行函数可省略大括号和return）
fun add(a: Int, b: Int) = a + b
```

### 4. 字符串模板

```kotlin
val name = "Kotlin"
println("Hello, $name!")           // Hello, Kotlin!
println("2 + 3 = ${2 + 3}")        // 2 + 3 = 5
```

### 5. 条件语句

```kotlin
val x = 10
if (x > 5) {
    println("x > 5")
} else {
    println("x <= 5")
}

// when 类似 switch
when (x) {
    1 -> println("x == 1")
    2, 3 -> println("x == 2 or 3")
    in 4..10 -> println("x 在 4~10 之间")
    else -> println("其它值")
}
```

### 6. 循环

```kotlin
for (i in 1..5) {        // 闭区间，包含5
    println(i)
}

while (x > 0) {
    println(x)
    x--
}
```

### 7. 类与对象

```kotlin
class Person(val name: String, var age: Int) {
    fun sayHello() {
        println("Hello, my name is $name, I'm $age years old.")
    }
}

val p = Person("Alice", 20)
p.sayHello()
```

### 8. 空安全

Kotlin 强制区分可空类型和非空类型，以避免 NPE：

```kotlin
var a: String = "abc"
// a = null    // 编译错误
var b: String? = "abc"
b = null      // 可以赋值为null

// 安全调用
println(b?.length)   // b为null时输出null，否则输出长度

// Elvis 操作符
val len = b?.length ?: 0  // b为null则用0
```

### 9. 集合操作（List/Map/Set）

```kotlin
val nums = listOf(1, 2, 3)        // 不可变列表
val mutableNums = mutableListOf(1, 2, 3) // 可变列表

for (n in nums) println(n)

val map = mapOf("a" to 1, "b" to 2)
for ((k, v) in map) println("$k -> $v")
```

### 10. Lambda 和集合高阶函数

```kotlin
val nums = listOf(1, 2, 3, 4)
val evens = nums.filter { it % 2 == 0 }
val squares = nums.map { it * it }
```

---

### 11. 枚举类

Kotlin 的枚举类（`enum class`）用于表示一组有限的常量。它们本质上是具有类型安全的枚举值，可以携带属性和方法，还可以包含 companion object 来定义静态成员和工厂方法。

基本用法：

```kotlin
// 定义一个枚举类
enum class Direction {
    NORTH, SOUTH, EAST, WEST;

    // 在 companion object 中定义静态方法
    companion object {
        fun fromName(name: String): Direction? {
            return values().find { it.name == name.uppercase() }
        }
    }
}

// 枚举值的使用
val dir = Direction.NORTH
println(dir.name)  // 输出 "NORTH"
println(dir.ordinal) // 输出 0，下标从0开始

// 通过 companion object 工厂方法获取枚举实例
val dir2 = Direction.fromName("west")
println(dir2) // 输出 "WEST"
```

枚举类可以定义属性和方法：

```kotlin
enum class State(val code: Int) {
    START(0),
    PROCESSING(1),
    FINISHED(2);

    fun isDone() = this == FINISHED

    companion object {
        // 根据 code 获取 State
        fun fromCode(code: Int): State? = values().find { it.code == code }
    }
}

// 使用
val s = State.PROCESSING
println(s.code)      // 输出1
println(s.isDone())  // 输出false

// 使用 companion object 静态方法
val state2 = State.fromCode(2)
println(state2)      // 输出 FINISHED
println(state2?.isDone()) // 输出 true
```

循环遍历所有枚举值：

```kotlin
for (d in Direction.values()) {
    println(d)
}
```

枚举类常用于表示状态、类型等固定集合的数据，利用 companion object 可以很方便地实现静态方法和工厂函数。

### 推荐学习顺序

1. 熟悉基础语法和空安全
2. 学会类、对象、集合、高阶函数等常用特性
3. 掌握代码风格与简洁写法（如类型推断、表达式语法等）

掌握以上内容即可进行 Kotlin 现代项目开发。详见 [Kotlin 官方文档](https://kotlinlang.org/docs/home.html)。
