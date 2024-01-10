## KMP 算法思路

1、假设有 str1 = aabaacf，str2 = aabaaf，判断 str2 是否在 str1 中
2、如果用暴力解就是 str1 从第一个字符开始去匹配 str2，直到匹配上，时间复杂度是 o(M \* N)
3、有这么一种情况当 c 和 f 比较时没匹配上，aa 是不用再匹配的了，因为已经判断过 aa 的存在了，就让 str1 指向 c，str2 指向 b 再去进行一轮匹配就可以了，这种优化就是 kmp 算法做的事情

## KMP 算法解决的问题

![Alt text](image.png)

**\*示例解法：**

主题逻辑：
![Alt text](image-1.png)

next 数组求法：
![Alt text](image-2.png)

next 数组说明：

```javascript
// str1 = 'abcabcd';
// next: [0,0,0,0,1,2,3]
// next[i] 代表 0 到 i-1 位置的最长相同前后缀
// 如 next[3] 代表 abc 的最长相同前后缀为 0
// 如 next[6] 代表 abcabc 的最长相同前后缀为 abc 和 abc 为 3
```

## 时间复杂度的推理

## KMP 算法的全部细节和实现讲解
