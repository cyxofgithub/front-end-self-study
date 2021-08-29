# React 基础

# React 入门

## React 简介

![image-20210720120819973](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720120819973.png)

![image-20210720120838974](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720120838974.png)

![image-20210720121554021](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720121554021.png)

tips：声明式编码与编程式编码的区别：声明式编码就好比我要一杯水，我咳嗽示意就有人主动递水过来，而命令式只需要我一步一步的指挥，去拿到一杯水

## React 库说明

![image-20210720155519447](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720155519447.png)

- 第一个是 React 的核心库，必须在第二个引入之前引入
- 第二个是操作 Dom 的库
- bable 的作用
- ![](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720155123841.png)

## Hello world

![image-20210720160535342](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720160535342.png)

tips：React 是由 jsx 写的所以其中的 type 必须为 babel 表示将 jsx 通过 bable 转换 js

## 用 jsx 不用 js 的原因

![image-20210720161158492](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720161158492.png)

![image-20210720161204657](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720161204657.png)

- 一看就知道用 jsx 创建虚拟 DOM 更加方便，不过就是要经过 babel 翻译成 js，总之 jsx 创建虚拟 DOM 的方式就是 JS 的一种语法糖
- 注意：React.creatElement 是用来创建虚拟 DOM 的，而 document.creatElement 是用来创建真实 DOM 的

## 关于 React 虚拟 DOM

![image-20210720162142442](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720162142442.png)

tips：这里的轻重是指两者的复杂程度，真实 DOM 的属性比虚拟 DOM 的属性要多的多

## XML 和 JSON 

![image-20210720162501326](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720162501326.png)

tips：很显然 JSON 比起 XML 来说要简单得多，所以现在用 JSON 比较多

## jsx 语法规则

```
<style>
		.title{
			background-color: orange;
			width: 200px;
		}
</style>
<script type="text/babel" >
		const myId = 'aTgUiGu'
		const myData = 'HeLlo,rEaCt'

		//1.创建虚拟DOM
		const VDOM = (
			<div>
				<h2 className="title" id={myId.toLowerCase()}>
					<span style={{color:'white',fontSize:'29px'}}>{myData.toLowerCase()}</span>
				</h2>
				<h2 className="title" id={myId.toUpperCase()}>
					<span style={{color:'white',fontSize:'29px'}}>{myData.toLowerCase()}</span>
				</h2>
				<input type="text"/>
			</div>
		)
		//2.渲染虚拟DOM到页面
		ReactDOM.render(VDOM,document.getElementById('test'))
	</script>
```

**jsx语法规则：**
						1.定义虚拟DOM时，不要写引号。
						2.标签中混入JS表达式时要用{}。
						3.样式的类名指定不要用class，要用className。
						4.内联样式，要用style={{key:value}}的形式去写,属性名要用小驼峰。
						5.只有一个根标签
						6.标签必须闭合
						7.标签首字母
								(1).若小写字母开头，则将该标签转为html中同名元素，若html中无该标签对应的同名元素，则报错。
								(2).若大写字母开头，react就去渲染对应的组件，若组件没有定义，则报错。

## React 花括号

- 里面只能写表达式

```
		/* 
			一定注意区分：【js语句(代码)】与【js表达式】
					1.表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方
								下面这些都是表达式：
										(1). a
										(2). a+b
										(3). demo(1)
										(4). arr.map() 
										(5). function test () {}
					2.语句(代码)：
								下面这些都是语句(代码)：
										(1).if(){}
										(2).for(){}
										(3).switch(){case:xxxx}
		
	 */

```

![image-20210720170814702](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720170814702.png)

# React 面向组件编程

## 函数式组件

![image-20210720173115660](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720173115660.png)

## 类注意点

![image-20210720173501645](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720173501645.png)

打印输出这样的意思：由类 person new 出来的空对象

![image-20210720173554414](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720173554414.png)

有属性的打印样例

![image-20210720174859540](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720174859540.png)

![image-20210720175014531](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720175014531.png)

tips：js 中类的重写本质上是在子类的原型上多增加了一个 speak 方法，因为原型链线上查询的过程中会优先拿自身原型的方法，所以就给人感觉是重写了父类方法

## 类式组件

![image-20210720175723625](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210720175723625.png)

tips：render 必须要由 return 后要渲染的标签

## 组件实例三大属性总结

### state

![image-20210721172256447](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210721172256447.png)

![image-20210721172213937](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210721172213937.png)

### prop

![image-20210721174541981](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210721174541981.png)

log 输出的是空，**注意 ...p 只能在 React 中的标签属性中使用，是第二行形式的一种语法糖，而在原生 js 中你 ...p 输出是会报错的，如果是这种 {...p} 可以对 p 完成深复制** 

**拓展运算符知识点**

