### ProseMirror 常考面试题与核心要点

#### 一、核心概念与数据结构

1. **ProseMirror 的核心数据结构有哪些？它们如何协同工作？**

    - **Node**：文档的树形结构节点（如段落、标题、图片），包含类型、属性、子节点等。
    - **Mark**：节点内的样式标记（如加粗、斜体），不改变文档结构，仅修饰文本。
    - **Schema**：定义文档的规则约束（允许哪些节点/标记、节点的父子关系、属性结构）。
    - **Transaction**：描述对文档的修改操作（如插入、删除、样式变更），是状态更新的载体。
    - **State**：包含文档（doc）、选区（selection）、插件状态等完整编辑器状态。
    - **协同流程**：Schema 定义规则 → Node/Mark 组成文档 → Transaction 描述修改 → 生成新 State → View 渲染更新。

2. **Node 和 Mark 的区别是什么？分别适用于什么场景？**

    - **Node**：是文档的“结构单元”，有独立的 DOM 节点（如 `<p>`、`<h1>`、`<img>`），可包含子节点，用于构建文档骨架。
    - **Mark**：是“样式修饰”，依附于文本节点（如 `<strong>`、`<em>`），不改变文档层级，用于文本样式、链接等。

3. **Schema 的作用是什么？如何定义一个 Schema？**
    - **作用**：约束文档结构的合法性（如“标题下不能直接放图片”“列表项必须在列表内”），避免非法文档状态，同时为节点/标记提供元数据（如如何解析 HTML、如何渲染 DOM）。
    - **定义方式**：通过 `nodes` 和 `marks` 配置对象，指定每个节点/标记的 `name`、`schema`（属性定义）、`toDOM`（渲染逻辑）、`parseDOM`（解析逻辑）等。

#### 二、架构与工作原理

4. **Transaction 的工作原理是什么？如何应用到 State 上？**

    - Transaction 是一个“变更描述”，包含一系列步骤（Step，如 `ReplaceStep`、`AddMarkStep`），每个步骤描述一个原子操作。
    - 通过 `state.apply(tr)` 将 Transaction 应用到旧 State，生成新 State（不可变更新，旧 State 保持不变）。
    - Transaction 还可携带元数据（如“是否合并到历史记录”“是否由插件触发”），用于插件间通信。

5. **View 层的作用是什么？如何将 State 映射到 DOM？**

    - **作用**：负责将 State 渲染为可交互的 DOM，处理用户输入（键盘、鼠标、粘贴等），并将用户操作转换为 Transaction。
    - **DOM 映射**：通过节点/标记的 `toDOM` 方法定义如何从 ProseMirror Node 生成 DOM；通过 `parseDOM` 定义如何从 HTML 解析回 ProseMirror Node。
    - **交互处理**：View 监听 DOM 事件（如 `keydown`、`input`），将其转换为 ProseMirror 的“命令（Command）”或 Transaction，更新 State 后重新渲染。

6. **ProseMirror 的插件系统如何工作？如何编写一个插件？**
    - 插件是扩展编辑器功能的核心方式，可介入状态更新、DOM 渲染、事件处理等流程。
    - **插件组成**：
        - `state`：定义插件自身的状态（如“当前是否显示菜单”），以及如何随 Transaction 更新。
        - `props`：覆盖 View 的默认行为（如 `handleKeyDown` 处理快捷键、`decorations` 渲染装饰性 DOM）。
        - `filterTransaction`/`appendTransaction`：拦截或修改 Transaction。
    - **示例**：编写一个“保存快捷键”插件，通过 `props.handleKeyDown` 监听 `Ctrl/Cmd+S`，触发保存逻辑。

#### 三、实际开发与常见问题

7. **如何实现一个自定义节点（如图片、待办事项）？**

    - **步骤**：
        1. 在 Schema 的 `nodes` 中定义节点类型（指定 `group`、`content`、`attrs` 等）。
        2. 实现 `toDOM`（如何渲染为 DOM，如 `<img src="...">`）和 `parseDOM`（如何从 HTML 解析回节点）。
        3. （可选）编写 `NodeView`，用于复杂交互（如图片上传、待办事项的勾选框交互），可完全控制 DOM 的创建、更新和销毁。
    - **关键**：确保节点定义符合 Schema 约束，避免非法文档结构。

