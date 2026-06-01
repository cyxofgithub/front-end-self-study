## CodeGraph

本项目已配置 CodeGraph MCP 服务器（`codegraph_*` 工具）。CodeGraph 是基于 tree-sitter 解析的知识图谱，包含所有符号、边和文件。读取速度亚毫秒级，能返回 grep 无法提供的结构化信息。

### 何时优先使用 codegraph 而非原生搜索

**结构化问题**使用 codegraph——谁调用了谁、改了什么会崩、X 在哪定义、X 的签名是什么。仅在需要**字面文本**查询（字符串内容、注释、日志）或已打开某个文件时才用原生 grep/read。

| 问题 | 工具 |
|---|---|
| "X 在哪定义？" / "查找名为 X 的符号" | `codegraph_search` |
| "谁调用了函数 Y？" | `codegraph_callers` |
| "Y 调用了什么？" | `codegraph_callees` |
| "X 如何到达/变成 Y？/ 追踪从 X 到 Y 的调用流" | `codegraph_trace`（一次调用 = 完整路径，含回调/React/JSX 动态跳转） |
| "改了 Z 会影响什么？" | `codegraph_impact` |
| "查看 Y 的签名/源码/文档字符串" | `codegraph_node` |
| "获取某个任务/领域的聚焦上下文" | `codegraph_context` |
| "同时查看多个相关符号的源码" | `codegraph_explore` |
| "path/ 下有哪些文件？" | `codegraph_files` |
| "索引是否健康？" | `codegraph_status` |

### 使用规则

- **直接回答——不要委派探索。** 对于"X 是怎么工作的"或架构类问题，用 2-3 次 codegraph 调用：先用 `codegraph_context`，再用一次 `codegraph_explore` 获取源码。对于具体**调用流**（"X 如何到达 Y"），先用 `codegraph_trace` from→to——一次调用返回完整路径并桥接动态跳转——再用一次 `codegraph_explore` 获取函数体；不要用 `codegraph_search` + `codegraph_callers` 重建路径。CodeGraph 就是预构建的索引，所以启动独立的文件读取子任务/agent——或运行 grep + read 循环——都是在重复 codegraph 已完成的工作，花费更多却得到相同结果。
- **信任 codegraph 结果。** 它们来自完整的 AST 解析。不要用 grep 重新验证——那样更慢、更不准确，还浪费上下文。
- **按名称查找符号时不要先用 grep。** `codegraph_search` 更快，一次调用就能返回类型、位置和签名。
- **只需上下文时不要链式调用 `codegraph_search` + `codegraph_node`。** `codegraph_context` 一次调用搞定。
- **不要对多个符号循环调用 `codegraph_node`。** 一次 `codegraph_explore` 调用就能返回多个符号的源码（单次上限调用），而每次单独的 node/Read 调用都要重新读取整个上下文，开销大得多。
- **索引延迟**：文件监视器在写入后约 500ms 才更新索引；在同一轮中编辑文件后不要立即重新查询。

### 如果 `.codegraph/` 不存在

MCP 服务器会返回"未初始化"。询问用户：*"我注意到这个项目还没有初始化 CodeGraph。需要我运行 `codegraph init -i` 来建立索引吗？"*
