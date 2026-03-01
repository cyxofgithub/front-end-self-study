# 基础总结深入

## 数据类型的分类和判断

### 分类

#### 基本(值)类型

* Number ----- 任意数值 -------- typeof
* String ----- 任意字符串 ------ typeof
* Boolean ---- true/false ----- typeof
* undefined --- undefined ----- typeof/===
* null -------- null ---------- ===

#### 对象(引用)类型

* Object ----- typeof/instanceof
* Array ------ instanceof
* Function ---- typeof

### 判断

* typeof
  * 可以区别: 数值, 字符串, 布尔值, undefined, function
  * 不能区别: null与对象, 一般对象与数组
* instanceof
  * 专门用来判断对象数据的类型: Object, Array与Function
*  ===
  * 可以判断: undefined和null



#### 几个基本问题本

#### 1.null和undefined的区别

 \* undefined代表定义未赋值

 \* nulll定义并赋值了, 只是值为null

#### **2.什么时候给变量赋值为null呢?**

 \* 初始赋值, 表明将要赋值为对象

 \* 结束前, 让对象成为垃圾对象(被垃圾回收器回收)

#### **3.严格区别变量类型与数据类型?**

 \* 数据的类型

  \* 基本类型

  \* 对象类型

 \* 变量的类型(变量内存值的类型)

  \* 基本类型: 保存就是基本类型的数据

  \* 引用类型: 保存的是地址值

## 数据,变量, 内存的理解

### 什么是数据?

* 在内存中可读的, 可传递的保存了特定信息的'东东'
* 具有可读和可传递的基本特性
* 万物（一切）皆数据, 函数也是数据
* 在内存中的所有操作的目标: 数据

### 什么是变量?

* 在程序运行过程中它的值是允许改变的量
* 一个变量对应一块小内存, 它的值保存在此内存中  

### 什么是内存?

* 内存条通电后产生的存储空间(临时的)
* 一块内存包含2个方面的数据
  * 内部存储的数据
  * 地址值数据
* 内存空间的分类
  * 栈空间: 全局变量和局部变量
  * 堆空间: 对象 

内存,数据, 变量三者之间的关系
* 内存是容器, 用来存储不同数据
* 变量是内存的标识, 通过变量我们可以操作(读/写)内存中的数据  

### 几个基本问题

#### var a = xxx, a内存中到底保存的是什么?

 \* xxx是一个基本数据 -> 存的是内容的值

 \* xxx是一个对象 -> 存的是内容的地址值

 \* xxx是一个变量 -> 可能是值也可能是地址值

#### **关于引用变量赋值问题**

 \* 2个引用变量指向同一个对象, 通过一个引用变量修改对象内部数据, 另一个引用变量也看得见

```
 var obj1 = {}
  var obj2 = obj1
  obj2.name = 'Tom'
  console.log(obj1.name)
  function f1(obj) {
    obj.age = 12
  }
  f1(obj2)
  console.log(obj1.age)
```

 \* 2个引用变量指向同一个对象,让一个引用变量指向另一个对象, 另一个引用变量还是指向原来的对象

```
 var obj3 = {name: 'Tom'}
  var obj4 = obj3
  obj3 = {name: 'JACK'}
  console.log(obj4.name)
  function f2(obj) {
    obj = {name: 'Bob'}
  }
  f2(obj4)
  console var obj1 = {}
  var obj2 = obj1
  obj2.name = 'Tom'
  console.log(obj1.name)
  function f1(obj) {
    obj.age = 12
  }
  f1(obj2)
  console.log(obj1.age).log(obj4.name)// 还是TOM
```

#### 在js调用函数时传递变量参数时, 是值传递还是引用传递

 \* 只有值传递, 没有引用传递, 传递的都是变量的值, 只是这个值可能是基本数据, 也可能是地址(引用)数据

 \* 如果后一种看成是引用传递, 那就值传递和引用传递都可以有

 * 两种理解方式都可

