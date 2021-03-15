## 3.变量 let 和 常量 const

- var 的问题
  - 可以重复声明，没有报错和警告
  - 无法限制修改
  - 没有块级作用域， `{ }`
- let 和 const
  - 不能重复声明
  - 都是块级作用域, `{ }` 块内声明的，块外无效
  - let 是变量，可以修改
  - const 是常量，不能修改
- 块级作用域举例
  - 原来用 var 的方式，结果弹出的都是 3
  - 或者将变量 封装到函数里，限制作用域，但比较麻烦
  - 用 let 最简单，直接 var 改 let，解决作用域问题

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script>
        window.onload= function () {
            /*
            var aBtn = document.getElementsByTagName('input')
            for (var i=0; i < aBtn.length; i++) {
                aBtn[i].onclick = function () {
                    alert(i)
                }
            }*/
            var aBtn = document.getElementsByTagName('input')
            for (let i = 0; i < aBtn.length; i++) {
                aBtn[i].onclick = function () {
                    alert(i)
                }
            }
            /*
            var aBtn = document.getElementsByTagName('input')
            for (var i = 0; i < aBtn.length; i++) {
                // 封装到函数里，限制作用域
                (function (i) {
                    aBtn[i].onclick = function () {
                        alert(i)
                    }
                })(i)
            }*/
        }
    </script>
</head>
<body>
    <input type="button" value="按钮1">
    <input type="button" value="按钮2">
    <input type="button" value="按钮3">
</body>
</html>
```