# Superpowers 学习教程（终版精简）

## 1. 它是什么

一句话：**Superpowers 不是新框架，而是一套让 AI 按标准流程完成任务的技能系统**。

它的作用是把“临时提示词”变成“可复用流程”：

-   明确输入（目标、约束、验收）
-   固定步骤（先澄清、再计划、后实现、最后验证）
-   固定输出（变更说明、验证结果、风险）

```mermaid
flowchart LR
  goal[任务目标] --> skill[调用技能]
  skill --> exec[按流程执行]
  exec --> result[结构化结果]
```

---

## 2. 怎么用（最短流程）

1. 写清任务目标和验收标准
2. 指定技能流程
3. 要求固定输出结构
4. 完成前做验证

推荐技能链：

-   需求不清：`brainstorming`
-   任务拆解：`writing-plans`
-   编码实现：`test-driven-development`
-   异常排查：`systematic-debugging`
-   收尾验证：`verification-before-completion`
-   阶段评审：`code-reviewer`（子代理）

```mermaid
flowchart LR
  clarify[澄清] --> plan[计划]
  plan --> implement[实现]
  implement --> verify[验证]
```

---

## 3. 可直接复制的示例

### 示例 A：直接用 Superpowers 跑一次任务

```text
请按 Superpowers 流程执行：
1) 先用 brainstorming 澄清边界和风险；
2) 用 writing-plans 给出最多 5 步计划和验收标准；
3) 按计划实现；
4) 用 verification-before-completion 给出验证证据。

目标：为文档站新增“教程目录索引”页面。
验收：页面可访问、支持关键字搜索、构建无报错。
输出：变更说明 / 修改文件 / 验证结果 / 风险与后续。
```

### 示例 B：创建最小自定义技能包

创建目录：

```bash
mkdir -p .cursor/skills/code-review-summary
```

创建文件：`.cursor/skills/code-review-summary/SKILL.md`

```md
---
name: code-review-summary
description: 生成结构化代码评审摘要。
---

## 输入契约

-   必填：变更文件列表、变更目标、目标读者

## 执行步骤

1. 提炼目标
2. 提取关键改动和风险
3. 按固定结构输出

## 输出契约

-   小节：背景、改动摘要、风险、验证建议
-   格式：Markdown

## 验收标准

-   结构完整
-   关键改动无遗漏
-   不捏造信息
```

调用方式：

```text
请使用 code-review-summary 技能包。
输入：变更文件列表 [...], 变更目标 ..., 读者是开发同学。
按“背景/改动摘要/风险/验证建议”输出。
```

---

## 4. 常见误区（高频）

-   只给一句“帮我做一下”，不写验收标准
-   只列技能名，不要求固定输出结构
-   写完就结束，不做验证
-   失败后只重试，不更新排障步骤

---

## 5. 一页自检清单

-   [ ] 我能用 1 分钟解释 Superpowers 是什么
-   [ ] 我能按“目标 -> 流程 -> 输出 -> 验收”下达任务
-   [ ] 我跑通过至少 1 个内置技能流程
-   [ ] 我创建并调用过 1 个自定义 `SKILL.md`
-   [ ] 我知道失败后先补排障再重跑

---

## 6. 维护规则（最小）

-   术语统一：技能包、输入契约、输出契约、验收标准、排障
-   每次只做一个小迭代（如 `v1 -> v1.1`）
-   只保留能直接执行的内容，删除重复解释