#### JS引擎如何管理内存?

-  内存生命周期
  - 分配需要的内存
  - 使用分配到的内存
  - 不需要时将其释放/归还
-  释放内存
  - 为执行函数分配的栈空间内存: 函数执行完自动释放
  - 存储对象的堆空间内存: 当栈内存没有引用指向时, 对象成为垃圾对象, 垃圾回收器后面就会回收释放此内存

## 对象的理解和使用

* 什么是对象?

  * 多个数据(属性)的集合
  * 用来保存多个数据(属性)的容器

* 属性组成:

  * 属性名 : 字符串(标识)
  * 属性值 : 任意类型

* 属性的分类:

  * 一般 : 属性值不是function  描述对象的状态
  * 方法 : 属性值为function的属性  描述对象的行为

* 特别的对象

  * 数组: 属性名是0,1,2,3之类的索引
  * 函数: 可以执行的

* 如何操作内部属性(方法)

  * .属性名

  * ['属性名']: 属性名有特殊字符/属性名是一个变量

## 函数的理解和使用

1. 什么是函数?
   -  \* 具有特定功能的n条语句的封装体
   -  \* 只有函数是可执行的, 其它类型的数据是不可执行的
   -  \* 函数也是对象
2.  为什么要用函数?
   -  \* 提高代码复用
   -  \* 便于阅读和交流
3.  如何定义函数?
   -  \* 函数声明
   -  \* 表达式
4.  如何调用(执行)函数?
   -  \* test()
   -  \* new test()
   -  \* obj.test()
   -  \* test.call/apply(obj)：临时让test称为obj的方法进行调用

### IIFE(立即调用函数表达式)

```
(function(w, obj){
  //实现代码
})(window, obj)
```

* 专业术语为: IIFE (Immediately Invoked Function Expression) 立即调用函数表达式	

* 作用

   \* 隐藏内部实现

   \* 不污染外部命名空间

* **代码实例**

* ```
   (function () { //匿名函数自调用
      var a = 3
      console.log(a + 3)
    })()
    var a = 4
    console.log(a)
    
    ;(function () {
      var a = 1
      function test () {
        console.log(++a)
      }
      window.$ = function () { // 向外暴露一个全局函数
        return {
          test: test
        }
      }
    })()
    
    $().test() // 1. $是一个函数 2. $执行后返回的是一个对象里面有test方法
    
  ```

  

### 回调函数的理解

* 什么函数才是回调函数?

  * 你定义的
  * 你没有调用
  * 但它最终执行了(在一定条件下或某个时刻)

* 常用的回调函数

  * dom事件回调函数

    * ```
      var btn = document.getElementById('btn')
        btn.onclick = function () {
          alert(this.innerHTML)
        }
      ```

  * 定时器回调函数

    * ```
       setInterval(function () {
          alert('到点啦!')
        }, 2000)
      ```

  * ajax请求回调函数(后面讲解)

  * 生命周期回调函数(后面讲解)

### 函数中的this

- this是什么?
  -  任何函数本质上都是通过某个对象来调用的,如果没有直接指定就是window
  -  所有函数内部都有一个变量this
  -  它的值是调用函数的当前对象
- 如何确定this的值?
  - test(): window
  - p.test(): p
  - new test(): 新创建的对象
  - p.call(obj): obj

## 补充

### 分号问题

1. js一条语句的后面可以不加分号
2. 是否加分号是编码风格问题, 没有应该不应该，只有你自己喜欢不喜欢
3. 在下面2种情况下不加分号会有问题
   - 小括号开头的前一条语句
   - 中方括号开头的前一条语句
4. 解决办法: 在行首加分号
5. 强有力的例子: vue.js库

# 函数高级

## 原型与原型链

### 函数的 prototype

- 函数的prototype属性(图)

  -  每个函数都有一个prototype属性, 它默认指向一个Object空对象(即称为: 原型对象)

  -  原型对象中有一个属性constructor, 它指向函数对象

    - ```
       console.log(Date.prototype.constructor===Date) // true
      ```

    

