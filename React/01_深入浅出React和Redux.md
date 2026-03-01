# 第1章	React新的前端思维方式

## 1.1 初始化一个React项目

### 1.1.1 create-react-app工具

create-react-app是一个通过npm发布的安装包，在确认Node.js和npm安装好之后，命令行中执行下面的命令安装create-react-app：

![image-20210406220133175](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406220133175.png)

安装过程结束之后，你的电脑中就会有create-react-app这样一个可以执行的命令，这个命令会在当前目录下创建指定参数名的应用目录。我们在命令行中执行下面的命令：

![image-20210406220206974](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406220206974.png)

这个命令会在当前目录下创建一个名为first_react_app的目录，在这个目录中会自动添加一个应用的框架，随后我们只需要在这个框架的基础上修改文件就可以开发React应用，避免了大量的手工配置工作：在create-react-app命令一大段文字输出之后，根据提示，输入下面的命令：

![image-20210406220233305](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406220233305.png)





## 1.2 增加一个新的React组件

### 1.2.0 起步（自己补的标题）

我们先看一看create-react-app给我们自动产生的代码，在first-react-app目录下包含如下文件和目录：

![image-20210406220413722](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406220413722.png)

在开发过程中，我们主要关注src目录中的内容，这个目录中是所有的源代码。create-react-app所创建的应用的入口是src/index.js文件，我们看看中间的内容，代码如下：

![image-20210406220433485](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406220433485.png)

这个应用所做的事情，只是渲染一个名叫App的组件，App组件在同目录下的App.js文件中定义，渲染出来的效果就是在图1-1中看到的界面。我们要定义一个新的能够计算点击数组件，名叫ClickCounter，所以我们修改index. js文件如下：

![image-20210406220510340](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406220510340.png)

我们接下来会介绍代码的含义。现在我们先来看看如何添加一个新组件，在src目录下增加一个新的代码文件ClickCounter.js，代码如下：

![image-20210406220626202](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406220626202.png)

效果图![image-20210406220806450](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406220806450.png)

在index.js文件中，使用import导入了ClickCounter组件，代替了之前的App组件。

![image-20210406220834030](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406220834030.png)

import是ES6（EcmaScript 6）语法中导入文件模块的方式，ES6语法是一个大集合，大部分功能都被最新浏览器支持。不过这个import方法却不在广泛支持之列，这没有关系，ES6语法的JavaScript代码会被webpack和babel转译成所有浏览器都支持的ES5语法，而这一切都无需开发人员做配置，create-react-app已经替我们完成了这些工作。在ClickCounter.js文件的第一行，我们从react库中引入了React和Component，如下所示：

![image-20210406220905382](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406220905382.png)

Component作为所有组件的基类，提供了很多组件共有的功能，下面这行代码，使用的是ES6语法来创建一个叫ClickCounter的组件类，ClickCounter的父类就是Component：

![image-20210406221052479](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406221052479.png)

在React出现之初，使用的是React.createClass方式来创造组件类，这种方法已经被废弃了，但是在互联网上依然存在大量的文章基于React.createClass来讲解React，这些文章中依然有很多真知灼见的部分，但是读者要意识到，使用React.createClass是一种过时的方法。在本书中，我们只使用ES6的语法来构建组件类。细心的读者会发现，虽然我们导入的Component类在ClickCounter组件定义中使用了，可是导入的React却没有被使用，难道在这里引入React没有必要吗？事实上，引入React非常必要，你可以尝试删掉第一行中的React，在网页中立刻会出现错误信息，如图所示。

![image-20210406221141919](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406221141919.png)

这个错误信息的含义是：“在使用JSX的范围内必须要有React。”也就是说，在使用JSX的代码文件中，即使代码中并没有直接使用React，也一定要导入这个React，这是因为JSX最终会被转译成依赖于React的表达式。



### 1.2.1 JSX

所谓JSX，是JavaScript的语法扩展（eXtension），让我们在JavaScript中可以编写像HTML一样的代码。在ClickCounter.js的render函数中，就出现了类似这样的HTML代码，在index.js中，ReactDOM.render的第一个参数<App />也是一段JSX代码。

**和HTML的不同之处**

首先，在JSX中使用的“元素”不局限于HTML中的元素，可以是任何一个React组件，在App.js中可以看到，我们创建的ClickCounter组件被直接应用在JSX中，使用方法和其他元素一样，这一点是传统的HTML做不到的。**React判断一个元素是HTML元素还是React组件的原则就是看第一个字母是否大写，如果在JSX中我们不用ClickCounter而是用clickCounter，那就得不到我们想要的结果。**其次，在JSX中可以通过onClick这样的方式给一个元素添加一个事件处理函数，当然，在HTML中也可以用onclick（注意和onClick拼写有区别），但在HTML中直接书写onclick一直就是为人诟病的写法，网页应用开发界一直倡导的是用jQuery的方法添加事件处理函数，直接写onclick会带来代码混乱的问题。这就带来一个问题，既然长期以来一直不倡导在HTML中使用onclick，为什么在React的JSX中我们却要使用onClick这样的方式来添加事件处理函数呢？

