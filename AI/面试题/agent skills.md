## agent skills

-   [官方文档](https://agentskills.io/specification)
-   [skill-ref,校验、结合模型工具](https://github.com/agentskills/agentskills/tree/main/skills-ref)
-   [openSkills 管理工具](https://github.com/numman-ali/openskills?tab=readme-ov-file#-creating-your-own-skills)

## 与 rules 规则区别

-   rules 规则是静态的规则集合，agent skills 是动态的技能集合

## 运行流程/原理

```mermaid
flowchart LR
    A[用户输入任务] --> B{语义匹配Skill元数据}
    B -->|不匹配| C[常规AI处理]
    B -->|匹配| D[动态加载Skill核心指令]
    D --> E{需工具/资源?}
    E -->|是| F[加载原始层工具/资源]
    E -->|否| G[执行指令]
    F --> G
    G --> H[生成专业输出]
    H --> I[反馈与Skill优化]
```
