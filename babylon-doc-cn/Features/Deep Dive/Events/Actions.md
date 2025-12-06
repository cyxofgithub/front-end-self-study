## [如何使用动作](https://doc.babylonjs.com/features/featuresDeepDive/events/actions)

动作是在场景中添加交互的简单方法。当触发器被触发时，就会启动一个操作。例如，您可以指定当用户单击（或触摸）网格时执行操作。

要使用动作，您必须将 BABYLON.ActionManager 附加到网格或场景：

```javascript
mesh.actionManager = new BABYLON.ActionManager(scene);
```

创建 ActionManager 后，您就可以开始注册操作：

```javascript
mesh.actionManager.registerAction(
    new BABYLON.InterpolateValueAction(
        BABYLON.ActionManager.OnPickTrigger,
        light,
        "diffuse",
        BABYLON.Color3.Black(),
        1000
    )
);
```

例如，当用户选择网格时，此操作将在 1000 毫秒内将 light.diffuse 属性设置为黑色。

您还可以连锁操作：

```javascript
mesh.actionManager
    .registerAction(
        new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPickTrigger,
            light,
            "diffuse",
            BABYLON.Color3.Black(),
            1000
        )
    )
    .then(
        new BABYLON.SetValueAction(
            BABYLON.ActionManager.NothingTrigger,
            mesh.material,
            "wireframe",
            false
        )
    );
```

在这种情况下，第一次单击将为 light.diffuse 属性设置动画，第二次单击将把 mesh.material 设置为 false。第三个将再次开始并将动画 light.diffuse 属性等等......

最后，您可以为您的操作添加条件。在这种情况下，如果条件为真，则在触发触发器时启动操作：

```javascript
mesh.actionManager.registerAction(
    new BABYLON.InterpolateValueAction(
        BABYLON.ActionManager.OnPickTrigger,
        camera,
        "alpha",
        0,
        500,
        new BABYLON.PredicateCondition(mesh.actionManager, function() {
            return light.diffuse.equals(BABYLON.Color3.Red());
        })
    )
);
```

在此示例中，仅当 light.diffuse 属性等于红色时，当用户单击网格时，camera.alpha 属性才会在 500 毫秒内动画为 0。

## 触发器 Triggers

目前，有 14 种不同的触发器可用于网格体，三种不同的触发器可用于场景。

可用于网格的触发器有：

-   BABYLON.ActionManager.NothingTrigger：从任何触发条件。用于带有 action.then 函数的子操作。
-   BABYLON.ActionManager.OnPickTrigger: 当用户触摸/单击网格时触发。
-   BABYLON.ActionManager.OnDoublePickTrigger: 当用户双击/点击网格时触发。
-   BABYLON.ActionManager.OnPickDownTrigger：当用户触摸/点击网格时触发
-   BABYLON.ActionManager.OnLeftPickTrigger: 当用户用左键触摸/单击网格时引发。
-   BABYLON.ActionManager.OnRightPickTrigger: 当用户用右键触摸/单击网格时引发。
-   BABYLON.ActionManager.OnCenterPickTrigger:当用户触摸/单击带有中心按钮的网格时引发。
-   BABYLON.ActionManager.OnLongPressTrigger：当用户长时间触摸/单击网格体（以毫秒为单位）时引发（由 BABYLON.Scene.LongPressDelay 定义）。
-   BABYLON.ActionManager.OnPointerOverTrigger: 当指针位于网格上方时引发。只升了一次。
-   BABYLON.ActionManager.OnPointerOutTrigger:当指针不再位于网格上时引发。只触发一次。
-   BABYLON.ActionManager.OnIntersectionEnterTrigger: 当网格与特定网格相交时引发。只触发一次。
-   BABYLON.ActionManager.OnIntersectionExitTrigger: 当网格不再与特定网格相交时触发。只触发一次。

请注意，两个相交触发器要求您指定特定的网格，可以像这样完成：

```javascript
mesh.actionManager.registerAction(
    new BABYLON.SetValueAction(
        {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: {
                mesh: otherMesh,
                usePreciseIntersection: true,
            },
        },
        mesh,
        "scaling",
        new BABYLON.Vector3(1.2, 1.2, 1.2)
    )
);
```

请注意可选的 usePreciseIntersection 属性。如果您不想使用精确的交集，您可以简单地将目标网格作为参数属性的值传递：

