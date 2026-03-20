## 参考文章

https://juejin.cn/post/7147301855775719461#heading-2

## 写法

```javascript
type CustomPatrial<T> = {
    [P in keyof T]?: T[P];
};

type CustomPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type CustomExclude<T, U> = T extends U ? never : T;

type CustomOmit<T, K extends keyof T> = {
    [P in keyof T as P extends K ? never : P]: T[P];
};

type CustomOmit1<T, K extends keyof T> = Pick<T, CustomExclude<keyof T, K>>;

interface IPerson {
    name: string;
    age: number;
}

type TOmit = CustomOmit<IPerson, "age">;
type TOmit1 = CustomOmit1<IPerson, "age">;
type TPick = CustomPick<IPerson, "age">;
type TPatrial = CustomPatrial<IPerson>;
```
