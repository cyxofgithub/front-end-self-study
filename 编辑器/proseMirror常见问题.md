### ProseMirror 常考面试题与核心要点

#### 一、核心概念与数据结构

1. **ProseMirror 的核心数据结构有哪些？它们如何协同工作？**

    **结论**：Schema → Node/Mark → Transaction → State → View 形成单向数据流。

    ```mermaid
    flowchart LR
        Schema["Schema<br/>规则定义"] --> NodeMark["Node + Mark<br/>文档结构"]
        NodeMark --> Transaction["Transaction<br/>变更描述"]
        Transaction --> State["State<br/>完整状态"]
        State --> View["View<br/>DOM渲染"]
        View --> NodeMark
    ```

    - **Node**：树形结构节点（段落、标题、图片），含类型、属性、子节点
    - **Mark**：样式标记（加粗、斜体），依附文本，不改结构
    - **Schema**：规则约束，定义允许的节点/标记及父子关系
    - **Transaction**：变更描述，含多个 Step（原子操作），是状态更新载体
    - **State**：包含 doc、selection、plugins 的完整编辑器状态

2. **Node 和 Mark 的区别是什么？分别适用于什么场景？**

    **结论**：Node 是结构单元，Mark 是样式修饰。

    ```mermaid
    flowchart TD
        subgraph Node示例["Node 示例"]
            P["<p>段落文本</p>"]
            H1["<h1>标题</h1>"]
            IMG["<img src='...'/>"]
        end
        subgraph Mark示例["Mark 示例"]
            Strong["<strong>加粗</strong>"]
            Em["<em>斜体</em>"]
            Link["<a href='...'>链接</a>"]
        end
    ```

    | 特性         | Node                  | Mark                      |
    | ------------ | --------------------- | ------------------------- |
    | 作用         | 构建文档骨架          | 修饰文本样式              |
    | DOM          | 独立节点              | 依附文本节点              |
    | 可包含子节点 | ✅                    | ❌                        |
    | 示例         | `<p>`、`<h1>`、`<ul>` | `<strong>`、`<em>`、`<a>` |

3. **Schema 的作用是什么？如何定义一个 Schema？**

    **结论**：Schema 是文档的"类型系统"，约束合法结构并定义渲染/解析规则。

    ```javascript
    const mySchema = new Schema({
        nodes: {
            doc: { content: 'block+' },
            paragraph: { group: 'block', content: 'inline*' },
            heading: {
                group: 'block',
                attrs: { level: { default: 1 } },
                parseDOM: [{ tag: 'h1' }],
                toDOM(node) {
                    return ['h' + node.attrs.level, 0];
                },
            },
            text: { group: 'inline' },
        },
        marks: {
            strong: {
                parseDOM: [{ tag: 'strong' }],
                toDOM() {
                    return ['strong', 0];
                },
            },
            link: {
                attrs: { href: {} },
                parseDOM: [
                    {
                        tag: 'a',
                        getAttrs(dom) {
                            return { href: dom.href };
                        },
                    },
                ],
                toDOM(mark) {
                    return ['a', { href: mark.attrs.href }, 0];
                },
            },
        },
    });
    ```

    - **content**：允许的子节点（如 `'block+'` 表示至少一个 block）
    - **group**：节点分类（如 `'block'`、`'inline'`）
    - **attrs**：属性定义（如 heading 的 level）
    - **toDOM/parseDOM**：渲染与解析 HTML 的映射函数

#### 二、架构与工作原理

4. **Transaction 的工作原理是什么？如何应用到 State 上？**

    **结论**：Transaction 描述变更，apply 后生成新 State（旧 State 不变）。

    ```mermaid
    sequenceDiagram
        participant OldState as state (旧)
        participant Tr as Transaction
        participant NewState as state (新)
        OldState->>Tr: apply(tr)
        Tr->>Tr: 执行 Step 序列
        Tr->>NewState: 返回新 State
        Note over OldState,NewState: 不可变更新
    ```

    ```javascript
    // 创建 Transaction
    const tr = state.tr;
    tr.insertText('Hello', state.selection.from);
    // 或删除内容
    tr.delete(0, 5);
    // 或添加 Mark
    tr.addMark(0, 10, state.schema.marks.strong.create());

    // 应用到 State（生成新 State）
    const newState = state.apply(tr);
    // 旧 state 保持不变，可用于撤销
    ```

    - **Step**：原子操作单元（`ReplaceStep`、`AddMarkStep` 等）
    - **Meta**：携带元数据（如 `{ addToHistory: false }` 控制是否记录）