```
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Document</title>
	</head>
	<body>
		<script type="text/javascript" >
			let arr1 = [1,3,5,7,9]
			let arr2 = [2,4,6,8,10]
			console.log(...arr1); //展开一个数组
			let arr3 = [...arr1,...arr2]//连接数组
			
			//在函数中使用拿到的是一个数组
			function sum(...numbers){
				return numbers.reduce((preValue,currentValue)=>{
					return preValue + currentValue
				})
			}
			console.log(sum(1,2,3,4));

			//构造字面量对象时使用展开语法
			let person = {name:'tom',age:18}
			//利用这种形式可以深复制
			let person2 = {...person}
			//console.log(...person); //报错，展开运算符不能展开对象
			person.name = 'jerry'
			console.log(person2);
			console.log(person);

			//合并对象 person name 会被改为 jack 增加 address 属性
			let person3 = {...person,name:'jack',address:"地球"}
			console.log(person3);
			
		</script>
	</body>
</html>
```

![image-20210721183909249](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210721183909249.png)

注意：函数式组件只能使用三大属性中的 props 因为它有参数

![image-20210721184550261](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210721184550261.png)

**注意要使用属性限制时需要引入一个库**

![image-20210721184805924](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210721184805924.png)

![image-20210721185032098](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210721185032098.png)

props 是只读属性所以不能在组件内部进行修改

**设置props默认值** 

![image-20210721185146372](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210721185146372.png)

### ref

- 字符串形式：效率低不建议使用
- 回调形式 ref

![](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210722163254719.png)

![image-20210722163445384](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210722163445384.png)

注释的就是内联的形式

- creatRef（React.createRef调用后可以返回一个容器，该容器可以存储被ref所标识的节点,该容器是“专人专用”的，React 最推荐的形式）

![image-20210722164015128](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210722164015128.png)

tips：![image-20210722170544400](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210722170544400.png)

## 受控组件和非受控组件总结

- 受控组件的优势在于可以省略掉 ref，且组件状态实时更新，可以类比成 vue 的双向绑定
- 而非受控组件的特点是现用现取，不会实时更新组件状态，数据的获取通过的是 ref

## 高阶函数和函数科利华

```
<script type="text/babel">
		//#region 
				/* 
					高阶函数：如果一个函数符合下面2个规范中的任何一个，那该函数就是高阶函数。
									1.若A函数，接收的参数是一个函数，那么A就可以称之为高阶函数。
									2.若A函数，调用的返回值依然是一个函数，那么A就可以称之为高阶函数。
									常见的高阶函数有：Promise、setTimeout、arr.map()等等

					函数的柯里化：通过函数调用继续返回函数的方式，实现多次接收参数最后统一处理的函数编码形式。 
						function sum(a){
							return(b)=>{
								return (c)=>{
									return a+b+c
								}
							}
						}
					*/
		//#endregion
		//创建组件
		class Login extends React.Component{
			//初始化状态
			state = {
				username:'', //用户名
				password:'' //密码
			}

			//保存表单数据到状态中
			saveFormData = (dataType)=>{
				
				// onchange 的回调就是这个，初始化时 onchange 调用外层函数获得了这个 return 的值，然后我们每次 change 就会调用这个函数
				return (event)=>{

					// 在对象中 key 要用 [] 包裹起来才能表示 key 是变量
					this.setState({[dataType]:event.target.value})
				}
			}

			//表单提交的回调
			handleSubmit = (event)=>{
				event.preventDefault() //阻止表单提交
				const {username,password} = this.state
				alert(`你输入的用户名是：${username},你输入的密码是：${password}`)
			}
			render(){
				return(
					<form onSubmit={this.handleSubmit}>
						用户名：<input onChange={this.saveFormData('username')} type="text" name="username"/>
						密码：<input onChange={this.saveFormData('password')} type="password" name="password"/>
						<button>登录</button>
					</form>
				)
			}
		}
		//渲染组件
		ReactDOM.render(<Login/>,document.getElementById('test'))
	</script>
```

- this.saveFormData直接调用 要传参所以你就不得不用高阶函数（这里也用到函数的柯里化，先获得了 dataType（比如 username）然后再返回的函数中又有一个参数（节点对象），然后对这两个参数进行统一处理，这便是函数柯里化的用法），如果你不返回一个函数直接返回一个值会导致 onChange 失效
- 初始化时 onchange 调用外层函数获得了这个 return 的值（值为函数），然后我们每次 change 就会调用这个函数，否则就是调用一个普通值，onChange 就会失效

**简化后的内联式写法**（这不是柯里化，没有返回函数）

```
		//创建组件
		class Login extends React.Component{
			//初始化状态
			state = {
				username:'', //用户名
				password:'' //密码
			}

			//保存表单数据到状态中
			saveFormData = (dataType,event)=>{
				this.setState({[dataType]:event.target.value})
			}

			//表单提交的回调
			handleSubmit = (event)=>{
				event.preventDefault() //阻止表单提交
				const {username,password} = this.state
				alert(`你输入的用户名是：${username},你输入的密码是：${password}`)
			}
			render(){
				return(
					<form onSubmit={this.handleSubmit}>
						用户名：<input onChange={event => this.saveFormData('username',event) } type="text" name="username"/>
						密码：<input onChange={event => this.saveFormData('password',event) } type="password" name="password"/>
						<button>登录</button>
					</form>
				)
			}
		}
		//渲染组件
		ReactDOM.render(<Login/>,document.getElementById('test'))
```

