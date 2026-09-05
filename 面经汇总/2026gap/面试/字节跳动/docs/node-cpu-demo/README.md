# Node CPU 排查实验

本目录包含两套独立实验：

- 当前文档：业务同步计算导致 CPU 高，练习 CPU Profile 定位。
- [GC 与内存上涨实验](./GC实验.md)：对象分配导致内存、GC 时间和 CPU 一起上涨。

当前实验不是为了学习正则，而是练习一条线上排障证据链：**发现 CPU 异常 → 判断主线程阻塞 → CPU Profile 定位热点 → 同流量验证修复。**

完成后，你应该能回答三个问题：

1. 为什么 CPU 高时不能直接下结论是“流量太大”？
2. CPU Profile 中 `Self Time` 和 `Total Time` 分别解决什么问题？
3. 为什么修复后必须使用相同 RPS 再测一次？

```mermaid
flowchart LR
  A[固定 8 RPS] --> B[观察进程 CPU]
  B --> C[查看事件循环延迟]
  C --> D[CPU Profile 找热点]
  D --> E[切换安全策略]
  E --> F[相同 8 RPS 复测]
```

## 准备

```bash
cd 面经汇总/2026gap/面试/字节跳动/docs/node-cpu-demo
pnpm install --registry=https://registry.npmmirror.com
```

项目中有两个校验策略：

| 策略 | 代码 | 特征 |
| --- | --- | --- |
| 故障版 | `UnsafeRegexValidator` | 嵌套量词，失败输入触发指数级回溯 |
| 修复版 | `SafeRegexValidator` | 先限制长度，再用线性正则扫描 |

先不要急着看修复代码。按照下面四步走完一次排障。

## 第一步：建立故障现象

终端 A 启动故障版：

```bash
pnpm dev:unsafe
```

终端 B 先做一次探测：

```bash
pnpm trigger
```

你应该观察到：正常输入约为 `0 ms`，26 字符的非法输入却需要数十到数百毫秒。两者走的是同一个接口，差异只来自输入内容。

现在制造持续 15 秒、固定 8 RPS 的故障流量：

```bash
pnpm load
```

`load` 使用固定 RPS，是为了让修复前后接收相同流量。不要用“尽可能多地请求”，否则修复版吞吐更高，两个实验的输入规模会不同。

## 第二步：像排查线上服务一样收集证据

在 `pnpm load` 运行期间，终端 C 查看 Node 进程：

```bash
# macOS：先找到监听 3000 端口的 PID，再观察它。
lsof -nP -iTCP:3000 -sTCP:LISTEN
top -pid <PID>

# Linux 对应命令：top -p <PID>
```

观察 `pnpm load` 最后的输出：

```text
{
  completed: 120,
  failed: 0,
  averageResponseMs: 126.38,
  eventLoop: {
    validator: 'unsafe-regex',
    eventLoopDelayP99Ms: ...,
    eventLoopDelayMaxMs: ...
  }
}
```

具体数值因机器而异，重点是组合关系：

| 证据 | 说明 |
| --- | --- |
| RPS 固定且很低 | 不是突发流量导致 CPU 上涨 |
| 单个请求计算时间很长 | 单请求 CPU 成本异常 |
| 事件循环 `max` 明显上涨 | 同步任务阻塞 Node 主线程 |
| 内存没有持续增长 | 暂时没有证据指向内存泄漏或频繁 GC |

到这里可以提出假设：**某段同步业务代码持续占用主线程。** 但还不能说是哪一行代码，下一步需要 Profile 证明。

## 第三步：用 CPU Profile 找到代码

停止故障服务，在终端 A 改为带采样启动：

```bash
pnpm profile
```

终端 B 执行 `pnpm load`。压测完成后，在终端 A 按 `Ctrl+C`，得到：

```text
profiles/CPU.*.cpuprofile
```

打开 Chrome DevTools → **Performance** → Load profile，按顺序回答：

1. **Bottom-Up**：按 `Self Time` 降序，哪个函数自身最耗 CPU？
2. **Call Tree**：是谁调用了这个热点？
3. **Flame Chart**：最宽的栈是否覆盖了大部分采样时间？

本例预期定位结果：

```text
/search 请求
└── UnsafeRegexValidator.isValid
    └── RegExp.test / RegExp 执行
```

`RegExp` 的 Self Time 高，说明 CPU 花在正则引擎本身；`isValid` 的 Total Time 高，说明它是热点的业务入口。两者结合，才能从运行时热点追到可修改的源码。

## 第四步：验证修复，而不是宣布修复

打开 [`src/keyword-validator.ts`](./src/keyword-validator.ts)，对比两个策略。然后启动修复版：

```bash
pnpm dev:safe
```

再次使用完全相同的负载：

```bash
pnpm trigger
pnpm load
```

对照结果：

| 验收项 | 故障版 | 修复版 |
| --- | --- | --- |
| 非法输入 HTTP 状态 | `400` | `400`，业务语义不变 |
| 校验耗时 | 数十至数百毫秒 | 接近 `0 ms` |
| 固定 8 RPS 下的 CPU | 明显升高 | 接近空闲基线 |
| 事件循环延迟最大值 | 明显升高 | 接近空闲基线 |
| Profile 中正则热点 | 存在 | 消失 |

这一步学习的是：优化结论必须建立在**相同流量模型、相同输入和相同业务结果**上，否则数据不可比较。

## 实验复盘

现在再回答开头的三个问题：

- CPU 高可能来自流量增长，也可能来自单请求成本上涨；本例用固定低 RPS 排除了前者。
- Bottom-Up 的 Self Time 找“谁自身最耗时”，Call Tree 和 Total Time 找“谁触发了它”。
- 相同 RPS 复测能控制变量，证明 CPU 下降来自代码修复，而不是请求变少。

真实线上还要补充实例对比、QPS、p99、GC 时间和上下游耗时。本实验刻意只保留“同步计算导致单核打满”这一条路径，完整决策树见：[Node 服务 CPU 占用过高怎么排查？](../Node服务CPU排查.md)。

## 自动检查

```bash
pnpm typecheck
pnpm test
```