5. **View 层的作用是什么？如何将 State 映射到 DOM？**

    **结论**：View 负责渲染 State 到 DOM，并拦截用户输入转为 Transaction。

    ```mermaid
    flowchart TD
        DOM["用户 DOM<br/>输入事件"] --> View
        View --> Tr["Transaction"]
        Tr --> State["State"]
        State --> View
        View --> Render["重新渲染"]
    ```

    ```javascript
    const view = new EditorView(document.querySelector('#editor'), {
        state: initialState,
        dispatchTransaction(tr) {
            const newState = this.state.apply(tr);
            this.updateState(newState);
        },
    });
    ```

    - **toDOM(node)**：Node → DOM 映射
    - **parseDOM**：HTML → Node 映射
    - **dispatchTransaction**：将用户操作转为 Transaction 并更新 State

6. **ProseMirror 的插件系统如何工作？如何编写一个插件？**

    **结论**：插件通过 state/props/filterTransaction 介入编辑器的各个流程。

    ```mermaid
    flowchart TD
        Plugin["Plugin"]
        subgraph 组成["插件组成"]
            S["state<br/>插件状态"]
            P["props<br/>覆盖 View 行为"]
            F["filterTransaction<br/>拦截 Transaction"]
        end
        Plugin --> S
        Plugin --> P
        Plugin --> F
    ```

    ```javascript
    // 保存快捷键插件示例
    const savePlugin = new Plugin({
        key: new PluginKey('save'),
        props: {
            handleKeyDown(view, event) {
                if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                    event.preventDefault();
                    saveDocument(view.state);
                    return true;
                }
                return false;
            },
        },
    });
    ```

    - **state**：插件自有状态，随 Transaction 更新
    - **props**：覆盖 View 行为（`handleKeyDown`、`decorations` 等）
    - **filterTransaction**：拦截 Transaction，返回 false 可阻止该 Transaction 生效
    - **appendTransaction**：在 Transaction 应用后追加新的 Transaction（适合自动补全、格式修正等）

    ```javascript
    // filterTransaction：限制文档最大长度，超过 10000 字符的修改直接拦截
    const maxLengthPlugin = new Plugin({
        filterTransaction(tr, state) {
            const maxLen = 10000;
            if (tr.docChanged && tr.doc.textContent.length > maxLen) {
                return false; // 阻止该 Transaction
            }
            return true;
        },
    });
    ```

    ```javascript
    // appendTransaction：自动将空标题降级为段落
    const autoFixPlugin = new Plugin({
        appendTransaction(transactions, oldState, newState) {
            const hasDocChanged = transactions.some((tr) => tr.docChanged);
            if (!hasDocChanged) return null;

            const tr = newState.tr;
            let modified = false;

            newState.doc.descendants((node, pos) => {
                // 空标题自动转为段落
                if (
                    node.type.name === 'heading' &&
                    node.textContent.length === 0
                ) {
                    tr.setNodeMarkup(pos, newState.schema.nodes.paragraph);
                    modified = true;
                }
            });

            return modified ? tr : null;
        },
    });
    ```

    ```mermaid
    flowchart LR
        Tr["Transaction"] --> Filter["filterTransaction<br/>返回 false 拦截"]
        Filter -->|通过| Apply["apply 到 State"]
        Apply --> Append["appendTransaction<br/>追加新 Transaction"]
        Append --> Final["最终 State"]
    ```

#### 三、实际开发与常见问题

7. **如何实现一个自定义节点（如图片、待办事项）？**

    **结论**：定义 Schema 节点 + 实现 toDOM/parseDOM +（可选）NodeView 控制交互。

    ```javascript
    // 1. Schema 定义
    const imageNode = {
        inline: false,
        attrs: { src: {}, alt: { default: null } },
        group: 'block',
        toDOM(node) {
            return ['img', { src: node.attrs.src, alt: node.attrs.alt || '' }];
        },
        parseDOM: [
            {
                tag: 'img',
                getAttrs(dom) {
                    return { src: dom.src, alt: dom.alt };
                },
            },
        ],
    };

    // 2. 带交互的 NodeView（可选）
    class ImageNodeView extends NodeView {
        constructor(node, view, getPos) {
            super();
            this.img = document.createElement('img');
            this.img.src = node.attrs.src;
            this.img.addEventListener('dblclick', () =>
                openImageUploader(this)
            );
            this.dom = this.img;
        }
    }
    ```

