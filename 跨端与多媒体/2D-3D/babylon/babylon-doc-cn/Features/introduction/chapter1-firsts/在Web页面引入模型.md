## 在 Web 页面引入模型

如果文件类型是 Babylon.js 识别的文件类型，那么您可以使用 Babylon.js 查看器通过 <babylon> 元素在网页上显示您的场景或模型。合适的文件类型示例包括 .babylon、.gltf 和 glb，建议使用 .glb。无论场景是使用 Babylon.js 构建的还是使用您最喜欢的设计软件创建的，都没有区别。 <babylon> 元素的大小将适合其容器。

```javascript
<script src="https://cdn.babylonjs.com/viewer/babylon.viewer.js"></script>
```

添加后，您可以将 <babylon> 元素放入适当的容器中，并将其模型属性指向文件源。

```javascript
<babylon model="Path to File"></babylon>
```
