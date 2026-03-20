

# 第一部分 编程风格

# 第1章 基本的格式化

## 1.1 缩进层级

对于大多数编程风格来说，代码到底应该如何缩进并没有统一的共识。有两种主张。

**使用制表符进行缩进**

每一个缩进层级都用单独的制表符（tab character）表示。所以一个缩进层级是一个制表符，两个缩进层级为两个制表符，以此类推。这种方法有两个主要的好处。第一，制表符和缩进层级之间是一对一的关系，这是符合逻辑的。第二，文本编辑器可以配置制表符的展现长度[插图]，因此那些想修改缩进尺寸的开发者可以通过配置文本编辑器来实现，想长即长，想短可短。

使用制表符作缩进的**主要缺点**是，系统对制表符的解释不一致。你会发觉在某个系统中用一款编辑器打开文件时看到的缩进，和在另外一个系统中用相同的编辑器打开文件时看到的不一样。对于那些追求（代码展现）一致性的开发者来说，这会带来一些困惑。这些差异、争论会导致不同的开发者对同一段代码有不同的看法的，而这些正是团队开发需要规避的。

**使用空格符进行缩进**

每个缩进层级由多个空格字符组成。在这种观点中有三种具体的做法：2 个空格表示一个缩进，2个空格表示一个缩进，以及8个空格表示一个缩进。这三种做法在其他很多编程语言中都能找到渊源。实际上，很多团队选择 4 个空格的缩进，对于那些习惯用2个空格缩进和用8个空格缩进的人来说，4个空格缩进是一种折中的选择。

使用空格作缩进的**好处**是，在所有的系统和编辑器中，文件的展现格式不会有任何差异。可以在文本编辑器中配置敲击Tab键时插入几个空格。也就是说所有开发者都可以看到一模一样的代码呈现。

使用空格缩进的**缺点**是，对于单个开发者来说，使用一个没有配置好的文本编辑器创建格式化的代码的方式非常原始。尽管有人争辩说应当优先考虑使用一种缩进约定，但说到底这只是一个团队偏好的问题。

这里我们给出一些各式各样的缩进风格作为参考。

jQuery核心风格指南（jQuery Core Style Guide）明确规定使用制表符缩进。

Dauglas Crockford的JavaScript代码规范（Douglas Crockford’s CodeConventions for the JavaScript Programming Language）规定使用4个空格字符的缩进。

SproutCore风格指南（SproutCore Style Guide）规定使用2个空格的缩进。

Goolge的JavaScript风格指南（Google JavaScript Style Guide）规定使用2个空格的缩进。

Dojo编程风格指南（Dojo Style Guide）规定使用制表符缩进。我推荐使用4个空格字符为一个缩进层级。

很多文本编辑器都默认将缩进设置为4个空格，你可以在编辑器中配置敲入Tab键时插入4个空格。使用2个空格的缩进时，代码的视觉展现并不是最优的，至少看起来是这样。

**尽管是选择制表符还是选择空格做缩进只是一种个人偏好，但绝对不要将两者混用，这非常重要。这么做会导致文件的格式很糟糕，而且需要做不少清理工作，就像本节的第一段示例代码显示的那样。**



## 1.2 语句结尾

有赖于分析器的自动分号插入（Automatic Semicolon Insertion，ASI）机制，JavaScript代码省略分号也是可以正常工作的。ASI 会自动寻找代码中应当使用分号但实际没有分号的位置，并插入分号。大多数场景下ASI都会正确插入分号，不会产生错误。但ASI的分号插入规则非常复杂且很难记住，因此我推荐不要省略分号。看一下这段代码。

```

// 原始代码
function getData()
{
	return
	{
		title："Maintainable JavaScript",
		author："Nicholas C.Zakas"
	}
}

// 分析器会将它理解成
function getData(){
	return;
	{
		title："Maintainable JavaScript",
		author："Nicholas C.Zakas"
	};
}

```

ASI在某些场景下是很管用的，特别是，有时候ASI可以帮助减少代码错误。当某个场景我们认为不需要插入分号而ASI认为需要插入时，常常会产生错误。我发现很多开发人员，尤其是新手们，更倾向于使用分号而不是省略它们。

Douglas Crockford针对JavaScript提炼出的编程规范（下文统称为Crockford的编程规范）推荐总是使用分号，同样，jQuery核心风格指南、Google 的JavaScript风格指南以及Dojo编程风格指南都推荐不要省略分号。如果省略了分号，JSLint和JSHint默认都会有警告。



## 1.3 行的长度

Java Script风格指南中很少提及行的长度，但Crockford的代码规范中指定一行的长度为80个字符。我也倾向于将行长度限定在80个字符。



## 1.4 换行