8. **如何处理粘贴内容？如何过滤或转换粘贴的 HTML？**

    - ProseMirror 默认通过 `parseDOM` 将粘贴的 HTML 解析为文档，但可通过以下方式定制：
        1. 在 Schema 的 `parseDOM` 中定义更严格的解析规则（如只允许特定标签）。
        2. 使用 `transformPasted` 钩子（在插件或 View props 中），对解析后的文档进行二次处理（如删除非法节点、转换格式）。
        3. 监听 `paste` 事件，完全自定义粘贴逻辑（如粘贴图片时上传到服务器，再插入图片节点）。

9. **如何实现撤销/重做？ProseMirror 内部如何管理历史记录？**
    - ProseMirror 提供 `history` 插件，默认管理撤销/重做栈。
    - **原理**：
        - 每个 Transaction 可标记为“可撤销”（默认），会被添加到撤销栈。
        - 撤销时，将该 Transaction 的逆操作应用到 State，并将原 Transaction 移到重做栈。
        - 可通过 `tr.setMeta("addToHistory", false)` 让某个 Transaction 不进入历史记录（如插件内部的状态更新）。

#### 四、进阶与深度问题

10. **协同编辑的实现原理是什么？如何处理冲突？**

    -   ProseMirror 提供 `prosemirror-collab` 模块，基于**操作转换（OT）**思想实现协同。
    -   **核心流程**：
        1. 每个客户端维护本地 State，同时记录“已确认的版本号”。
        2. 本地修改生成 Transaction 后，先应用到本地 State，再将“步骤（Step）+ 版本号”发送给服务器。
        3. 服务器接收步骤后，基于当前版本号对步骤进行“转换”（解决并发冲突），然后广播给所有客户端。
        4. 客户端接收远程步骤后，先转换为适配本地 State 的步骤，再应用到本地。
    -   **冲突处理**：通过步骤的“位置映射”（Position Mapping）调整操作位置，确保并发修改后的文档一致性。

11. **大文档下的性能优化策略有哪些？**

    -   **文档分片**：仅渲染可视区域的节点（虚拟滚动），可通过 `NodeView` 或第三方库（如 `prosemirror-virtual-scroll`）实现。
    -   **Transaction 批量处理**：将频繁的小操作（如连续输入）合并为一个 Transaction，减少状态更新次数。
    -   **装饰器优化**：避免使用大量全局 `Decorations`，仅在必要时渲染（如仅在当前选区显示高亮）。
    -   **Schema 简化**：避免过于复杂的 Schema 规则，减少文档验证的开销。

12. **如何调试 ProseMirror？有哪些常用技巧？**
    -   **查看文档状态**：`console.log(state.doc.toJSON())` 打印文档的 JSON 结构，`console.log(state.selection)` 查看选区信息。
    -   **断点调试**：在 `applyTransaction`、插件的 `state.apply` 或 `props.handleKeyDown` 中打断点，追踪状态更新流程。
    -   **使用调试工具**：
        -   `prosemirror-log` 插件：记录所有 Transaction，便于回溯。
        -   `prosemirror-inspect`：可视化展示文档树和选区。
    -   **Schema 严格模式**：启用 Schema 的严格验证（`new Schema({ nodes, marks, strict: true })`），及时发现非法文档状态。

#### 五、生态与扩展

13. **Tiptap 与 ProseMirror 的关系是什么？为什么选择 Tiptap？**
    -   **关系**：Tiptap 是基于 ProseMirror 的封装库，提供更简洁的 API、预设的节点/标记（如标题、列表、代码块）、以及 Vue/React 等框架的集成。
    -   **Tiptap 优势**：
        -   降低上手门槛，无需从零定义 Schema 和基础功能。
        -   提供丰富的官方扩展（如协作编辑、表格、语法高亮）。
        -   更好的框架集成（如 React 的 `useEditor` Hook）。
    -   **适用场景**：快速开发富文本编辑器，且需求与 Tiptap 的预设功能匹配；若需高度定制化（如复杂的文档结构、深度性能优化），直接使用 ProseMirror 更灵活。
