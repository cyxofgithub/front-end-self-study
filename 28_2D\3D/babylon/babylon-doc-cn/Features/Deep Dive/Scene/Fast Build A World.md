## [如何快速搭建一个世界](https://doc.babylonjs.com/features/featuresDeepDive/scene/fastBuildWorld)

您将模型放入场景后，系统会自动添加摄像机、灯光和环境，并根据模型进行调整，以便您快速查看模型。然后，您可以根据需要进行调整。

对于 Babylon.js 的初学者来说，这两个部分 "最快构建和导入 "以及 "最快构建 "将很快为您提供一个可视化世界，是了解模型的好方法。因此，它们属于 1 级教材。为了让本页的其他信息和细节更易于理解，值得考虑学习 Babylon101 和部分 1 级资料。

## 助手 Helpers

下面列出了场景对象中有助于快速构建世界的方法，以及这些方法的 API 说明链接：

-   createDefaultCameraOrLight;
-   createDefaultCamera;
-   createDefaultLight;
-   createDefaultEnvironment;
-   createDefaultSkybox;

## 快速构建 Fastest Build

要快速创建一个世界，只需使用 createDefaultCameraOrLight 和 createDefaultEnvironment 即可，(如本示例所示：)[https://playground.babylonjs.com/#MJNICE]

```javascript
scene.createDefaultCameraOrLight(true, true, true);
scene.createDefaultEnvironment();
```

[通过添加第二个方框并重新定位，您可以看到摄像机是如何自动调整的](https://playground.babylonjs.com/#MJNICE#3)

## 创建默认摄像头和灯光 Create Default Camera or Ligh

从 "最快创建 "部分可以看到，辅助方法 createDefaultCameraOrLight 可以在一行中同时创建摄像机和灯光。它可以接受的三个参数与 createDefaultCamera 方法相同，第二个参数也指灯光，为真时将替换任何现有的摄像机或灯光。访问摄像机或灯光的方法与单个方法相同。

## 创建默认摄像头

createDefaultCamera 获取三个布尔参数，默认值均为 false。它们是：

-   createArcRotateCamera（创建弧形旋转摄像机）：默认情况下创建自由摄像机，为真时创建弧形旋转摄像机；
-   replace：为真时，创建的摄像机将替换现有的活动摄像机；
-   attachCameraControls：为真时将控件附加到画布。

[Camera Helper Example (no light)](https://playground.babylonjs.com/#MJNICE#4)

[Camera Helper Example](https://playground.babylonjs.com/#MJNICE#6)

实现自由相机：

```javascript
scene.createDefaultCamera(false, true, true);
```

[Camera Helper Example (Free Camera)](https://playground.babylonjs.com/#MJNICE#6)

摄像机会根据世界中每个网格的大小和位置进行调整:
[Camera Helper Adjusting](https://playground.babylonjs.com/#MJNICE#7)

### 访问摄像机

由于通过这种方式创建摄像机会使辅助创建的摄像机成为活动摄像机，因此访问摄像机的最简单方法是使用:

```javascript
scene.createDefaultCamera(true, true, true);

var helperCamera = scene.activeCamera;
```

另一种方法是在创建摄像机后立即访问辅助创建的摄像机，因为它将是 scene.cameras 数组中的最后一个，所以可以使用：

```javascript
scene.createDefaultCamera(true, true, true);

var helperCamera = scene.cameras[scene.cameras.length - 1];

//OR

var helperCamera = scene.cameras.pop();
scene.cameras.push(helperCamera);
```

## 创建默认灯光

createDefaultLight 只需要一个布尔参数，默认设置为 false：

-   replace：为 true 时，创建的灯光将替换所有现有灯光；为 false 且没有现有灯光时，将创建一个半球形灯光；为 false 且已有灯光时，不会对场景进行任何更改。

```javascript
scene.createDefaultLight();
```

### 访问灯光 Accessing the Light

如果您在创建灯光后立即访问辅助创建的灯光，它将是 scene.lights 数组中的最后一个。

您可以通过以下方式获取：

```javascript
scene.createDefaultLight();

var helperLight = scene.lights[scene.lights.length - 1];

//OR

var helperLight = scene.lights.pop();
scene.lights.push(helperLight);
```

## 创建默认环境

```javascript
scene.createDefaultEnvironment();
```

将天空盒和地面添加到场景中，设置一系列环境参数，并将环境辅助器返回到场景

[下面还有一个创建天空盒子的辅助工具](https://playground.babylonjs.com/#MJNICE#10)

### 可选参数

如上图所示，createDefaultEnvironment 方法需要一个选项参数。环境辅助选项的全部属性都可从 [API](https://doc.babylonjs.com/typedoc/interfaces/BABYLON.IEnvironmentHelperOptions) 文档获取

阻止天空盒的创建：

```javascript
var helper = scene.createDefaultEnvironment({
    createSkybox: false,
});
```

实现地面反射：

```javascript
var helper = scene.createDefaultEnvironment({
    enableGroundMirror: true,
});
```

当看到 Z 与地面打架时，将地面 Y 偏置修改为更大的数值：

```javascript
var helper = scene.createDefaultEnvironment({
    groundYBias: 0.01,
});
```

### 适用方法(Applicable Methods)

由于 createDefaultEnvironment 方法会返回一个 environmentalHelper 对象，因此该对象的所有属性和方法（与 API 中的一样）都是可用的。

因此，举例来说，如果环境颜色不是您最喜欢的选择，您可以在创建后进行修改:

```javascript
var helper = scene.createDefaultEnvironment();
helper.setMainColor(BABYLON.Color3.Teal());
```

例如，如果您希望在创建环境后处理地面，请使用

```javascript
var helper = scene.createDefaultEnvironment();
helper.ground.dispose();
```

或者更改选项参数

```javascript
var helper = scene.createDefaultEnvironment();
var options = {
    skyboxTexture: new BABYLON.CubeTexture("/textures/skybox", scene),
};
helper.updateOptions(options);
```

## 创建默认的天空盒 Create Default Skybox

如果不想创建完整的环境，可以使用 createDefaultSkybox 方法。使用的参数决定了天空盒的创建方式。[例如：](https://playground.babylonjs.com/#MJNICE#14)

```javascript
var texture = new BABYLON.CubeTexture(
    "/assets/textures/SpecularHDR.dds",
    scene
);
scene.createDefaultSkybox(texture, true, 100);
```

在本例中，前两个参数给出了天空盒的纹理，并指定使用 PBRMaterial（第二个参数，true），而不是标准材质（第二个参数，false--默认值）。

第三个参数定义天空盒的比例（该值取决于场景的比例），默认值为 1000。

## 引入和快速构建

要导入模型并快速构建世界，只需使用 createDefaultCameraOrLight 和 createDefaultEnvironment 即可，[如本示例所示:](https://playground.babylonjs.com/#MJNICE#15)

摄像机会根据模型的比例和位置自动调整位置，使世界变得可视。有关使用场景助手导入模型的更多信息，请参阅下文。

## 在你的世界中引入模型

由于 createDefault... 等工具方法会考虑到场景中的任何模型，因此只能在加载模型后才能应用，所以要放在回调函数中。例如：

```javascript
BABYLON.SceneLoader.Append(
    "https://www.babylonjs.com/assets/DamagedHelmet/glTF/",
    "DamagedHelmet.gltf",
    scene,
    function(meshes) {
        scene.createDefaultCameraOrLight(true, true, true);
        scene.createDefaultEnvironment();
    }
);
```

这就出现了一个问题。创建场景时，Babylon.js 会检查是否有摄像头。导入模型时，会在模型加载完成之前检查是否存在摄像头，因此场景会失败。

解决办法是用 delayCreateScene 函数替换 createScene 函数。无论是在游乐场还是在你自己的项目中，这都是一个直接的替换。

注意：还可使用其他场景加载器方法。

### 将场景帮助程序与导入一起使用 Using Scene Helpers with Import

本页前面介绍的所有辅助方法在导入模型时的行为方式完全相同。只需记住在场景加载器回调中调用它们即可。
