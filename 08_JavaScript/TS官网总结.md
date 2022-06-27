# 基础类型

## Null 和 Undefined

![image-20220502102309129](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220502102309129.png)

## Never

![image-20220502102439215](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220502102439215.png)

## 类型断言

![image-20220502102836785](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220502102836785.png)

# 泛型

## 定义

![image-20220502114303123](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220502114303123.png)

如果知道传入和返回的确切类型也可以不使用泛型，例如

![image-20220502114358377](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220502114358377.png)

对比使用 any

![image-20220502114415244](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220502114415244.png)

看起来好像是传 number 返回 number，实际传 number 也可以返回 string，因为 any 类型实际就是不进行类型检查的意思

## 使用

![image-20220502114643333](TS官网总结.assets/image-20220502114643333.png)

## 定义T类型数组

![image-20220502114817099](TS官网总结.assets/image-20220502114817099.png)