## 生命周期函数

### 旧版

![image-20210723202403975](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210723202403975.png)

**组件是否应该被更新**

![image-20210723195917671](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210723195917671.png)

tips：不写的时候默认返回真，返回 false 组件将无法更新

![image-20210723202631367](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210723202631367.png)

![image-20210723203105282](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210723203105282.png)

### 新版

![image-20210723203546718](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210723203546718.png)



- ![image-20210725094206488](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210725094206488.png)

  tips：若state的值在任何时候都取决于props，那么可以使用getDerivedStateFromProps（从Props得到一个派生（简单理解派生意思就是从其他地方获得）的状态）

- ![image-20210725094339477](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210725094339477.png)

- ![image-20210725094418809](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210725094418809.png)

  tips：获取组件更新前的快照（获取更新前的状态属性等）

- ![image-20210725094607304](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210725094607304.png)

- ![image-20210725094639160](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210725094639160.png)

### 新旧区别

![image-20210723205220841](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210723205220841.png)

tips：-3 + 2

## Dom 的 Diffing 算法

```
	/*
   经典面试题:
      1). react/vue中的key有什么作用？（key的内部原理是什么？）
      2). 为什么遍历列表时，key最好不要用index?
      
			1. 虚拟DOM中key的作用：
					1). 简单的说: key是虚拟DOM对象的标识, 在更新显示时key起着极其重要的作用。

					2). 详细的说: 当状态中的数据发生变化时，react会根据【新数据】生成【新的虚拟DOM】, 
												随后React进行【新虚拟DOM】与【旧虚拟DOM】的diff比较，比较规则如下：

									a. 旧虚拟DOM中找到了与新虚拟DOM相同的key：
												(1).若虚拟DOM中内容没变, 直接使用之前的真实DOM
												(2).若虚拟DOM中内容变了, 则生成新的真实DOM，随后替换掉页面中之前的真实DOM

									b. 旧虚拟DOM中未找到与新虚拟DOM相同的key
												根据数据创建新的真实DOM，随后渲染到到页面
									
			2. 用index作为key可能会引发的问题：
								1. 若对数据进行：逆序添加、逆序删除等破坏顺序操作:
												会产生没有必要的真实DOM更新 ==> 界面效果没问题, 但效率低。

								2. 如果结构中还包含输入类的DOM：
												会产生错误DOM更新 ==> 界面有问题。
												
								3. 注意！如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，
									仅用于渲染列表用于展示，使用index作为key是没有问题的。
					
			3. 开发中如何选择key?:
								1.最好使用每条数据的唯一标识作为key, 比如id、手机号、身份证号、学号等唯一值。
								2.如果确定只是简单的展示数据，用index也是可以的。
   */
	
	/* 
		慢动作回放----使用index索引值作为key

			初始数据：
					{id:1,name:'小张',age:18},
					{id:2,name:'小李',age:19},
			初始的虚拟DOM：
					<li key=0>小张---18<input type="text"/></li>
					<li key=1>小李---19<input type="text"/></li>

			更新后的数据：
					{id:3,name:'小王',age:20},
					{id:1,name:'小张',age:18},
					{id:2,name:'小李',age:19},
			更新数据后的虚拟DOM：
					<li key=0>小王---20<input type="text"/></li>
					<li key=1>小张---18<input type="text"/></li>
					<li key=2>小李---19<input type="text"/></li>

	本来小张小李是可以复用的，你用 index 做了 key 导致这两条数据的真实 dom 都要重新生成（diff算法对比的时候会先找 key 一样的节点进行对比，如果里面的内容变化了就会生成新的节点，删除旧的节点）
	-----------------------------------------------------------------

	慢动作回放----使用id唯一标识作为key

			初始数据：
					{id:1,name:'小张',age:18},
					{id:2,name:'小李',age:19},
			初始的虚拟DOM：
					<li key=1>小张---18<input type="text"/></li>
					<li key=2>小李---19<input type="text"/></li>

			更新后的数据：
					{id:3,name:'小王',age:20},
					{id:1,name:'小张',age:18},
					{id:2,name:'小李',age:19},
			更新数据后的虚拟DOM：
					<li key=3>小王---20<input type="text"/></li>
					<li key=1>小张---18<input type="text"/></li>
					<li key=2>小李---19<input type="text"/></li>


	 */
```

# React 应用（基于React脚手架）

## 创建 React 应用

- **关于脚手架**

![image-20210725104755281](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210725104755281.png)

- **创建启动项目**

![image-20210725104832026](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210725104832026.png)

## 文件介绍

```
	public ---- 静态资源文件夹
		favicon.icon ------ 网站页签图标
		index.html -------- 主页面
		logo192.png ------- logo图
		logo512.png ------- logo图
		manifest.json ----- 应用加壳的配置文件
		robots.txt -------- 爬虫协议文件
src ---- 源码文件夹
		App.css -------- App组件的样式
		App.js --------- App组件
		App.test.js ---- 用于给App做测试
		index.css ------ 样式
		index.js ------- 入口文件
		logo.svg ------- logo图
		reportWebVitals.js
			--- 页面性能分析文件(需要web-vitals库的支持)
		setupTests.js
			---- 组件单元测试的文件(需要jest-dom库的支持)

```