当一行长度达到了单行最大字符数限制时，就需要手动将一行拆成两行。通常我们会在运算符后换行，下一行会增加两个层级的缩进。比如（假定缩进为4个字符）下面这样。

```
// 好的做法：在运算符后换行，第二行追加两个缩进
callAFunction(document,element,window,"some string value",true,123,
		navigator);
// 不好的做法：第二行只有一个缩进
callAFunction(document,element,window,"some string value",true,123,
	navigator);
// 不好的做法：在运算符之前换行了
callAFunction(document,element,window,"some string value",true,123
		,navigator);
```

**在这个例子中，逗号是一个运算符，应当作为前一行的行尾。这个换行位置非常重要，因为ASI机制会在某些场景下在行结束的位置插入分号。总是将一个运算符置于行尾，ASI就不会自作主张地插入分号，也就避免了错误的发生。**

对于语句来说，同样也可以应用下面这种换行规则。

```
if(isLeapYear && isFebruary && day == 29 && itsYourBirthday &&
		noPlans) {
	waitAnotherFourYears();
}
```

在这段代码中，if条件语句被拆分成了两行，断行在&&运算符之后。需要注意的是，if语句的主体部分依然是一个缩进，这样更容易阅读。

这个规则有一个**例外**：当给变量赋值时，第二行的位置应当和赋值运算符的位置保持对齐。比如：

```
var result = something + anotherThing + yetAnotherThing + somethingElse +
			anotherSomethingElse;
```

这段代码里，变量 anotherSomethingElse 和首行的something 保持左对齐，确保代码的可读性，并能一眼看清楚折行文本的上下文。



## 1.5 空行

在编程规范中，空行是常常被忽略的一个方面。通常来讲，代码看起来应当像一系列可读的段落，而不是一大段揉在一起的连续文本。有时一段代码的语义和另一段代码不相关，这时就应该使用空行将它们分隔，确保语义有关联的代码展现在一起。我们可以为1.1节里的示例代码加入一些空行，以更好地提升代码的可读性，下面是最初的代码：

```
if(wl && wl.length) {
	for( i = 0,l = wl.length; i < l; ++i) {
		p = wl[i];
		type = Y.Lang.type( r[p] );
		if( s.hasOwnProperty(p) ) {
			if( merge && type == 'object' ) {
				Y.mix( r[p], s[p] );
			} else if ( ov ||  ！(p in r) ) {
				r[p]= s[p];
			}
		}
	}
}
```

给这段代码添加了几个空行之后，得到：

```
if(wl && wl.length) {

	for( i = 0,l = wl.length; i < l; ++i) {
		p = wl[i];
		type = Y.Lang.type( r[p] );
		
		if( s.hasOwnProperty(p) ) {
		
			if( merge && type == 'object' ) {
				Y.mix( r[p], s[p] );
			} else if ( ov ||  ！(p in r) ) {
				r[p]= s[p];
			}
		}
	}
}
```

这段示例代码中所展示的编程规范是在每个流控制语句之前（比如if和for语句）添加空行。这样做能使你更流畅地阅读这些语句。一般来讲，在下面这些场景中添加空行也是不错的主意。

在方法之间。

在方法中的局部变量（local variable）和第一条语句之间。

在多行或单行注释之前。在方法内的逻辑片段之间插入空行，提高可读性。

**但并没有一个编程规范对空行的使用给出任何具体建议，Crockford 的编程规范也只提到要审慎地使用空行。**



## 1.6 命名

“计算机科学只存在两个难题：缓存失效和命名。”——Phil Karlton。

### **1.6.1 变量和函数**

变量名应当总是遵守驼峰大小写命名法，并且命名前缀应当是名词。以名词作为前缀可以让变量和函数区分开来，因为函数名前缀应当是动词。这里有一些例子。

```
// 好的写法
var count = 10;
var myName = "Nicholas";
var found = true;
// 不好的写法：变量看起来像函数
var getCount = 10;
var isFound = true;
// 好的写法
function getName() {
	return myName;
}
// 不好的写法：函数看起来像变量
function theName() {
	return myName;
}
```

**命名不仅是一门科学，更是一门技术，但通常来讲，命名长度应该尽可能短，并抓住要点。**尽量在变量名中体现出值的数据类型。比如，命名 count、length 和size表明数据类型是数字，而命名name、title、和message表明数据类型是字符串。但用单个字符命名的变量诸如i、j、和k通常在循环中使用。使用这些能够体现出数据类型的命名，可以让你的代码容易被别人和自己读懂。

要避免使用没有意义的命名。那些诸如 foo、bar 和 tmp 之类的命名也应当避免，当然开发者的工具箱中还有很多这样可以随拿随用的名字，但不要让这些命名承载其他的附加含义。对于其他开发者来说，如果没有看过上下文，是无法理解这些变量的用处的。