```javascript
mesh.actionManager.registerAction(
    new BABYLON.SetValueAction(
        {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: otherMesh,
        },
        mesh,
        "scaling",
        new BABYLON.Vector3(1.2, 1.2, 1.2)
    )
);
```

可用于场景的触发器有：

-   BABYLON.ActionManager.OnEveryFrameTrigger: 每一帧渲染的时候触发
-   BABYLON.ActionManager.OnKeyDownTrigger: 当按下某个键时触发
-   BABYLON.ActionManager.OnKeyUpTrigger: 当某个键松开时触发

```javascript
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,
            parameter: "r",
        },
        function() {
            console.log("r button was pressed");
        }
    )
);
```

对于更高级的用例，您可以将回调函数作为参数值传递：

```javascript
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,
            parameter: function(actionEvent) {
                return actionEvent.sourceEvent.key === "R";
            },
        },
        function() {
            console.log("R button was pressed");
        }
    )
);
```

## 可用的动作 Available Actions

大多数操作都有 propertyPath 属性。此字符串定义受操作影响的属性的路径。您可以使用直接值，例如位置或漫反射。但您也可以提供复杂的路径，例如 position.x

-   BABYLON.SwitchBooleanAction(trigger, target, propertyPath, condition): 切换布尔属性。
-   BABYLON.SetValueAction(trigger, target, propertyPath, value, condition): 设置属性的直接值。
-   BABYLON.IncrementValueActionBABYLON.IncrementValueAction(trigger, target, propertyPath, value, condition): 将数字添加到数字属性。
-   BABYLON.PlayAnimationAction(trigger, target, from, to, loop, condition): 在目标上播放动画。
-   BABYLON.StopAnimationAction(trigger, target, condition):停止目标正在播放的任何动画。
-   BABYLON.DoNothingAction(trigger, condition)：什么都不会做
-   BABYLON.CombineAction(trigger, children[], condition): 同时执行多个动作。 Children 属性必须是操作数组。
-   BABYLON.ExecuteCodeAction(trigger, func, condition): 执行代码。
-   BABYLON.SetParentAction(trigger, target, parent, condition): 设置目标的父级。
-   BABYLON.PlaySoundAction(trigger, sound, condition): 播放给定的声音。
-   BABYLON.StopSoundAction(trigger, sound, condition): 停止给定的声音。
-   BABYLON.InterpolateValueAction(trigger, target, propertyPath, value, duration, condition, stopOtherAnimations): 创建动画以将属性的当前值插入给定目标。支持以下类型：
    -   number
    -   BABYLON.Color3
    -   BABYLON.Vector3
    -   BABYLON.Quaternion

## 条件 Conditions

条件有以下三种：
BABYLON.ValueCondition(actionManager, target, propertyPath, value, operator): 当给定属性和值符合运算符时为 true。支持以下运算符：

-   BABYLON.ValueCondition.IsEqual
-   BABYLON.ValueCondition.IsDifferent
-   BABYLON.ValueCondition.IsGreater
-   BABYLON.ValueCondition.IsLesser

BABYLON.PredicateCondition(actionManager, predicate): 当给定谓词函数返回 true 时为 true。

BABYLON.StateCondition(actionManager, target, value): 当目标的状态属性与给定值匹配时为 true。

## 尝试使用动作

假设当用户触摸网格时，您希望几乎隐藏它。

首先，您需要将 BABYLON.ActionManager 添加到相关网格中：

```javascript
mesh.actionManager = new BABYLON.ActionManager(scene);
```

其次，您将注册与 BABYLON.ActionManager.OnPickTrigger 触发器关联的操作。此操作会将 mesh.visibility 属性插值到 0.2。

```javascript
mesh.actionManager.registerAction(
    new BABYLON.InterpolateValueAction(
        BABYLON.ActionManager.OnPickTrigger,
        mesh,
        "visibility",
        0.2,
        1000
    )
);
```

如果在淡出网格后，您希望它淡入，您可以通过链接一个操作来将 mesh.visibility
属性恢复为默认值：

```javascript
mesh.actionManager
    .registerAction(
        new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPickTrigger,
            mesh,
            "visibility",
            0.2,
            1000
        )
    )
    .then(
        new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPickTrigger,
            mesh,
            "visibility",
            1.0,
            1000
        )
    );
```

在这种情况下，第一次单击将隐藏按钮，接下来的单击将恢复它，依此类推......