- index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
		<meta charset="utf-8" />
		<!-- %PUBLIC_URL%代表public文件夹的路径 -->
		<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
		<!-- 开启理想视口，用于做移动端网页的适配 -->
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!-- 用于配置浏览器页签+地址栏的颜色(仅支持安卓手机浏览器) -->
    <meta name="theme-color" content="red" />
    <meta
      name="description"
      content="Web site created using create-react-app"
		/>
		<!-- 用于指定网页添加到手机主屏幕后的图标 -->
		<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
		<!-- 应用加壳(就是 uniapp 等框架的原理，比如通过 Hubild 等工具给页面加壳在一个 .apk 的文件中（本质可以理解还是.html文件）就变成了一个安卓应用)时的配置文件 -->
		<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React App</title>
  </head>
  <body>
		<!-- 若llq不支持js则展示标签中的内容 -->
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

## 注意

![image-20210726101537306](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726101537306.png)

tips：这里并不是结构赋值，这里有花括号说明是分别暴露的形式，不是你想的说 react 文件暴露了一个对象然后你拿到对象中的 Component属性，而是这文件暴露了两个东西，一个是默认暴露，一个常规暴露

![image-20210726111608160](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210726111608160.png)

## TodoList 案例

- 子传父通信

  tips：父给子一个函数 Prop，子调用给函数，并将数据通过参数传递给父

- 父传子通信

  tips：直接传一个 prop 给子即可

- 原生事件一般都有个 event 原调可以获取你想要的参数

- checked 和 defaultCheckd

  tips：多选或者的 checked 属性使用时应当要有回调控制它的状态不然会有报错而 defaultCheckd 只在第一次生效，后面状态改变也不会生效了

  ![image-20210727094045250](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210727094045250.png)

![image-20210727094456911](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210727094456911.png)

# React AJAX

常用 axios

# React脚手架配置代理总结



## 方法一

> 在package.json中追加如下配置

```json
"proxy":"http://localhost:5000"
```

说明：

1. 优点：配置简单，前端请求资源时可以不加任何前缀。
2. 缺点：不能配置多个代理。
3. 工作方式：上述方式配置代理，当请求了3000不存在的资源时，那么该请求会转发给5000 （优先匹配前端资源）



## 方法二

1. 第一步：创建代理配置文件

   ```
   在src下创建配置文件：src/setupProxy.js
   ```

2. 编写setupProxy.js配置具体代理规则：

   ```js
   const proxy = require('http-proxy-middleware')
   
   module.exports = function(app) {
     app.use(
       proxy('/api1', {  //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
         target: 'http://localhost:5000', //配置转发目标地址(能返回数据的服务器地址)
         changeOrigin: true, //控制服务器接收到的请求头中host字段的值
         /*
         	changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
         	changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
         	changeOrigin默认值为false，但我们一般将changeOrigin值设为true
         */
         pathRewrite: {'^/api1': ''} //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
       }),
       proxy('/api2', { 
         target: 'http://localhost:5001',
         changeOrigin: true,
         pathRewrite: {'^/api2': ''}
       })
     )
   }
   ```

说明：

1. 优点：可以配置多个代理，可以灵活的控制请求是否走代理。
2. 缺点：配置繁琐，前端请求资源时必须加前缀。

# GitHub 搜索案例

**连续解构**

![image-20210727110622340](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210727110622340.png)

从 this 对象中获取 keywordElement 并赋值给 keyWordElement，再从 keyWordElement 中获取 value 并赋值给 keyWord

**三元表达式嵌套**

![image-20210727154500766](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210727154500766.png)

注意模板中不能展示对象！！

## 消息订阅与发布机制

![image-20210727172915318](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210727172915318.png)

## Fetch 请求

![image-20210727172945201](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210727172945201.png)

- 发送 AJAX 请求不仅仅可以通过 xhr（jq，axios 等是基于 xhr 封装的库） 还可以通过 fetch（出的新用得还是比较少，当然还是比原生 xhr 好用）

- 从上面代码可以看出关注分离的设计思想，先通过 response 得知是否能成功连接服务器，再通过 data 获取返回来的数据

![image-20210727172449557](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210727172449557.png)

# React 路由

## 对 SPA 应用的理解

![image-20210727173727949](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210727173727949.png)

tips：react 和 vue 都是

## 路由的理解

![image-20210728205138369](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210728205138369.png)

## 路由的分类

![image-20210728205233394](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210728205233394.png)

## 路由的底层实现原理

- HashRouter：通过 window.location.hash（跳转） window.location.href（重定向） window.onhaschange（监听hash变化）

![image-20210728220617752](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210728220617752.png)

​		tips：这里的 123 就是一个 hash，这里本质就是 window.location.hash = 123

​				（这里是个人理解）返回应该是通过记录这些 hash 在栈中，然后根据栈的内容使用 window.location.hash 跳转