- 给原型对象添加属性(一般都是方法)

  -  作用: 函数的所有实例对象自动拥有原型中的属性(方法)

    - ```
      Fun.prototype.test = function () {
          console.log('test()')
        }
        var fun = new Fun()
        fun.test()
      ```

    - 因为每一个实例都会指向函数对应的空对象object

### 显式原型与隐式原型

1. 每个函数function都有一个prototype，即显式原型(属性)

2. 每个实例对象都有一个__proto__，可称为隐式原型(属性)

3. 对象的隐式原型的值为其对应构造函数的显式原型的值

4. 内存结构(图)

   - ![image-20210122192210092](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210122192210092.png)

   - ```
     //定义构造函数
       function Fn() {   // 内部语句: this.prototype = {}
     
       }
       // 1. 每个函数function都有一个prototype，即显式原型属性, 默认指向一个空的Object对象
       console.log(Fn.prototype)
       // 2. 每个实例对象都有一个__proto__，可称为隐式原型
       //创建实例对象
       var fn = new Fn()  // 内部语句: this.__proto__ = Fn.prototype
       console.log(fn.__proto__)
       // 3. 对象的隐式原型的值为其对应构造函数的显式原型的值
       console.log(Fn.prototype===fn.__proto__) // true
       //给原型添加方法
       Fn.prototype.test = function () {
         console.log('test()')
       }
       //通过实例调用原型的方法
       fn.test()
     ```

5. 总结:

   - 函数的prototype属性: 在定义函数时自动添加的, 默认值是一个空Object对象
   - 对象的__proto__属性: 创建对象时自动添加的, 默认值为构造函数的prototype属性值
   - 程序员能直接操作显式原型, 但不能直接操作隐式原型(ES6之前)

### 原型链

**1.原型链(图解)**

-  访问一个对象的属性时，
-  先在自身属性中查找，找到返回
-  如果没有, 再沿着__proto__这条链向上查找, 找到返回
-  如果最终没找到, 返回undefined
-  别名: 隐式原型链
-  作用: 查找对象的属性(方法)

![image-20210122212905485](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210122212905485.png)

#### 总结

函数的显示原型指向的对象默认是空Object实例对象(但Object函数不满足它指向的是Object原型对象（里面有一个proto属性为空）)

```
 console.log(Fn.prototype instanceof Object) // true

 console.log(Object.prototype instanceof Object) // false

 console.log(Function.prototype instanceof Object) // true
```

所有函数都是Function的实例(包含Function)

```
 console.log(Function.__proto__===Function.prototype)
```

 Object的原型对象是原型链尽头

```
 console.log(Object.prototype.__proto__) // null
```

#### 属性问题

1. 读取对象的属性值时: 会自动到原型链中查找
2. 设置对象的属性值时: 不会查找原型链, 如果当前对象中没有此属性, 直接添加此属性并设置其值
3. 方法一般定义在原型中, 属性一般通过构造函数定义在对象本身上（function.protatype.xxx）

#### 探索 instance of

- instanceof是如何判断的?
  - 表达式: A instanceof B
  - 如果B函数的显式原型对象在A对象的原型链上, 返回true, 否则返回false
- Function是通过new自己产生的实例，函数都是new Function 尝试的实例对象
- 案例1

```
  console.log(Object instanceof Function) // true
  console.log(Object instanceof Object) // true
  console.log(Function instanceof Function) // true
  console.log(Function instanceof Object) // true

  function Foo() {}
  console.log(Object instanceof  Foo) // false

```

构造函数/原型/实体对象的关系(图解)

![image-20210124112312001](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210124112312001.png)

- 案例2

```
  console.log(Object instanceof Function) // true
  console.log(Object instanceof Object) // true
  console.log(Function instanceof Function) // true
  console.log(Function instanceof Object) // true

  function Foo() {}
  console.log(Object instanceof  Foo) // false 记住这就够用
```

