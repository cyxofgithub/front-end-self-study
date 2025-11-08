## BFC

简洁回答：我觉得 BFC 可以理解成一个封闭的大箱子，箱子内部的元素不会影响到外部，然后不会被浮动元素所遮盖，我们利用这个特性就可以实现像三栏布局啊或者左边右边自适应等等，而且 BFC 还有一个特性是同一个 BFC 下的元素外边距会发生折叠，这种特性被称为 margin 塌陷

BFC 即 Block Formatting Contexts (块级格式化上下文) ，具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性，可以把 BFC 理解为一个封闭的大箱子，箱子内部的元素无论如何翻江倒海，都不会影响到外部。

**触发 BFC 的方法**

```
body 根元素
浮动元素：float 除 none 以外的值
绝对定位元素：position (absolute、fixed)
display 为 inline-block、table-cells、flex
overflow 除了 visible 以外的值 (hidden、auto、scroll)
```

**特性**

-   同一个 BFC 下外边距会发生折叠