- BrowserRouter：通过 window.history.pushState（跳转） 和 replaceState（重定向） 以及 back（返回） state（监听变化）
- 区别
  - ![preview](https://pic1.zhimg.com/v2-b361a635ebc16bb293b65cac62958f04_r.jpg)
- 总结：两种方式都可以实现无刷新更新路径，然后根据路径的变化去渲染页面，这就是 SPA 应用的实现原理

## react-router 的理解

![image-20210728212435419](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210728212435419.png)

tips：

- 它下面有三个库 dom、navtive、any，分别给 web、移动端、通用
- 我们现在学的这个是 react-router-dom（脚手架搭建的项目不会给你下载，需要你自己下载）

## react-router-dom 相关 API

- 内置组件

![image-20210730103420680](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730103420680.png)

**像 route、switch 这些都是内置组件，用的时候需要从 react-router-dom 库中引入**

- 其他

![image-20210730103449508](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730103449508.png)

## 基本路由使用

- 准备

![image-20210730103514585](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730103514585.png)

​      1.明确好界面中的导航区、展示区

​      2.导航区的a标签改为Link标签（编码后在页面显示的仍然是 a 标签）

​            <Link to="/xxxxx">Demo</Link>

​      3.展示区写Route标签进行路径的匹配

​            <Route path='/xxxx' component={Demo}/>

​      4.<App>的最外侧包裹了一个<BrowserRouter>或<HashRouter>

## 路由组件与一般组件

![image-20210730102636394](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730102636394.png)

## NavLink与封装NavLink

1.NavLink可以实现路由链接的高亮，通过activeClassName指定样式名，不指定样式名默认是 active

2.组件标签体内容存在于特殊的标签属性 this.props.children中，当想把标签体内容一起传递给其他组件的时候，只需要在目标组件展开 ...props  属性即可

![image-20210730105459595](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730105459595.png)

## **Switch的使用**

![image-20210730110123698](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730110123698.png)

![image-20210730110131795](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730110131795.png)

tips：包裹了 switch 标签后路径匹配到一个路由就不会往下面继续匹配了，这样做的效率比较高，因为一般一个路径只匹配一个路由就够了

## **解决多级路径刷新页面样式丢失的问题**

- 造成原因：

  当你使用多级路径时如果引入是用 ./ 这样开头，当浏览器刷新重新请求时相对路径会变成原本的路径加上第一个路由路径造成资源请求地址错误

- 解决方法：

​        1.NavLink与封装NavLink.public/index.html 中 引入样式时不写 ./ 写 / （常用，表示公共路径下的什么什么）

​        2.public/index.html 中 引入样式时不写 ./ 写 %PUBLIC_URL% （常用，这表示绝对路径）

​        3.使用HashRouter（因为 # 后的内容它会默认是前端资源内容，不会将其内容错误纳入公共路径）

tips：课程 82 

## **路由的严格匹配与模糊匹配**

![image-20210730184626767](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730184626767.png)

​        1.默认使用的是模糊匹配（简单记：【输入的路径】必须包含要【匹配的路径】，且顺序要一致），home 可以匹配到

​        2.开启严格匹配：<Route exact={true} path="/about" component={About}/>，home 无法匹配到，路径要完全一致

​        3.严格匹配不要随便开启，需要再开，有些时候开启会导致无法继续匹配二级路由



## **Redirect的使用**

![image-20210730185259074](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730185259074.png)

​        1.一般写在所有路由注册的最下方，当所有路由都无法匹配时，跳转到Redirect指定的路由

​        2.具体编码：

​            <Switch>

​              <Route path="/about" component={About}/>

​              <Route path="/home" component={Home}/>

​              <Redirect to="/about"/>

​            </Switch>

## 嵌套路由

​        1.注册子路由时要写上父路由的path值

​        2.路由的匹配是按照注册路由的顺序进行的**（先在父组件的路由上进行匹配，然后才在子组件的路由进行匹配）**

​		3.通过 redict 组件实现子路由默认展示（跟父路由默认展示道理一样）

![image-20210730191934912](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730191934912.png)

## **向路由组件传递参数**

###         1.params参数

​              路由链接(携带参数)：<Link to='/demo/test/tom/18'}>详情</Link>

​              注册路由(声明接收)：<Route path="/demo/test/:name/:age" component={Test}/>

​              接收参数：this.props.match.params

![image-20210730193416495](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210730193416495.png)

​				tips：用 find 比起 fliter 效率更高， find 找到后就不会再继续找了，fliter 会完全遍历一遍

###         2.search参数

​			tips:（在 React 叫 search，平时都是称为 query 参数）

​              路由链接(携带参数)：<Link to='/demo/test?name=tom&age=18'}>详情</Link>

​              注册路由(无需声明，正常注册即可)：<Route path="/demo/test" component={Test}/>

​              接收参数：this.props.location.search

​              备注：获取到的search是urlencoded编码字符串（就是key1=value1$key2=value2这种形式），需要借助querystring解析(在 				react 中需要引入这个库)

![image-20210731101222212](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210731101222212.png)

###         3.state参数

​              路由链接(携带参数)：<Link to={{pathname:'/demo/test',state:{name:'tom',age:18}}}>详情</Link>

