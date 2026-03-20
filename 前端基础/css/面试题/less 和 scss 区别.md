Less 与 SCSS 的区别：

1.  **变量定义方式**

    -   **Less**：用 `@变量名` 定义变量，如 `@color: #f00;`
    -   **SCSS**：用 `$变量名` 定义变量，如 `$color: #f00;`  
        SCSS 变量能结合 map、默认值、作用域等特性更灵活。

2.  **嵌套规则**

        - 两者都支持选择器嵌套写法，但 SCSS 支持父选择器占位符 `#{}`，以及更强的父子关系控制。

    **父选择器占位符（SCSS 独有）示例：**

```scss
.card {
    color: #333;
    &:hover {
        // #{&} 代表父选择器 .card，此处可以灵活拼接
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .icon-#{$state} {
        // #{$state} 可以插入变量实现动态类名
        width: 24px;
        height: 24px;
    }
    // 父选择器占位符结合媒体查询
    @media (max-width: 600px) {
        // #{&} 表示把父选择器（即 .card）动态插入到这里，实现嵌套时更灵活的选择器组合
        #{&} {
            font-size: 14px;
        }
    }
}
```

_说明：`#{&}` 为父选择器占位符，可以动态将父级选择器插入到任意位置，实现更灵活的嵌套选择器和自定义样式。Less 不支持此语法。_

3. **混合（Mixin）**

    - **Less**：Mixin 支持参数，类似函数调用。

        **示例：**

        ```less
        .border-radius(@radius) {
            border-radius: @radius;
        }
        .box {
            .border-radius(8px);
        }
        ```

    - **SCSS**：Mixin 更加完善，支持默认参数、可变参数，以及 `@include` 调用方式。SCSS 还支持 `@extend` 继承选择器和 `placeholder` 占位选择器（以 `%` 开头）。

        **示例：**

        ```scss
        @mixin border-radius($radius: 6px) {
            border-radius: $radius;
        }
        .box {
            @include border-radius(8px);
        }

        // @extend 和占位选择器
        %clearfix {
            &::after {
                content: '';
                display: block;
                clear: both;
            }
        }
        .container {
            @extend %clearfix;
        }
        ```

4. **运算与函数**

    - 两者都支持样式中直接运算，比如加减乘除。

    - **Less** 示例：
        ```less
        @base: 10px;
        .demo {
            width: @base * 2;
            height: (@base + 5px);
        }
        ```
    - **SCSS** 示例：
        ```scss
        $base: 10px;
        .demo {
            width: $base * 2;
            height: $base + 5px;
            color: lighten(#c00, 20%);
        }
        ```
    - **SCSS** 内置更丰富的颜色、字符串、列表、数字等函数，功能更强大；Less 内置函数较少。

5. **循环与条件语句**

    - **Less**：支持基础的递归、条件判断（`when`）等，不是很直观。

        **示例（递归和条件）：**

        ```less
        .loop(@i) when (@i > 0) {
            .item-@{i} {
                width: (@i * 10px);
            }
            .loop(@i - 1);
        }
        .loop(3);
        ```

    - **SCSS**：支持 `@for`、`@each`、`@while` 等循环，`@if`、`@else` 条件判断，语法更接近编程语言，功能更完善。

        **示例：**

        ```scss
        @for $i from 1 through 3 {
            .item-#{$i} {
                width: 10px * $i;
            }
        }

        $theme: dark;
        .theme {
            @if $theme == dark {
                background: #222;
            } @else {
                background: #fff;
            }
        }
        ```

6. **继承和复用**

    - **Less**：通过 Mixin 和 `&` 实现部分继承复用。
        ```less
        .base-style {
            color: #333;
        }
        .child {
            .base-style;
            &-active {
                font-weight: bold;
            }
        }
        ```
    - **SCSS**：有 `@extend`，以及 `%placeholder` 类选择器方式，更灵活强大。
        ```scss
        %base-style {
            color: #333;
        }
        .child {
            @extend %base-style;
            &-active {
                font-weight: bold;
            }
        }
        ```

7. **兼容性与生态**

    - **Less**：较早流行，生态较小；
    - **SCSS**：生态更强大，社区标准，各大 UI 框架（如 Bootstrap 4/5、Antd 等）主推 SCSS/Sass，维护更活跃。

8. **编译工具链支持**
    - 两者都可用 webpack、gulp、独立 CLI 等编译，SCSS 支持 Dart Sass（官方推荐），Less 有 less.js。

**总结 Less 与 SCSS 的差异：**

1. SCSS 功能更丰富，支持更复杂的变量、嵌套、继承、条件、循环等高级用法，组件化和可维护性更强，生态活跃，主流 UI 框架多选用 SCSS。
2. Less 语法更简单、学习曲线平缓，适合小型或简单项目，工具链支持较全，但在灵活性和社区活跃度上不及 SCSS。
3. 建议：团队化开发、复杂大型项目优先选 SCSS；个人或小型项目可考虑 Less，上手快但可扩展性弱。