### 1.2.2 JSX是进步还是倒退

JSX的onClick事件处理方式和HTML的onclick有很大不同。即使现在，我们还是要说在HTML中直接使用onclick很不专业，原因如下：

□ onclick添加的事件处理函数是在全局环境下执行的，这污染了全局环境，很容易产生意料不到的后果；

□ 给很多DOM元素添加onclick事件，可能会影响网页的性能，毕竟，网页需要的事件处理函数越多，性能就会越低；

□ 对于使用onclick的DOM元素，如果要动态地从DOM树中删掉的话，需要把对应的时间处理器注销，假如忘了注销，就可能造成内存泄露，这样的bug很难被发现。

上面说的这些问题，在JSX中都不存在。首先，onClick挂载的每个函数，都可以控制在组件范围内，不会污染全局空间。我们在JSX中看到一个组件使用了onClick，但并没有产生直接使用onclick（注意是onclick不是onClick）的HTML，而是使用了事件委托(event delegation)的方式处理点击事件，无论有多少个onClick出现，其实最后都只在DOM树上添加了一个事件处理函数，挂在最顶层的DOM节点上。所有的点击事件都被这个事件处理函数捕获，然后根据具体组件分配给特定函数，使用事件委托的性能当然要比为每个onClick都挂载一个事件处理函数要高。因为React控制了组件的生命周期，在unmount的时候自然能够清除相关的所有事件处理函数，内存泄露也不再是一个问题。除了在组件中定义交互行为，我们还可以在React组件中定义样式，我们可以修改ClickCounter.js中的render函数，代码如下：

![image-20210406222041321](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406222041321.png)

我们在JavaScript代码中定义一个counterStyle对象，然后在JSX中赋值给顶层div的style属性，可以看到网页中这个部分的margin真的变大了。你看，React的组件可以把JavaScript、HTML和CSS的功能在一个文件中，实现真正的组件封装。

## 1.3 分解React应用

我们启动React应用的命令是npm start，看一看package.json中对start脚本的定义，如下所示：

![image-20210406222152481](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406222152481.png)

可以看到，start命令实际上是调用了react-scripts这个命令，react-scripts是create-react-app添加的一个npm包，所有的配置文件都藏在node_modules/react-scripts目录下，我们当然可以钻进这个目录去一探究竟，但是也可以使用eject方法来看清楚背后的原理。

你可以发现package.json文件中和start并列还有其他几个命令，其中build可以创建生产环境优化代码，test用于单元测试，还有一个eject命令很有意思。这个eject（弹射）命令做的事情，就是把潜藏在react-scripts中的一系列技术栈配置都“弹射”到应用的顶层，然后我们就可以研究这些配置细节了，而且可以更灵活地定制应用的配置。

![image-20210406222234531](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406222234531.png)

我们在命令行下执行下面的命令，完成“弹射”操作：![image-20210406222255207](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406222255207.png)

这个命令会让改变一些文件，也会添加一些文件。当前目录下会增加两个目录，一个是scripts，另一个是config，同时，package.json文件中的scripts部分也发生了变化：

![image-20210406222312227](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406222312227.png)

从此之后，start脚本将使用scripts目录下的start.js，而不是node_modules目录下的react-scripts，弹射成功，再也回不去了。在config目录下的webpack.config.dev.js文件，定制的就是npm start所做的构造过程，其中有一段关于babel的定义：![image-20210406222341825](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406222341825.png)

代码中paths.appSrc的值就是src，所以这段配置的含义指的是所有以js或者jsx为扩展名的文件，都会由babel所处理。

并不是所有的浏览器都支持所有ES6语法，但是有了babel，我们就可以不用顾忌太多，因为babel会把ES6语法的JavaScript代码转译（transpile）成浏览器普遍支持的JavaScript代码，实际上，在React的社区中，不使用ES6语法写代码才显得奇怪。



## 1.4 React的工作方式

和 jQuery 对比从而连接 React 的工作方式

### 1.4.1 jQuery如何工作

假设我们用jQuery来实现ClickCounter的功能，该怎么做呢？首先，我们要产生一个网页的HTML，写一个index.html文件如下所示：

![image-20210406222607539](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406222607539.png)

现在我们用jQuery来实现交互功能，和jQuery的传统一样，我们把JavaScript代码写在一个独立的文件clickCounter.js里面，如下所示：

![image-20210406222644328](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406222644328.png)

用浏览器打开上面创造的index.html，可以看到实际效果和我们写的React应用一模一样，但是对比这两段程序可以看出差异。

