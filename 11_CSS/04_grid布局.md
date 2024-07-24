## 效果

![示例](image.png)

## 代码

```css
.list-container {
    display: grid;
    grid-gap: 24px;
    grid-template-columns: repeat(auto-fill, minmax(276px, 1fr));
}
```

-   repeat(auto-fill, minmax(276px, 1fr))：这部分定义了列的规则。auto-fill 表示列的数量会根据容器的大小自动填充，以适应容器的宽度。minmax(276px, 1fr) 定义了列的大小范围。其中 276px 是列的最小宽度，1fr 表示列的最大宽度为剩余空间的一等分。
