## 粒子系统介绍

创建粒子系统需要一个名称和一个容量，即系统中同时存活粒子的最大数量。该系统的设计目的是产生以给定速率发射、移动并持续一定寿命的粒子，然后再循环并重新发射。

```javascript
const myParticleSystem = new BABYLON.ParticleSystem(
    "particles",
    capacity,
    scene
); //scene is optional and defaults to the current scene
```

### Texture 纹理

在看到系统中的粒子之前，需要为它们分配一个纹理。系统中的每个粒子都将使用相同的纹理。默认情况下，整个纹理都将映射到每个粒子上，不过也有一些高级技术可以让我们只使用粒子的部分纹理。这些技术可以在 ["粒子动画 ](https://doc.babylonjs.com/features/featuresDeepDive/particles/particle_system/animation)"部分找到，该部分详细介绍了如何将纹理用作精灵片材。

### Emitter 发射器

我们还需要告诉粒子系统一个粒子发射的位置。这就是所谓的发射器，它可以用网格、抽象网格，甚至是场景中一个简单的 Vector3 位置来表示。发射器本身只是发射的基本位置，如果是网格或抽象网格，我们将使用网格位置来确定粒子的发射位置。与发射器相连的是 ["发射器形状"](https://doc.babylonjs.com/features/featuresDeepDive/particles/particle_system/shape_emitters)，它决定了粒子可以发射的区域。我们可以使用 ["方框发射器形状"](https://doc.babylonjs.com/features/featuresDeepDive/particles/particle_system/shape_emitters#box-emitter)，并指定一个抽象网格作为粒子系统的发射器，这样就可以从位于抽象网格位置的方框内的随机点发射粒子。由于抽象网格可以作为巴比伦动画的目标，因此这是一种制作发射器动画的好方法。在每一帧动画中，发射器的位置都会更新，新的粒子将在位于抽象网格新位置的发射器形状内发射。

### Example 举例

以下代码示例展示了创建粒子系统所需的最少条件。

```javascript
myParticleSystem.particleTexture = new BABYLON.Texture("path to texture");

myParticleSystem.emitter = mesh; // a mesh or abstract mesh in the scene
// or
myParticleSystem.emitter = point; //a Vector3

myParticleSystem.start(); //Starts the emission of particles
```

要停止发射，请使用:

```javascript
myParticleSystem.stop();
```

虽然这可以阻止新粒子的发射，但已经发射的粒子仍将继续存在，直至其时间限制。要同时停止和清除粒子，请使用：

```javascript
myParticleSystem.stop();
myParticleSystem.reset(); //Reset to empty system
```

[最简粒子系统](https://playground.babylonjs.com/#0K3AQ2#3)

您可以使用 ParticleHelper 创建默认配置的粒子系统，只需一行即可完成所有操作。

[使用辅助器的默认粒子系统](https://playground.babylonjs.com/#0K3AQ2#4)

[从盒子位置发射粒子](https://playground.babylonjs.com/#0K3AQ2#5)

通过固定发射区域的大小，可以限制发射区域。使用的值取决于发射粒子的大小和区域的大小。发射粒子的中心可能位于方框内，例如靠近边缘，但粒子也可能足够大，以至于其周长在方框外。

[完全从盒子内部发射粒子](https://playground.babylonjs.com/#0K3AQ2#7)

例如，当您希望粒子系统在 3 秒后启动时，您可以使用以下方法之一:

```javascript
myParticleSystem.start(3000); //time in milliseconds

myParticleSystem.startDelay = 3000;
```

[延迟启动粒子系统](https://playground.babylonjs.com/#0K3AQ2#8)

要在有限时间内运行粒子系统，您可以使用

```javascript
myParticleSystem.targetStopDuration = 5;
```

系统停止前的目标持续时间取决于粒子系统更新粒子帧的速度。更新速度越快，系统停止前的时间就越短。设置粒子速度您可以使用：

```javascript
myParticleSystem.updateSpeed = 0.01;
```

一旦停止，就可以处置粒子系统。如果你想创建一个具有特定 targetStopDuration 的一次性粒子系统，这一点非常有用。

```javascript
myParticleSystem.disposeOnStop = true;
```

## Pre-Warning 预热

从 Babylon.js v3.3 开始，您现在可以指定预热期，以确保系统在渲染前处于正确状态。

为此，您需要设置两个属性：

-   system.preWarmCycles： 获取或设置一个值，表示在首次渲染前必须执行多少个循环（或帧）（该值必须在启动系统前设置）。默认值为 0（即不预热）
-   system.preWarmStepOffset： 获取或设置一个值，指示预热模式下使用的时间步长乘数（默认为 1）

因此，如果您这样设置系统：

```javascript
system.preWarmCycles = 100;
system.preWarmStepOffset = 5;
system.start();
```

它将执行粒子动画循环 100 次，时间步长设置为实时速度的 5 倍。你想要的循环次数越多，系统启动的速度就越慢。因此，增加时间步长以减少运行周期可能会很有趣。但请注意，如果粒子的寿命小于时间步长，过大的时间步长会带来问题。

[下面是一个预热的例子](https://playground.babylonjs.com/#MX2Z99#8)
