# [协同程序(Coroutines)](https://doc.babylonjs.com/features/featuresDeepDive/events/coroutines)

## 介绍 Introduction

babylon 5.0 带来了一种编写超时运行逻辑的新方法：coroutines！

有使用 Unity 3D 和某些本地 API 经验的开发人员可能已经熟悉了 coroutine 的一些概念和用法。广义上讲，coroutine 只是一个可以暂停和恢复的函数。在 Babylon.js，我们通过 Observable 类提供了对 coroutine 的支持，允许将逻辑 "分散 "到多个时刻（最常见的是跨多个帧）。

## 多帧逻辑 Multi-frame Logic

假设你有一连串逻辑上连续的动作，但你并不想让它们都发生在同一帧。例如，假设要生成三个网格，但又不想在同一帧生成，以免造成帧间歇。那么从逻辑上讲，你想做的事情类似下面这样：

-   生成第一个网格 Spawn the first mesh.
-   等待下一帧 Wait until the next frame.
-   生成第二个网格 Spawn the second mesh.
-   等待下个帧 Wait until the next frame.
-   生成第三个网格 Spawn the third mesh.

如果没有 coroutines，你可以通过工作队列、菊花链式 promsie/回调等各种棘手的方法来实现这一目标。然而，有了例程，你几乎可以直接写出上面的逻辑来实现这一点。

```javascript
const spawnMeshesCoroutine = function*() {
    spawnTheFirstMesh();
    yield;
    spawnTheSecondMesh();
    yield;
    spawnTheThirdMesh();
};
scene.onBeforeRenderObservable.runCoroutineAsync(spawnMeshesCoroutine());
```

该 Coroutines 将使生成三个网格的逻辑分布在三个帧中。例如，如果在第 100 帧运行上述代码，那么将在第 100 帧调用 spawnTheFirstMesh，在第 101 帧调用 spawnTheSecondMesh，在第 102 帧调用 spawnTheThirdMesh。就这样，你就可以在多个帧上运行逻辑了！

## 它是如何工作的 How it works

Babylon.js 的 coroutines 将 JavaScript 生成器与 Observables 结合在一起，尽可能方便地将逻辑分散到多个框架中。从高层次来看，生成器函数（ES6 的一个特性，以 function\* 语法为特征）不像传统函数那样返回一个简单的返回值对象。相反，它们会返回一个中间对象，允许函数内部的代码分 "块 "运行，不同的块之间使用关键字 yield 进行分隔。然后，可以重复调用这个中间对象，每次调用时，生成器函数都会从上次 "暂停 "的地方 "继续 "运行，直到到达下一个 yield 或函数结束。

Observable.runCoroutineAsync 将这一可重复调用的中间对象作为参数。然后，运行例程的可观察对象将调用生成器--导致例程代码的另一个 "块 "运行--每当该可观察对象本身收到通知时。这样就可以很容易地编写逻辑，在观察对象监控的特定事件每次发生时 "前进"。

## 例程和异步 Coroutines and Asynchronism

例程是将逻辑分散到不同时间的一种简便方法，但与 Promises 等异步方法不同。Coroutines 是按帧（或者更准确地说，按 Observable 通知）轮询的，因此它们非常适用于密集发生的逻辑，例如在一系列后续帧中发生的逻辑序列。相比之下，"promise "则非常适用于发生频率较低的逻辑，如网络请求、文件 I/O、WebWorker 调用等。因此，Coroutine 和真正的异步具有不同但互补的优势，因此 Babylon.js 可以轻松地在真正的异步方法中使用 Coroutine，反之亦然。

顾名思义，Observable.runCoroutineAsync 返回一个 Promise<void>，该 Promise<void> 要么在 coroutine 结束时被解析，要么在 coroutine 取消时被拒绝。这使得 coroutine 可以像真正的异步函数一样被等待。例如，下面的代码将打印 "Start"（开始），等待一秒钟，在背对背的帧上打印 "A "和 "B"，然后再等待一秒钟，最后打印 "End"（结束）

```javascript
const coroutineFunc = function*() {
    console.log("A");
    yield;
    console.log("B");
};

const asynchronousFunc = async function() {
    console.log("Start");
    await BABYLON.Tools.DelayAsync(1000);
    await scene.onBeforeRenderObservable.runCoroutineAsync(coroutineFunc());
    await BABYLON.Tools.DelayAsync(1000);
    console.log("End");
};

asynchronousFunction();
```

同样，暂停一个 coroutine 直到一个真正的异步函数完成也很容易。这可以使用 yield 关键字来实现。具体细节不在本文讨论范围之内，但 yield 可以看作是一个中间返回命令，用于暂停生成器函数，而不是终止它。在 Babylon.js 正则表达式中，我们通常使用 yield 本身来 "返回 "空值，正则表达式系统会将其理解为暂停正则表达式的命令，并在下一次通知观察对象时恢复正则表达式。不过，我们也可以 yield 一个 Promise：

```javscript
yield BABYLON.Tools.DelayAsync(1000);
```

当我们 yield Promise 时，coroutine 系统会再次立即暂停该 coroutine，但直到 yield 的 Promise 得到解决后第一次通知 Observable 时才会恢复执行。因此，在 coroutine 中 yield Promise 与在真正的异步函数中等待 Promise 非常相似：它会暂停相关函数的执行，直到 Promise 得到解决。

```javascript
const asynchronousFunc = async function() {
    await BABYLON.Tools.DelayAsync(1000);
};

const coroutineFunc = function*() {
    console.log("A");
    yield;
    console.log("B");
    yield asynchronousFunc();
    console.log("C");
    yield;
    console.log("D");
};

scene.onBeforeRenderObservable.runCoroutineAsync(coroutineFunc());
```

该代码片段显示了一个产生 Promise 的 coroutine；它将在背对背的帧中打印 "A "和 "B"，然后等待一秒钟，接着在背对背的帧中打印 "C "和 "D"。

## 高级用法 Advanced Usage

上面的例子都是简单、线性、有限的逻辑序列，但例行程序并不局限于此。例程可以是无限的、分支的和任意复杂的。事实上，使用例程编写整个核心逻辑循环是完全可能的。

```javascript
const playGame = function*() {
    displayGameLogo();

    while (!enterKeyPressed() && !escapeKeyPressed()) {
        yield;
    }

    if (escapeKeyPressed()) {
        return;
    }

    yield loadTheSceneAsync();

    spawnTheFirstMesh();
    yield;
    spawnTheSecondMesh();
    yield;
    spawnTheThirdMesh();
    yield;

    while (!escapeKeyPressed()) {
        if (jumpButtonPressed()) {
            // 30 frame uninterruptable parametric jump animation
            const jump = function*() {
                for (let t = 0; t <= Math.PI; t += Math.PI / 30) {
                    playerCharacter.y = Math.sin(t);
                    yield;
                }
            };
            // Suspend game logic until jump animation is complete
            // (Nonsensical thing to do, just for demonstration purposes)
            yield scene.onBeforeRenderObservable.runCoroutineAsync(jump());
        }

        yield;
    }

    yield saveGameStateAsync();

    showGoodbyeMessage();
};
scene.onBeforeRenderObservable.runCoroutineAsync(playGame());
```