构造函数/原型/实体对象的关系2(图解)

![image-20210124113950901](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210124113950901.png)

#### 测试题

 测试题1（重要）

```
 function A () {



 }

 A.prototype.n = 1



 var b = new A()



 A.prototype = {

  n: 2,

  m: 3

 } // 改变的函数的显示原型对象并不会影响之前创建的实例，之前创建的实例指向了先前的显示原型对象



 var c = new A()

 console.log(b.n, b.m, c.n, c.m)   // b.m 是 undefind
```



  测试题2

```
 function F (){}

 Object.prototype.a = function(){

  console.log('a()')

 }

 Function.prototype.b = function(){

  console.log('b()')

 }

 

 var f = new F()

 f.a()

 // f.b() undefind

 F.a()

 F.b()

 console.log(f)

 console.log(Object.prototype)

 console.log(Function.prototype)
```



## 执行上下文与执行上下文栈

### 变量提升与函数提升

* 变量提升: 在变量定义语句之前, 就可以访问到这个变量(值：undefined)
* 函数提升: 在函数定义语句之前, 就执行该函数（值：函数定义对象）
* 先有变量提升, 再有函数提升

```
 var a = 3
  function fn () {
    console.log(a) // 输出 undefind 变量提升
    var a = 4
  }
  fn()

  console.log(b) //undefined  变量提升
  fn2() // 可调用  函数提升
  fn3() // 不能  变量提升 注意这里

  var b = 3
  function fn2() {
    console.log('fn2()')
  }

  var fn3 = function () {
    console.log('fn3()')
  }
```

### 执行上下文

代码分类

-   全局代码
-   函数(局部)代码

全局执行上下文

-   在执行全局代码前将window确定为全局执行上下文
-   对全局数据进行预处理
-   var定义的全局变量==>undefined, 添加为window的属性
-   function声明的全局函数==>赋值(fun), 添加为window的方法
-   this==>赋值(window)
-   开始执行全局代码

函数执行上下文

-   在调用函数, 准备执行函数体之前, 会先创建对应的函数执行上下文对象(虚拟的, 存在于栈中)
-   对局部数据进行预处理
  -    形参变量==>赋值(实参)==>添加为执行上下文的属性
  -    arguments(伪数组)==>赋值(实参列表), 添加为执行上下文的属性
  -    var定义的局部变量==>undefined, 添加为执行上下文的属性
  -    function声明的函数 ==>赋值(fun), 添加为执行上下文的方法
  -    this==>赋值(调用函数的对象)
-   开始执行函数体代码

### 执行上下文栈

- 在全局代码执行前, JS引擎就会创建一个栈来存储管理所有的执行上下文对象
- 在全局执行上下文(window)确定后, 将其添加到栈中(压栈)
- 在函数执行上下文创建后, 将其添加到栈中(压栈)
- 在当前函数执行完后,将栈顶的对象移除(出栈)
- 当所有的代码执行完后, 栈中只剩下window

![image-20210125122831059](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210125122831059.png)
![image-20210125122822773](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210125122822773.png)

![image-20210125122835756](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210125122835756.png)

### 测试题

```
/*
   测试题1:  先执行变量提升, 再执行函数提升
   */
  function a() {}
  var a
  console.log(typeof a) // 'function'


  /*
   测试题2:
   */
  if (!(b in window)) {
    var b = 1
  }
  console.log(b) // undefined 在执行 if 判断之前变量提升定义了全局变量b所以判断结果会false所以b定义了为赋值

  /*
   测试题3:
   */
  var c = 1
  function c(c) {
    console.log(c)
    var c = 3
  }
  c(2) // 报错 c is not a function 
  // 变量提升和函数提升都是先定义而没有赋值
  上述代码等价为
  var c ;
  function c(c) {
    console.log(c)
    var c = 3
  }
  c = 1;
  c(2)
```