​				tips：上面的两种方法的链接也可以写成 pathname + 参数这种形式

​              注册路由(无需声明，正常注册即可)：<Route path="/demo/test" component={Test}/>

​              接收参数：this.props.location.state

​              备注：刷新也可以保留住参数（为什么要单独说这个呢，因为上面两个参数有没有保留直接体现在地址栏上，直接通过地址栏判				断即可）

## push 和 replace

![image-20210731104210622](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210731104210622.png)

- 路由导航链接默认是 push 模式
- 若要开启 replace 模式需要用 replace 参数说明

## 编程式路由导航

![image-20210731111126805](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210731111126805.png)

## withRouter 的使用

![image-20210731111856375](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210731111856375.png)

## **BrowserRouter与HashRouter的区别**

​      1.底层原理不一样：

​            BrowserRouter使用的是H5的history API，不兼容IE9及以下版本。

​            HashRouter使用的是URL的哈希值。

​      2.path表现形式不一样

​            BrowserRouter的路径中没有#,例如：localhost:3000/demo/test

​            HashRouter的路径包含#,例如：localhost:3000/#/demo/test

​      3.刷新后对路由state参数的影响

​            (1).BrowserRouter没有任何影响，因为state保存在history对象中。

​            **(2).HashRouter刷新后会导致路由state参数的丢失！！！**

​      4.备注：HashRouter可以用于解决一些路径错误相关的问题。

# React UI组件库

![image-20210731112840625](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210731112840625.png)

- elemnt-ui
- vantUI 移动端 UI

# Redux

## Redux 理解

![image-20210801101042877](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210801101042877.png)

![image-20210801101628027](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210801101628027.png)

![image-20210801101716473](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210801101716473.png)

- action：一个对象，存放要操作的数据和操作动作（+、-等）

  - dispatch：将要进行的 action 分发（告知）给仓库（Store）

- Store：接收 dispatch 的通知，交给 Reducer（两者的身份有点像指挥者（store）和员工（reducers））让它执行，另外它有一个 getState（）API 可以让 React 组件获取数据状态，注意初始的 previousState 是 undefined，毕竟初始的状态哪有先前状态？

- Reducer：从 Store 哪里获得要操作数据的先前状态，然后执行 action 动作并将状态返回给 Store；有两个功能一个是加工状态一个是初始化状态；注意它只负责状态的更改，不负责页面的更新
  - 局部更新页面

  ```
  	/* componentDidMount(){
  		//检测redux中状态的变化，只要变化，就调用render
  		store.subscribe(()=>{
  			this.setState({})
  		})
  	} */
  ```

  - 在全局 index.js 中更新页面

  ```
  store.subscribe(()=>{
  	ReactDOM.render(<App/>,document.getElementById('root'))
  })
  ```

## Redux 的三个核心概念

![image-20210801104529089](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210801104529089.png)

![image-20210801104300317](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210801104300317.png)

## **求和案例_redux精简版**

​    (1).去除Count组件自身的状态

​    (2).src下建立:

​            -redux

​              -store.js

​              -count_reducer.js

​    (3).store.js：

​          1).引入redux中的createStore函数，创建一个store

​          2).createStore调用时要传入一个为其服务的reducer

​          3).记得暴露store对象

```
/* 
	该文件专门用于暴露一个store对象，整个应用只有一个store对象
*/

//引入createStore，专门用于创建redux中最为核心的store对象
import {createStore} from 'redux'
//引入为Count组件服务的reducer
import countReducer from './count_reducer'
//暴露store
export default createStore(countReducer)
```

​    (4).count_reducer.js：

​          1).reducer的本质是一个函数，接收：preState,action，返回加工后的状态

​          2).reducer有两个作用：初始化状态，加工状态

​          3).reducer被第一次调用时，是store自动触发的，

​                  传递的preState是undefined,