8. **如何处理粘贴内容？如何过滤或转换粘贴的 HTML？**

    **结论**：通过 parseDOM 解析 + transformPasted 钩子二次处理。

    ```javascript
    // 方式 1：严格 parseDOM 规则
    parseDOM: [
        {
            tag: 'img',
            getAttrs(dom) {
                if (!dom.src.includes('allowed-domain.com')) return false;
                return { src: dom.src };
            },
        },
    ];

    // 方式 2：transformPasted 钩子
    const pasteFilterPlugin = new Plugin({
        props: {
            transformPasted(step) {
                return step;
            },
        },
    });

    // 方式 3：监听 paste 事件（图片上传场景）
    const view = new EditorView(editor, {
        handlePaste(view, event) {
            const items = event.clipboard.items;
            for (const item of items) {
                if (item.type === 'image/png') {
                    uploadAndInsertImage(item.getAsFile());
                    return true;
                }
            }
            return false;
        },
    });
    ```

9. **如何实现撤销/重做？ProseMirror 内部如何管理历史记录？**

    **结论**：history 插件维护撤销/重做栈，通过逆操作实现撤销。

    ```mermaid
    flowchart LR
        A[操作 1] --> B[撤销栈]
        B --> C[撤销时执行逆操作]
        C --> D[移到重做栈]
    ```

    ```javascript
    // 默认 history 插件已启用
    // 某些操作不记录历史（如自动保存）
    const tr = state.tr;
    tr.setMeta('addToHistory', false);
    dispatch(tr);

    // 手动触发撤销/重做
    undoCommand(state, dispatch);
    redoCommand(state, dispatch);
    ```

#### 四、进阶与深度问题

10. **协同编辑的实现原理是什么？如何处理冲突？**

    **结论**：基于 OT（操作转换），通过版本号和步骤转换实现多客户端同步。

    ```mermaid
    sequenceDiagram
        participant C1 as 客户端 A
        participant S as 服务器
        participant C2 as 客户端 B
        C1->>S: 发送 Step + 版本号 7
        S->>S: 转换步骤解决冲突
        S->>C2: 广播转换后的 Step
        C2->>C2: apply 远程 Step
        Note over C1,C2: 版本号对齐后同步
    ```

    -   **版本号**：文档的乐观锁机制
    -   **Step**：原子操作，可合并和转换
    -   **Position Mapping**：调整并发操作的位置

11. **大文档下的性能优化策略有哪些？**

    **结论**：虚拟滚动 + 批量 Transaction + 精简 Decorations + 简化 Schema。

    | 策略        | 实现方式                       | 效果           |
    | ----------- | ------------------------------ | -------------- |
    | 文档分片    | `NodeView` + 虚拟滚动          | 只渲染可视区域 |
    | 批量处理    | 合并连续输入为一个 Transaction | 减少重渲染     |
    | 装饰器优化  | 仅在必要时创建 Decorations     | 降低 DOM 开销  |
    | Schema 简化 | 减少复杂规则验证               | 加快文档验证   |

12. **如何调试 ProseMirror？有哪些常用技巧？**

    **结论**：打印 State JSON、断点调试、专用调试工具。

    ```javascript
    // 查看文档结构
    console.log(state.doc.toJSON());
    // 查看选区
    console.log(state.selection.toJSON());

    // 使用调试工具
    import { log } from 'prosemirror-log';
    const view = new EditorView(editor, {
        state: initialState,
        dispatchTransaction(tr) {
            log('transaction', tr);
            const newState = this.state.apply(tr);
            this.updateState(newState);
        },
    });
    ```

    -   **prosemirror-log**：记录所有 Transaction
    -   **prosemirror-inspect**：可视化文档树
    -   **Schema 严格模式**：`new Schema({ ..., strict: true })`

#### 五、生态与扩展

13. **Tiptap 与 ProseMirror 的关系是什么？为什么选择 Tiptap？**

    **结论**：Tiptap 是 ProseMirror 的封装，提供更简洁 API 和框架集成。

    | 特性     | ProseMirror           | Tiptap           |
    | -------- | --------------------- | ---------------- |
    | 上手难度 | 较高（需定义 Schema） | 较低（即用型）   |
    | 定制化   | 高度灵活              | 受限于扩展生态   |
    | 框架支持 | 原生 JS               | React/Vue/Svelte |
    | 适用场景 | 深度定制              | 快速开发         |

    ```javascript
    // Tiptap 快速上手（React）
    import { useEditor } from '@tiptap/react';
    import StarterKit from '@tiptap/starter-kit';

    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Hello World!</p>',
    });
    // Tiptap 内部仍是 ProseMirror
    ```
