## esm 和 cjs 区别

[参考](../../../../js/esm、cmd、umd区别.md)

-   esm： 声明必须在顶层作用于、静态分析、支持 tree shaking、this 指向 undefind、循环依赖返回引用
-   commonjs：可以在任何位置动态引入、动态分析、this 指向 module.exports、循环依赖返回未加载完全的对象

循环依赖解决详细说明

-   [esm](../../../../js/esm原理和循环依赖问题.md)
-   [cjs](../../../../js/cjs原理和循环依赖问题.md)