​                  传递的action是:{type:'@@REDUX/INIT_a.2.b.4}

```
/* 
	1.该文件是用于创建一个为Count组件服务的reducer，reducer的本质就是一个函数
	2.reducer函数会接到两个参数，分别为：之前的状态(preState)，动作对象(action)
*/

const initState = 0 //初始化状态
export default function countReducer(preState=initState,action){
	// console.log(preState);
	//从action对象中获取：type、data
	const {type,data} = action
	//根据type决定如何加工数据
	switch (type) {
		case 'increment': //如果是加
			return preState + data
		case 'decrement': //若果是减
			return preState - data
		default:
			return preState
	}
}
```

​    (5).在index.js中监测store中状态的改变，一旦发生改变重新渲染<App/>

​        备注：redux只负责管理状态，至于状态的改变驱动着页面的展示，要靠我们自己写。

```
store.subscribe(()=>{
	ReactDOM.render(<App/>,document.getElementById('root'))
})
```

tips：subscibe API在发现 store 状态改变就会调用

## **求和案例_redux完整版**

​      1.count_action.js 专门用于创建action对象

```
/* 
	该文件专门为Count组件生成action对象
*/
import {INCREMENT,DECREMENT} from './constant'

export const createIncrementAction = data => ({type:INCREMENT,data})
export const createDecrementAction = data => ({type:DECREMENT,data})
```

​      2.constant.js 放置容易写错的type值

```
/* 
	该模块是用于定义action对象中type类型的常量值，目的只有一个：便于管理的同时防止程序员单词写错,后期可能 type 值官方改版，修改也方便
*/
export const INCREMENT = 'increment'
export const DECREMENT = 'decrement'
```

## **求和案例_redux异步action版**

```
		 (1).明确：延迟的动作不想交给组件自身处理，想交给action
		 (2).何时需要异步action：想要对状态进行操作，但是具体的数据靠异步任务返回。
		 (3).具体编码：
		 			1).yarn add redux-thunk（可以让我们 dispatch 一个返回 action 对象的一个函数），并配置在store中
		 			2).创建action的函数不再返回一般对象，而是一个函数，该函数中写异步任务。
		 			3).异步任务有结果后，分发一个同步的action去真正操作数据。
		 (4).备注：异步action不是必须要写的，完全可以自己等待异步任务的结果了再去分发同步action。
```

**store.js**

```
/* 
	该文件专门用于暴露一个store对象，整个应用只有一个store对象
*/

//引入createStore，专门用于创建redux中最为核心的store对象
import {createStore,applyMiddleware} from 'redux'
//引入为Count组件服务的reducer
import countReducer from './count_reducer'
//引入redux-thunk，用于支持异步action
import thunk from 'redux-thunk'
//暴露store
export default createStore(countReducer,applyMiddleware(thunk))
```

**count_action.js**

```
/* 
	该文件专门为Count组件生成action对象
*/
import {INCREMENT,DECREMENT} from './constant'

//同步action，就是指action的值为Object类型的一般对象
export const createIncrementAction = data => ({type:INCREMENT,data})
export const createDecrementAction = data => ({type:DECREMENT,data})

//异步action，就是指action的值为函数,异步action中一般都会调用同步action，异步action不是必须要用的。
export const createIncrementAsyncAction = (data,time) => {
	return (dispatch)=>{
		setTimeout(()=>{
			dispatch(createIncrementAction(data))
		},time)
	}
}
```

## 对 react-redux 的理解

![image-20210803204022409](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210803204022409.png)

tips： React 和 Redux 不是同一家东西，因为 React 开发者特别喜欢引入 Redux 对组件进行状态管理，所以 faceBook 公司便开发了  react-redux 这个库，方便开发者们操作 Redux

## react - redux 的基本使用

```
			(1).明确两个概念：
						1).UI组件:不能使用任何redux的api，只负责页面的呈现、交互等。
						2).容器组件：负责和redux通信，将结果交给UI组件。
			(2).如何创建一个容器组件————靠react-redux 的 connect函数
							connect(mapStateToProps,mapDispatchToProps)(UI组件)
								-mapStateToProps:映射状态，返回值是一个对象
								-mapDispatchToProps:映射操作状态的方法，返回值是一个对象
			(3).备注1：容器组件中的store是靠props传进去的，而不是在容器组件中直接引入
			(4).备注2：mapDispatchToProps，也可以是一个对象
```

**组件容器**

```
//引入Count的UI组件
import CountUI from '../../components/Count'
//引入action
import {
	createIncrementAction,
	createDecrementAction,
	createIncrementAsyncAction
} from '../../redux/count_action'

//引入connect用于连接UI组件与redux
import {connect} from 'react-redux'

/* 
	1.mapStateToProps函数返回的是一个对象；
	2.返回的对象中的key就作为传递给UI组件props的key,value就作为传递给UI组件props的value
	3.mapStateToProps用于传递状态
*/
function mapStateToProps(state){
	return {count:state}
}

/* 
	1.mapDispatchToProps函数返回的是一个对象；
	2.返回的对象中的key就作为传递给UI组件props的key,value就作为传递给UI组件props的value
	3.mapDispatchToProps用于传递操作状态的方法
*/
function mapDispatchToProps(dispatch){
	return {
		jia:number => dispatch(createIncrementAction(number)),
		jian:number => dispatch(createDecrementAction(number)),
		jiaAsync:(number,time) => dispatch(createIncrementAsyncAction(number,time)),
	}
}

//使用connect()()创建并暴露一个Count的容器组件
export default connect(mapStateToProps,mapDispatchToProps)(CountUI)

//使用connect()()创建并暴露一个Count的容器组件精简写法
export default connect(
	state => ({count:state}),

	//mapDispatchToProps的一般写法
	/* dispatch => ({
		jia:number => dispatch(createIncrementAction(number)),
		jian:number => dispatch(createDecrementAction(number)),
		jiaAsync:(number,time) => dispatch(createIncrementAsyncAction(number,time)),
	}) */

	//mapDispatchToProps的简写
	{
		jia:createIncrementAction,
		jian:createDecrementAction,
		jiaAsync:createIncrementAsyncAction,
	}
)(Count)

```

## react - redux 优化

```
			(1).容器组件和UI组件整合一个文件
			(2).无需自己给容器组件传递store，给<App/>包裹一个<Provider store={store}>即可。
			(3).使用了react-redux后也不用再自己检测redux中状态的改变了，容器组件可以自动完成这个工作。
			(4).mapDispatchToProps也可以简单的写成一个对象
			(5).一个组件要和redux“打交道”要经过哪几步？
							(1).定义好UI组件---不暴露
							(2).引入connect生成一个容器组件，并暴露，写法如下：
									connect(
										state => ({key:value}), //映射状态
										{key:xxxxxAction} //映射操作状态的方法
									)(UI组件)
							(4).在UI组件中通过this.props.xxxxxxx读取和操作状态
```

```
import React, { Component } from 'react'
//引入action
import {
	createIncrementAction,
	createDecrementAction,
	createIncrementAsyncAction
} from '../../redux/count_action'
//引入connect用于连接UI组件与redux
import {connect} from 'react-redux'

//定义UI组件
class Count extends Component {

	state = {carName:'奔驰c63'}

	//加法
	increment = ()=>{
		const {value} = this.selectNumber
		this.props.jia(value*1)
	}
	//减法
	decrement = ()=>{
		const {value} = this.selectNumber
		this.props.jian(value*1)
	}
	//奇数再加
	incrementIfOdd = ()=>{
		const {value} = this.selectNumber
		if(this.props.count % 2 !== 0){
			this.props.jia(value*1)
		}
	}
	//异步加
	incrementAsync = ()=>{
		const {value} = this.selectNumber
		this.props.jiaAsync(value*1,500)
	}

	render() {
		//console.log('UI组件接收到的props是',this.props);
		return (
			<div>
				<h1>当前求和为：{this.props.count}</h1>
				<select ref={c => this.selectNumber = c}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>&nbsp;
				<button onClick={this.increment}>+</button>&nbsp;
				<button onClick={this.decrement}>-</button>&nbsp;
				<button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
				<button onClick={this.incrementAsync}>异步加</button>&nbsp;
			</div>
		)
	}
}

//使用connect()()创建并暴露一个Count的容器组件
export default connect(
	state => ({count:state}),

	//mapDispatchToProps的一般写法
	/* dispatch => ({
		jia:number => dispatch(createIncrementAction(number)),
		jian:number => dispatch(createDecrementAction(number)),
		jiaAsync:(number,time) => dispatch(createIncrementAsyncAction(number,time)),
	}) */

	//mapDispatchToProps的简写
	{
		jia:createIncrementAction,
		jian:createDecrementAction,
		jiaAsync:createIncrementAsyncAction,
	}
)(Count)
```

## **react - redux数据共享版**

```
(1).定义一个Pserson组件，和Count组件通过redux共享数据。
(2).为Person组件编写：reducer、action，配置constant常量。
(3).重点：Person的reducer和Count的Reducer要使用combineReducers进行合并，
		合并后的总状态是一个对象！！！
(4).交给store的是总reducer，最后注意在组件中取出状态的时候，记得“取到位”。
```

**store.js 配置** 

```
/* 
	该文件专门用于暴露一个store对象，整个应用只有一个store对象
*/

//引入createStore，专门用于创建redux中最为核心的store对象
import {createStore,applyMiddleware,combineReducers} from 'redux'
//引入为Count组件服务的reducer
import countReducer from './reducers/count'
//引入为Count组件服务的reducer
import personReducer from './reducers/person'
//引入redux-thunk，用于支持异步action
import thunk from 'redux-thunk'

//汇总所有的reducer变为一个总的reducer
const allReducer = combineReducers({
	he:countReducer,
	rens:personReducer
})

//暴露store
export default createStore(allReducer,applyMiddleware(thunk))
```

​	注意：reducer 应该是一个纯函数

```
import {ADD_PERSON} from '../constant'

//初始化人的列表
const initState = [{id:'001',name:'tom',age:18}]

export default function personReducer(preState=initState,action){
	// console.log('personReducer@#@#@#');
	const {type,data} = action
	switch (type) {
		case ADD_PERSON: //若是添加一个人
		// 不要用 resturn preState.push...or unshift
			return [data,...preState]
		default:
			return preState
	}
}
```

![image-20210807101325530](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20210807101325530.png)

很明显用了 preState.push or unshift 的 reducer 已经改变了外部的输入，不是纯函数

## Redux 开发者工具的使用

```
	(1).yarn add redux-devtools-extension
	(2).store中进行配置
			import {composeWithDevTools} from 'redux-devtools-extension'
			const store = createStore(allReducer,composeWithDevTools(applyMiddleware(thunk)))
```

## **求和案例_react-redux最终版**

```
(1).所有变量名字要规范，尽量触发对象的简写形式。

(2).reducers文件夹中，编写index.js专门用于汇总并暴露所有的reducer
```

```
/* 
	该文件用于汇总所有的reducer为一个总的reducer
*/
//引入combineReducers，用于汇总多个reducer
import {combineReducers} from 'redux'
//引入为Count组件服务的reducer
import count from './count'
//引入为Person组件服务的reducer
import persons from './person'

//汇总所有的reducer变为一个总的reducer
export default  combineReducers({
	count,
	persons
})
```

## 项目打包运行

npm i -g serve 这个库可以给文件夹开启一个服务器

