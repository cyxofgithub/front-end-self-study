## [如何使用观察者](https://doc.babylonjs.com/features/featuresDeepDive/events/observables)

对于许多人来说，创建 Babylon.js 项目时只需要 GUI 和场景 Observables，特别是 scene.onPointerObservable。

## 介绍

Babylon.js 提供了很多事件（如 scene.beforeRender），在 v2.4 之前没有统一的方法来处理它们。从 v2.4 开始，我们引入了（当然不会破坏向后兼容性）一种新模式：Observables。

实现者使用 Observable 创建一个属性，该属性将触发所有注册的观察者。通用类型 T 用于将给定数据类型从可观察对象传递给观察者。

大多数用户只需将自己的观察者添加到 Babylon.js 提供的 Observables 中即可。但也可以创建您自己的 Observables（下面是一个简单的示例）。对于那些想要更深入研究的人，请参阅 [API](https://doc.babylonjs.com/typedoc/classes/BABYLON.Observable)

[example](https://playground.babylonjs.com/#6IGFM2):

```javascript
var createScene = function() {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.FreeCamera(
        "camera1",
        new BABYLON.Vector3(0, 5, -10),
        scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.7;

    var master = BABYLON.MeshBuilder.CreateSphere("master", {}, scene);

    master.onXChange = new BABYLON.Observable();

    setX = function(value) {
        if (value === master.position.x) {
            return value;
        }
        master.position.x = value;
        master.onXChange.notifyObservers(master.position.x);
    };

    var minion0 = BABYLON.MeshBuilder.CreateSphere(
        "minion0",
        { diameter: 0.5 },
        scene
    );
    minion0.startPosition = new BABYLON.Vector3(
        2.5 - 5 * Math.random(),
        2.5 - 5 * Math.random(),
        5 + 5 * Math.random()
    );
    minion0.position = minion0.startPosition;
    master.onXChange.add(function(value) {
        minion0.position.x = minion0.startPosition.x + value / 200;
    });

    var minion1 = BABYLON.MeshBuilder.CreateSphere(
        "minion1",
        { diameter: 0.5 },
        scene
    );
    minion1.startPosition = new BABYLON.Vector3(
        2.5 - 5 * Math.random(),
        2.5 - 5 * Math.random(),
        5 + 5 * Math.random()
    );
    minion1.position = minion1.startPosition;
    master.onXChange.add(function(value) {
        minion1.position.x = minion1.startPosition.x + value / 150;
    });

    var angle = 0;
    scene.registerBeforeRender(function() {
        setX(5 * Math.sin(angle));
        angle += 0.01;
    });
    return scene;
};
```

一个 Observable - onXChange- 被添加到主球体中。两个小球体以及它们必须采取的行动形成了两个观察者，当观察到主人的 x 位置发生变化时，这两个观察者会做出反应。

## 可观察的方法和属性

-   add()：添加一个观察者
-   addOnce()：添加一个观察者，该观察者将被执行一次，然后被删除
-   remove()：删除之前注册的观察者
-   removeCallback()：与上面相同，但提供回调而不是观察者实例
-   notifyObservers()：用于通知所有注册的 Observers
-   notifyObserversWithPromise()：调用此函数将执行每个回调，期望它是一个承诺或返回一个值。如果链中的任何一点有一个函数失败，则 Promise 将失败并且执行将不会继续。
-   hasObservers：如果至少注册了一个观察者，则返回 true 的属性
-   hasSpecificMask(mask)：如果至少有一个观察者使用此掩码注册，则返回 true 的函数
-   clear() 删除所有观察者
-   Clone() 只克隆对象，但不克隆注册的观察者。
    可以使用以下静态方法：
-   FromPromise()：从 Promise 创建 Observable。

许多 Babylon.js 对象都有一系列可用的 Observables。以下是来自文档搜索工具的[无序列表](https://doc.babylonjs.com/search?bjsq=observable)，其中包含 API 链接。

## 创建一个可观察对象（Creating An Observable）

要为 Babylon.js 提供的观察对象添加观察者，并不需要创建新的观察对象，但你可能希望创建自己的观察对象。特别是，观察对象对于将外部库连接到 Babylon.js 非常有用：

```javascript
import { io } from "socket.io-client";

const socket = io("/admin");

const onConnectObservable = new Observable();
const text1 = new BABYLON.GUI.TextBlock();

socket.on("connect", () => {
    onConnectObservable.notifyObservers();
});

onConnectObservable.add(() => {
    text1.text = "Connected";
});
```

还有一种实用方法 Observable.FromPromise，用于从 Promise 创建 Observable：

```javascript
const onStatusObservable = Observable.FromPromise(
    axios("/ping").then((response) => response.statusText)
);

onStatusObservable.add((statusText) => {
    text1.text = "Server status: " + statusText;
});
```

创建自己的 Observables 可以帮助减少不同组件之间的耦合。您可以创建多个独立的组件，然后只需使用一个父组件将它们连接起来，而不是创建一个相互依赖的组件层次结构。

## 添加观察员

观察者由一个被设置为观察可观察对象的对象和该对象对观察的反应组成。

在下面的示例中，球体及其比例变化通过 Observable.add() 方法创建了一个观察者。

设置在场景开始每帧渲染前通知其观察者的 Observable。

```javascript
const alpha = 0;
scene.onBeforeRenderObservable.add(function() {
    sphere.scaling.y = Math.cos(alpha);

    alpha += 0.01;
});
```

[Add an Observer demo](https://playground.babylonjs.com/#UP2O8#0)

## 添加和删除观察者

要移除观察者，需要在创建观察者时将其存储起来，以便使用移除来引用它:

```javascript
const alpha = 0;
const observer = scene.onBeforeRenderObservable.add(function() {
    sphere.scaling.y = Math.cos(alpha);

    alpha += 0.01;

    if (scene.onBeforeRenderObservable.hasObservers && alpha > 3) {
        scene.onBeforeRenderObservable.remove(observer);
    }
});
```

## 场景观测(Scene Observables)

TheBabylon.js 场景对象有 20 多个在不同条件下 "触发 "的观察项。每帧/渲染时都会检查其中的大多数观察项，并按照确定/可预测的顺序或序列进行检查。下面列出了在每个呈现循环中检查的场景观察项......检查顺序：

-   onBeforeAnimationsObservable
-   onAfterAnimationsObservable
-   onBeforePhysicsObservable
-   onAfterPhysicsObservable
-   onBeforeRenderObservable
-   onBeforeRenderTargetsRenderObservable
-   onAfterRenderTargetsRenderObservable
-   onBeforeCameraRenderObservable
-   onBeforeActiveMeshesEvaluationObservable
-   onAfterActiveMeshesEvaluationObservable
-   onBeforeParticlesRenderingObservable
-   onAfterParticlesRenderingObservable
-   onBeforeRenderTargetsRenderObservable
-   onAfterRenderTargetsRenderObservable
-   onBeforeDrawPhaseObservable
-   onAfterDrawPhaseObservable
-   onAfterCameraRenderObservable
-   onAfterRenderObservable

场景对象也有观察者：onReady、onDataLoaded、onDispose，但它们不在渲染/帧内发生。

此外，在使用确定性锁步时，onBeforeStepObservable 和 onAfterStepObservable 也可用。

不过，最有用的 Observable 可能是用于检查屏幕指针（无论是使用鼠标、手指还是控制器）发生了什么情况的那个。如需了解更多详情，请参阅 "交互指南"（Interactions HowTo）。

## 基于观测的倒计时功能（Observable-based countdown function）

从 4.2 版开始，新增了一种为函数设置延迟调用的方法。这种方法是使用观测值计算延迟时间。想想 setTimeout 函数，不过是在 Babylon 上下文中。最好的解释方式就是举例说明：

```javascript
// classic set timeout:
setTimeout(() => {
    // code running here is not guaranteed to be called inside the render loop
    // Actually, it is most likely that it will be called OUTSIDE the render loop
}, 3000);

// the new and simple way
BABYLON.setAndStartTimer({
    timeout: 3000,
    contextObservable: scene.onBeforeRenderObservable,
    onEnded: () => {
        // code running here is guaranteed to run inside the beforeRender loop
    },
});
```

### setAndStartTimer

正如您在示例中看到的，倒计时器的上下文是一个可观察对象。这个可观察对象是这段代码中最重要的部分--可观察对象是调用其余时间函数的上下文，负责计算直到完成的 delta 时间。简单解释一下，这些就是我们之前实现的函数的步骤：

1、 设置 time = 0，在 scene.onBeforeRenderObservable 中添加一个观察者
2、等待观察者被调用。
3、在观察器中--检查自开始后经过的时间是否大于超时时间
4、如果不是，转到 2
5、如果是，调用 onEnded，移除观察器
6、我们完成了

```javascript
BABYLON.setAndStartTimer({
    timeout: 3000,
    contextObservable: scene.onBeforeRenderObservable,
    breakCondition: () => {
        // this will check if we need to break before the timeout has reached
        return scene.isDisposed();
    },
    onEnded: (data) => {
        // this will run when the timeout has passed
    },
    onTick: (data) => {
        // this will run
    },
    onAborted: (data) => {
        // this function will run when the break condition has met (premature ending)
    },
});
```

正如你所理解的那样，这里可以使用任何 observable，但有些 observable 实际上并没有任何意义。例如，如果我们使用 pointer down observable，那么在下一次调用 observable 之前可能需要很长的时间，因此并不实用。但如果需要在接下来的 2 分钟内处理 pointer down 输入，就可以这样使用：

```javascript
let gameIsOn = true;
BABYLON.setAndStartTimer({
    timeout: 2 * 60 * 1000,
    contextObservable: scene.onPointerObservable,
    observableParameters: { mask: BABYLON.PointerEventTypes.POINTERDOWN },
    breakCondition: () => {
        // break if the game ended prior to this timeout
        return !gameIsOn;
    },
    onEnded: () { console.log('time is over'); },
    onTick: (data) => {
        // data.payload is the pointerInfo object from the onPointerObservable
        doSomethingWithTheData(data);
    }
});
```

一个更实际的例子是，让用户触摸某物 3 秒钟（同时显示 3 秒钟正在倒计时）：

```javascript
const guiButton = // created a GUI button
const guiButtonMaterial = ... // get the material
let pressed = false;
scene.onPointerDown = () => {
    pressed = true;
    BABYLON.setAndStartTimer({
        timeout: 2 * 60 * 1000,
        contextObservable: scene.onBeforeRenderObservable,
        breakCondition: () => {
            // break if no longer pressed
            return !pressed;
        },
        onEnded: () {
            console.log('Button pressed!');
            // back to a black button
            guiButtonMaterial.diffuseColor.set(0,0,0);
         },
        onTick: (data) => {
            // turn it slowly green on each call to the registered observer
            guiButtonMaterial.diffuseColor.set(0,data.completeRate,0);
        },
        onAborted: () => {
            // Aborted, back to a black button
            guiButtonMaterial.diffuseColor.set(0,0,0);
        }
    });
}

scene.onPointerUp = () => {
    pressed = false;
}
```

### [高级计时器(Advanced Timer)](https://doc.babylonjs.com/features/featuresDeepDive/events/observables#advanced-timer)

除了这个快速函数，你还可以使用 AdvancedTimer 类，它带来了更多的灵活性，但也更加繁琐。该对象本身是可重复使用的，因此最终可以省去一些不必要的调用和对象创建。使用 AdvancedTimer 的最后一个示例将如下所示：

```javascript
const guiButton = // created a GUI button
const guiButtonMaterial = ... // get the material
const advancedTimer : BABYLON.AdvancedTimer<Scene> = new BABYLON.AdvancedTimer({
    timeout: 3000,
    contextObservable: scene.onBeforeRenderObservable
});
advancedTimer.onEachCountObservable.add(() => {
    // turn it slowly green on each call to the registered observer
    guiButtonMaterial.diffuseColor.set(0,data.completeRate,0);
});
advancedTimer.onTimerAbortedObservable.add(() => {
    // Aborted, back to a black button
    guiButtonMaterial.diffuseColor.set(0,0,0);
});
advancedTimer.onTimerEndedObservable.add(() => {
    // back to a black button
    guiButtonMaterial.diffuseColor.set(0,0,0);
    console.log('Button pressed!');
});

scene.onPointerDown = () => {
    advancedTimer.start();
}

scene.onPointerUp = () => {
    advancedTimer.stop();
}
```

## [使用 RxJS](https://doc.babylonjs.com/features/featuresDeepDive/events/observables#usage-with-rxjs)

RxJS 是一个用于处理 Observables 的通用库，符合当前的 ECMAScript Observable 提议。它提供了多种操作符，允许高级执行模式。

下面的（TypeScript）代码可用于将 Babylon Observable 转换为 RxJS 的等价物：

````typescript
/**
 * Wraps a Babylon Observable into an rxjs Observable
 *
 * @param bjsObservable The Babylon Observable you want to observe
 * @example
 * ```
 * import { Engine, Scene, AbstractMesh } from '@babylonjs/core'
 *
 * const canvas = document.getElementById('canvas') as HTMLCanvasElement
 * const engine = new Engine(canvas)
 * const scene = new Scene(engine)
 *
 * const render$: Observable<Scene> = fromBabylonObservable(scene.onAfterRenderObservable)
 * const onMeshAdded$: Observable<AbstractMesh> = fromBabylonObservable(scene.onNewMeshAddedObservable)
 * ```
 */
export function fromBabylonObservable<T>(
    bjsObservable: BJSObservable<T>
): Observable<T> {
    return new Observable<T>((subscriber) => {
        if (!(bjsObservable instanceof BJSObservable)) {
            throw new TypeError(
                "the object passed in must be a Babylon Observable"
            );
        }

        const handler = bjsObservable.add((v) => subscriber.next(v));

        return () => bjsObservable.remove(handler);
    });
}
````
