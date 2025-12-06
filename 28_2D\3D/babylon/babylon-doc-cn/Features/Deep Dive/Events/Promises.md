## [介绍 Introduction](https://doc.babylonjs.com/features/featuresDeepDive/events/promises)

简而言之，其基本思想就是依赖 prmoise，而不是以一种不易于维护的方式处理金字塔式的回调。关于可移植性，Babylon.js 为不支持承诺的浏览器提供了自定义的 ployfill，因此您可以盲目使用它们。

## 举例 Examples

### 基础使用

```javascript
BABYLON.SceneLoader.LoadAssetContainerAsync(
    "https://playground.babylonjs.com/scenes/",
    "skull.babylon",
    scene
).then(function(container) {
    container.addAllToScene();
});
```

### 链式调用

```javascript
const scene = new BABYLON.Scene(engine);
const xrPromise = scene.createDefaultXRExperienceAsync();
xrPromise
    .then((xrExperience) => {
        return BABYLON.SceneLoader.AppendAsync(
            "https://playground.babylonjs.com/scenes/",
            "skull.babylon",
            scene
        );
    })
    .then(function() {
        // xr resolved, skull added to the scene
    });
```

### 结合 async 和 await

```javascript
const main = async function() {
    const scene = new BABYLON.Scene(engine);
    const helper = scene.createDefaultVRExperience();
    const supported = await helper.webVRCamera.useStandingMatrixAsync();
    console.log(supported);
    await BABYLON.SceneLoader.AppendAsync(
        "https://playground.babylonjs.com/scenes/",
        "skull.babylon",
        scene
    );
};
```

## 并行加载两个资源

```javascript
const scene = new BABYLON.Scene(engine);

const baseUrl =
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/";

Promise.all([
    BABYLON.SceneLoader.ImportMeshAsync(
        null,
        baseUrl + "BoomBox/glTF/",
        "BoomBox.gltf",
        scene
    ).then(function(result) {
        result.meshes[0].position.x = 0.01;
    }),
    BABYLON.SceneLoader.ImportMeshAsync(
        null,
        baseUrl + "Avocado/glTF/",
        "Avocado.gltf",
        scene
    ).then(function(result) {
        result.meshes[0].position.x = -0.01;
        result.meshes[0].position.y = -0.01;
        result.meshes[0].scaling.scaleInPlace(0.25);
    }),
]).then(() => {
    scene.createDefaultCameraOrLight(true, true, true);
    scene.activeCamera.alpha += Math.PI;
});
```