对于函数和方法命名来说，第一个单词应该是动词，这里有一些使用动词常见的约定。

以这些约定作为切入点可以让代码可读性更佳，这里有一些例子。

```
if( isEnabled() ){

​	setName("Nicholas");

}

if( getName() === "Nicholas" ){

​	doSomething();

}
```

尽管这些函数命名细则并没有被归纳入当下流行的编程风格中，但在很多流行的库中，JavaScript开发者会发现存在不少这种“伪标准”（pseudostandard）。

### **1.6.2 常量**

**在ECMAScript 6之前，JavaScript中并没有真正的常量的概念。**然而，这并不能阻止开发者将变量用作常量。**为了区分普通的变量（变量的值是可变的）和常量（常量的值初始化之后就不能变了），一种通用的命名约定应运而生。这个约定源自于C语言，它使用大写字母和下划线来命名**，下划线用以分隔单词，比如：

```
var MAX_COUNT = 10;
var URL = "http：//www.nczonline.net/";
```

Google的JavaScript风格指南、SproutCore编程风格指南以及Dojo编程风格指南中都提到，要使用这种习惯来命名常量。（Dojo编程风格指南中也允许使用大驼峰命名法大小写（Pascal Case）来命名常量，接下来会提到）。

### 1.6.3 构造函数

在JavaScript中，构造函数只不过是前面冠以new运算符的函数，用来创建对象。

正如其他的命名约定一样，构造函数的命名风格也和本地语言（Native Language）保持一致，因此**构造函数的命名遵照大驼峰命名法（Pascal Case）。**

遵守这条约定同样可以帮助我们快速定位问题，这接下来会提到。你知道在以大驼峰命名法（Pascal case）命名的函数如果是名词的话，前面一定会有new运算符。看一下这段代码：

```
var me = Person("Nicholas");
var you = getPerson("Michael");
```

这段代码中，根据上文提到的命名约定，我们一眼就可以看出第一行出了问题，但第二行看起来还ok。

Crockford的编程规范、Google的JavaScript风格指南以及Dojo编程风格指南都推荐这种实践。如果构造函数的首字母不是大写，或者构造函数之前没有 new 运算符，JSLint都会给出警告。而在JSHint中，只有你开启了一个特殊的newcap选项后，才会对首字母不是大写的构造函数给出警告。

## 1.7 直接量

JavaScript中包含一些类型的原始值：字符串、数字、布尔值、null和undefined。同样也包含对象直接量和数组直接量。这其中，**只有布尔值是自解释（self-explanatory）的**，其他的类型或多或少都需要思考一下它们如何才能更精确地表示出来。

### 1.7.1 字符串

Crockford的编程规范和jQuery核心风格指南都使用双引号来括住字符串。

Google的 JavaScript 风格指南使用单引号括住字符串。

关于字符串还有另外一个问题需要注意，即创建多行字符串。这个特性并非来自JavaScript语言本身，却在几乎所有的（JavaScript）引擎中正常工作。

```
// 不好的写法
var longString = "Here's the story,of a man \
named Brady.";
// Good
var longString = "Here's the story,of a man " +
"named Brady.";
```

尽管从技术上讲这种写法是非法的JavaScript语法，但的确能在代码中创建多行字符串。通常不推荐使用这种写法，因为它是一种奇技淫巧而非语言特性，并且在Google的JavaScript风格指南中是明确禁止的。**多行字符串的一种替代写法是，使用字符串连接符（+）将字符串分成多份。**

### 1.7.2 数字

在JavaScript中的数字类型只有一种，因为所有数字形式——整数和浮点数——都存储为相同的数据类型。还有一些其他的数字直接量格式来表示不同的数据格式。其中大部分写法都很好用，但也有一些写法有问题。

```
// 整数var count = 10;
// 小数
var price = 10.0;
var price = 10.00;
// 不推荐的小数写法：没有小数部分
var price = 10.;
// 不推荐的小数写法：没有整数部分
var price = .1;
// 不推荐的写法：八进制写法已经被弃用了
var num = 010;
// 十六进制写法
var num = 0xA2;
// 科学计数法
var num = 1e23;
```

前两种有问题的写法分别是省略了小数部分，比如10.，和省略了整数部分，比如.1。每种写法都有同一个问题：很难搞清楚被省略小数点之前或之后的部分是不小心丢掉了还是刻意为之。很可能是开发者不小心漏掉了。因此为了避免歧义，请不要省略小数点之前或之后的数字。Dojo 编程风格指南明确禁止这两种写法。JSLint 和JSHint对这两种写法都会给出警告。