在jQuery的解决方案中，首先根据CSS规则找到id为clickCount的按钮，挂上一个匿名事件处理函数，在事件处理函数中，选中那个需要被修改的DOM元素，读取其中的文本值，加以修改，然后修改这个DOM元素。选中一些DOM元素，然后对这些元素做一些操作，这是一种最容易理解的开发模式。

jQuery的发明人John Resig就是发现了网页应用开发者的这个编程模式，才创造出了jQuery，其一问世就得到普遍认可，因为这种模式直观易懂。**但是，对于庞大的项目，这种模式会造成代码结构复杂，难以维护，每个jQuery的使用者都会有这种体会。**

### 1.4.2 React的理念

React的工作方式把开发者从繁琐的操作中解放出来，开发者只需要着重“我想要显示什么”，而不用操心“怎样去做”。

这种新的思维方式，对于一个简单的例子也要编写不少代码，感觉像是用高射炮打蚊子，但是对于一个大型的项目，这种方式编写的代码会更容易管理，因为整个React应用要做的就是渲染，开发者关注的是渲染成成什么样子，而不用关心如何实现增量渲染。

React的理念，归结为一个公式，就像下面这样：**UI=render(data)**

让我们来看看这个公式表达的含义，用户看到的界面（UI），应该是一个函数（在这里叫render）的执行结果，只接受数据（data）作为参数。这个函数是一个纯函数，所谓纯函数，指的是没有任何副作用，输出完全依赖于输入的函数，两次函数调用如果输入相同，得到的结果也绝对相同。如此一来，最终的用户界面，在render函数确定的情况下完全取决于输入数据。

**对于开发者来说，重要的是区分开哪些属于data，哪些属于render，想要更新用户界面，要做的就是更新data，用户界面自然会做出响应，所以React实践的也是“响应式编程”（Reactive Programming）的思想，这也就是React为什么叫做React的原因。**

### 1.4.3 Virtual DOM

既然React应用就是通过重复渲染来实现用户交互，你可能会有一个疑虑：这样的重复渲染会不会效率太低了呢？毕竟，在jQuery的实现方式中，我们可以清楚地看到每次只有需要变化的那一个DOM元素被修改了；可是，在React的实现方式中，看起来每次render函数被调用，都要把整个组件重新绘制一次，这样看起来有点浪费。事实并不是这样，React利用Virtual DOM，让每次渲染都只重新渲染最少的DOM元素。

**Virtual DOM就是对DOM树的抽象**。VirutalDOM不会触及浏览器的部分，只是存在于JavaScript空间的树形结构，每次自上而下渲染React组件时，会对比这一次产生的Virtual DOM和上一次渲染的VirtualDOM，对比就会发现差别，然后修改真正的DOM树时就只需要触及差别中的部分就行。

以ClickCounter为例，一开始点击计数为0，用户点击按钮让点击计数变成1，这一次重新渲染，React通过Virtual DOM的对比发现其实只是id为clickCount的span元素中内容从0变成了1而已：

![image-20210406223525401](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406223525401.png)

React发现这次渲染要做的事情只是更换这个span元素的内容而已，其他DOM元素都不需要触及，于是执行类似下面的语句，就完成了任务：

![image-20210406223544401](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406223544401.png)

React对比Virtual DOM寻找差异的过程比较复杂，在第5章，我们会详细介绍对比的过程。

### 1.4.4 React工作方式的优点

jQuery的方式直观易懂，对于初学者十分适用，但是当项目逐渐变得庞大时，用jQuery写出的代码往往互相纠缠，形成类似图1-4的状况，难以维护。

![image-20210406223652053](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406223652053.png)

使用React的方式，就可以避免构建这样复杂的程序结构，无论何种事件，引发的都是React组件的重新渲染，至于如何只修改必要的DOM部分，则完全交给React去操作，开发者并不需要关心，程序的流程简化为图1-5的样式。

![image-20210406223707553](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210406223707553.png)

React利用函数式编程的思维来解决用户界面渲染的问题，最大的优势是开发者的效率会大大提高，开发出来的代码可维护性和可阅读性也大大增强。

React等于强制所有组件都按照这种由数据驱动渲染的模式来工作，无论应用的规模多大，都能让程序处于可控范围内。

## 1.5 本章小结

在这一章里，我们用create-react-app创造了一个简单的React应用，在一开始，我们就按照组件的思想来开发应用，React的主要理念之一就是基于组件来开发应用。

通过和同样功能的jQuery实现方式对比，我们了解了React的工作方式，React利用声明式的语法，让开发者专注于描述用户界面“显示成什么样子”，而不是重复思考“如何去显示”，这样可以大大提高开发效率，也让代码更加容易管理。

虽然React是通过重复渲染来实现动态更新效果，但是借助Virtual DOM技术，实际上这个过程并不牵涉太多的DOM操作，所以渲染效率很高。

