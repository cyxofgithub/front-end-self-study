## 布局

虽然您可能希望您的游戏或应用程序占据大部分页面，但您可能需要一些空间来放置说明作为示例。只需将 <canvas> 元素放置在 <div> 中并根据需要排列元素即可

```html
<div id="holder">
    <canvas id="renderCanvas" touch-action="none"></canvas>
    <!-- touch-action="none" for best results from PEP -->
</div>
<div id="instructions">
    <br />
    <h2>Instructions</h2>
    <br />
    Instructions Instructions Instructions Instructions Instructions
    Instructions Instructions Instructions Instructions Instructions
</div>

<style>
    #holder {
        width: 80%;
        height: 100%;
        float: left;
    }

    #instructions {
        width: 20%;
        height: 100%;
        float: left;
        background-color: grey;
    }
</style>
```

![Alt text](image-14.png)