最后一个有问题的写法是八进制数字写法。长久以来，JavaScript 支持八进制数字写法是很多错误和歧义的根源。数字直接量 010 不是表示 10，而是表示八进制中的8。大多数开发者对八进制格式并不熟悉，也很少用到，所以最好的做法是在代码中禁止八进制直接量。尽管在所有流行的编程规范中没有关于此的规定，但在JSlint和JSHint中都会对八进制直接量给出警告。

### 1.7.3 null

在下列场景中**应当使用null**。

- 用来初始化一个变量，这个变量可能赋值为一个对象。
- 用来和一个已经初始化的变量比较，这个变量可以是也可以不是一个对象。
- 当函数的参数期望是对象时，用作参数传入。
- 当函数的返回值期望是对象时，用作返回值传出。

```
// 好的用法
var person = null;

// 好的用法
function getPerson() {
	if (condition) {
		return new Person("Nicholas");
	} else {
		return null;
	}
}

// 好的用法
var person = getPerson();
if (person ！== null) {
	doSomething();
}
```

还有下面一些场景**不应当使用null。**

- 不要使用null来检测是否传入了某个参数。
- 不要用null来检测一个未初始化的变量。

这里有一些示例代码。	

```
// 不好的写法：用来和未初始化的变量比较
var person;
if (person！= null) {
	doSomething();
}

// 不好的写法：检测是否传入了参数
function doSomething (arg1, arg2, arg3, arg4) {
	if(arg4 ！= null) {
		doSomethingElse();
	}
}
```

**理解 null 最好的方式是将它当做对象的占位符（placeholder）。**这个规则在所有的主流编程规范中都没有提及，但对于全局可维护性来说至关重要。

关于null的陷阱会在第8章有更进一步的讨论。

### 1.7.4 undefined

undefined 是一个特殊值，我们常常将它和 null 搞混。其中一个让人颇感困惑之处在于 **null == undefined 结果是true**。然而，这两个值的用途却各不相同。那些没有被初始化的变量都有一个初始值，即 undefined，表示这个变量等待被赋值。比如：

```
// 不好的写法
var person;
console.log(person === undefined); //true
```

尽管这段代码能正常工作，但我**建议避免在代码中使用 undefined**。这个值常常和返回 “undefined” 的 typeof 运算符混淆。事实上，typeof 的行为也很让人费解，因为不管是值是undefined的变量还是未声明的变量，typeof运算结果都是“undefined”。比如：

```
//foo未被声明
var person;console.log(typeof person);　　　　　　　　//"undefined"
console.log(typeof foo);　　　　　　　　　 //"undefined"
```

在这段代码中，person和foo都会导致typeof返回“undefined”，哪怕person和foo在其他场景中的行为有天壤之别（在语句中使用foo会报错，而使用person则不会报错）。

**通过禁止使用特殊值 undefined，可以有效地确保只在一种情况下 typeof 才会返回“undefined”：当变量未声明时。**

**如果你使用了一个可能（或可能不会）赋值为一个对象的变量时，则将其赋值为null。**

```
// 好的做法

var person = null;

console.log(person === null); //true
```

将变量初始值赋值为 null 表明了这个变量的意图，它最终很可能赋值为对象。

**typeof运算符运算null的类型时返回“object”，这样就可以和undefined区分开了。**

### 1.7.5 对象直接量

**创建对象最流行的一种做法是使用对象直接量**，在直接量中直接写出所有属性，这种方式可以取代先显式地创建 Object 的实例然后添加属性的这种做法。比如，我们很少见到下面这种写法。

```
// 不好的写法
var book = new Object();
book.title = "Maintainable JavaScript";
book.author = "Nicholas C.Zakas";
```

当定义对象直接量时，常常在第一行包含左花括号，每一个属性的名值对都独占一行，并保持一个缩进，最后右花括号也独占一行。比如：

```
// 好的写法
var book = {
	title："Maintainable JavaScript",
	author："Nicholas C.Zakas"
};
```

这种写法在开源JavaScript代码中能经常看到。尽管没有归纳入文档中，Google的JavaScript风格指南非常推荐使用这种写法。Crockford的编程规范也推荐使用直接量代替Object构造函数，但并没有给出具体的书写格式。

### 1.7.6 数组直接量

不赞成显式地使用Array构造函数来创建数组，比如：

```
// 不好的写法
var colors = new Array("red","green","blue");
var numbers = new Array(1,2,3,4);
```

可以使用两个方括号将数组初始元素括起来，来替代使用Array构造函数的方式来创建数组。

```
// 好的做法
var colors = ["red","green","blue"];
var numbers = [1,2,3,4];
```

在JavaScript中，这种模式非常常见。Google的JavaScript风格指南和Crockford的编程规范都推荐这样做。