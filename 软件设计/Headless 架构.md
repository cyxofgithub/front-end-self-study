# Headless 组件

## 一句话定义

**Headless 组件 = 只提供逻辑和行为，不提供任何样式/UI 的组件。**

面试官问"你用过 Headless 吗"，问的就是这个，不是 Headless CMS，也不是 Headless Browser。

---

## 到底在解决什么问题？

传统组件库（Ant Design、Element Plus）的困局：

```
你引入了 <el-date-picker /> → 得到了日期选择功能，也得到了一套你未必想要的样式
```

当你公司的设计稿和组件库长得不一样时，你有两个选择：
1. **覆盖样式** — 用 CSS 深层次覆盖，脆弱且累
2. **自己重写** — 键盘导航、focus 管理、WAI-ARIA 从头实现，成本爆炸

Headless 组件给了第三条路：**你引入逻辑，你自己写样式。**

```
引入 @radix-ui/react-select → 得到下拉框的全部行为和可访问性
你自己写 <Select.Trigger className="你设计的样式"> → 百分百控制外观
```

---

## 核心概念：Compound Components + Props Getters

Headless 组件依赖两个模式，理解这两个模式就理解了 Headless。

### 1. Compound Components（复合组件）

多个子组件通过共享父组件状态来协作，而不是把一切塞进 props：

```tsx
// ❌ 传统：全部配置塞进 props
<Select options={data} multiple searchable onChange={...} />

// ✅ Headless：用组件组合表达结构
<Select.Root>
  <Select.Trigger><Select.Value /></Select.Trigger>
  <Select.Content>
    <Select.Item value="1">Option 1</Select.Item>
    <Select.Item value="2">Option 2</Select.Item>
  </Select.Content>
</Select.Root>
```

每个子组件只管自己的 UI，状态通过 React Context 在内部传递，你无需关心。

### 2. Props Getters

Headless 组件本质上是一个 Hook，它不返回 JSX，而是返回**一组 HTML 属性对象**。你把这些属性"展开"到自己的元素上：

```tsx
// Hook 返回的不是渲染内容，而是行为属性
const { getTriggerProps, getPanelProps, getItemProps } = useAccordion()

// 你用这些属性去渲染任何你想要的 HTML
<button {...getTriggerProps()} className="我的样式">展开</button>
<div {...getPanelProps()} className="我的面板样式">...</div>
```

> **这就是"Headless"的本质：Hook 管理状态和交互，但不输出任何 DOM。输出 DOM 是你的事。**

---

## 三个主流库

| 库 | 生态 | 特点 |
|---|---|---|
| **Radix UI** | React | 最成熟的 Headless 原语库，shadcn/ui 的底层依赖 |
| **Headless UI** | React / Vue | Tailwind CSS 团队出品，API 极简 |
| **TanStack Table / Query** | 框架无关 | 表格和数据请求的 Headless 逻辑，不涉及 UI |

---

## 常考面试题

### Q1: Headless 组件和传统组件库的区别？

**答：**

| 维度 | Headless（Radix UI） | 传统（Ant Design） |
|---|---|---|
| 样式 | 零样式，你必须自己写 | 自带完整样式 |
| 核心能力 | 状态管理、键盘交互、WAI-ARIA | 同上 + 主题系统 + 设计规范 |
| 灵活度 | 无约束 | 受限于组件库设计 |
| 学习成本 | 低（只是 Hook / Compound API） | 取决于库的复杂度 |
| 典型使用方式 | 作为"砖块"自建设计系统 | 直接使用即可 |

---

### Q2: 为什么 2023 年以来 Headless 突然火了？

**答：** 主要是因为 **shadcn/ui**。

shadcn/ui 做的不是"又一个组件库"，而是一个**组件分发模型**：它用 Radix UI（Headless）提供底层行为，再配合 Tailwind CSS 书写样式，最终以"复制粘贴源码到你的项目"的方式交付。

```
Radix UI（Headless，提供行为）
    +
Tailwind CSS（写样式）
    +
复制到你的项目而非 npm install（完全可控）
    =
shadcn/ui
```

这解决了之前的终极矛盾：**"我想要组件库的效率，但我也要完全控制样式和代码。"**

---

### Q3: 自己实现一个 Headless Hook

**答：** 以 `useDisclosure` 为例（这是最基础的 Headless Hook，管理打开/关闭状态）：

```tsx
interface UseDisclosureProps {
  defaultOpen?: boolean;
}

function useDisclosure(props: UseDisclosureProps = {}) {
  const { defaultOpen = false } = props;
  const [open, setOpen] = useState(defaultOpen);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onToggle = () => setOpen(prev => !prev);

  // 返回 "是什么"（状态）+ "能干嘛"（操作方法）
  // 不返回任何 JSX，调用方决定如何渲染
  return { open, onOpen, onClose, onToggle };
}

// 使用：Dialog、Drawer、Popover 都可以基于它
function MyDialog() {
  const { open, onOpen, onClose } = useDisclosure();
  return (
    <>
      <button onClick={onOpen}>打开</button>
      {open && (
        <div role="dialog" className="my-dialog-styles">
          <button onClick={onClose}>关闭</button>
        </div>
      )}
    </>
  );
}
```

进阶实现要点（面试加分项）：
- 加 `onKeyDown`（Escape 关闭）
- 加 `useEffect` 处理 `body` 滚动锁定
- 加 `useRef` 管理焦点陷阱（focus trap）
- 这些逻辑**与 UI 无关**，可以复用到任何弹出类组件

---

### Q4: shadcn/ui 和 Ant Design 到底有什么区别？

**答：** 它俩表面上看都是"组件库"，但底层逻辑完全不同。核心区别就一句话：

> **Ant Design 的代码在 `node_modules` 里（别人的），shadcn/ui 的代码在 `src/components/ui` 里（你的）。**

**安装方式的区别：**

```bash
# Ant Design：npm install，代码进入 node_modules，你不拥有它
npm install antd

# shadcn/ui：CLI 命令，直接把源码复制到你的项目里
npx shadcn-ui@latest add button
# → 生成 src/components/ui/button.tsx（这就是你的文件了，改什么随你）
```

**使用时的区别：**

```tsx
// ===== Ant Design =====
// 从 node_modules 导入，组件内部实现你是看不见的
import { Button } from 'antd';

<Button type="primary" onClick={...}>
  提交
</Button>
// 你只能通过 props（type/size/shape）和 ConfigProvider 主题来控制它
// 如果设计师说"这个按钮的 hover 效果我要另一种"，你就得写:
//   .ant-btn-primary:hover { /* 覆盖内部样式，脆弱 */ }

// ===== shadcn/ui =====
// 从你自己的项目文件导入，你可以随时打开这个文件看/改
import { Button } from '@/components/ui/button';

<Button variant="default" onClick={...}>
  提交
</Button>
// 如果设计师要改 hover 效果，你直接打开 button.tsx 改源码：
//   hover:bg-primary/90 → hover:bg-blue-700（随你改）
```

**底层依赖的区别：**

```
Ant Design：
  自己从零实现全部逻辑（DOM 结构、样式、键盘交互、无障碍）
  → 一个巨大的 npm 包，包含一切

shadcn/ui：
  行为层 → Radix UI（npm 依赖，提供无障碍/键盘交互）
  样式层 → Tailwind CSS + CVA（class-variance-authority，管理变体样式）
  源码   → 复制到你的 src/components/ui/
  → 你拥有源码，Radix 是在背后默默提供行为的"隐身引擎"
```

**更新的区别：**

| | Ant Design | shadcn/ui |
|---|---|---|
| 怎么更新 | `npm update antd`，自动升级 | 重新跑 CLI 命令，覆盖文件 |
| 升级后行为 | 新版本立即生效（可能 break） | 你不会被强制升级 |
| 改了组件源码后升级 | 你的 CSS 覆盖可能和新版本冲突 | 手动 diff 新旧版本，合并你需要的 |
| 哲学 | "我升级，你适应" | "你决定什么时候升级，改了什么自己负责" |

**一句话记住：**

```
Ant Design = 租房，房东装修好了，你只能软装
shadcn/ui = 买房，毛坯给你，砸墙重装随你
```

---

### Q5: 现在企业级 Headless 标准方案是什么？

**答：** 2025-2026 年，React 生态的标准答案就一条链：

```
shadcn/ui（组件分发 + 默认样式）
    ↓ 底层行为依赖
Radix UI（Headless 原语：无障碍、键盘、状态）
    ↓ 样式依赖
Tailwind CSS + tailwind-variants（样式引擎 + 变体管理）
```

**具体到代码，一个企业级项目长这样：**

```
src/
├── components/ui/          ← shadcn/ui 生成的组件源码（你拥有）
│   ├── button.tsx
│   ├── dialog.tsx
│   └── select.tsx
├── lib/
│   └── utils.ts            ← cn() 工具（合并 Tailwind 类名）
└── styles/
    └── globals.css          ← Tailwind 指令 + CSS 变量（设计 token）

package.json：
  "radix-ui"        → 所有 @radix-ui/react-* 原语
  "tailwindcss"     → 样式引擎
  "tailwind-variants" → 管理组件的 variant/size 等变体
  "class-variance-authority" → tailwind-variants 的底层（二选一）
  "clsx + tailwind-merge" → cn() 工具函数的依赖
```

**为什么这套组合成了标准：**

| 层面 | 选什么 | 替代品 | 为什么它赢 |
|---|---|---|---|
| 行为原语 | Radix UI | React Aria、Ark UI、Base UI | 组件数量最全、社区最大、shadcn 生态绑定 |
| 样式引擎 | Tailwind CSS | CSS Modules、Panda CSS | 和 shadcn 深度绑定，复制即用 |
| 变体管理 | tailwind-variants | CVA | 类型安全、支持复合变体、Tailwind 原生 |
| 服务端状态 | TanStack Query | SWR、RTK Query | 框架无关、功能最全 |
| 复杂表格 | TanStack Table | AG Grid（非 headless） | 纯逻辑、不关心渲染 |

**Vue 生态的对应方案：**

```
shadcn-vue（shadcn/ui 的 Vue 移植）
    ↓
Radix Vue（Radix UI 的 Vue 移植）
    ↓
Tailwind CSS / UnoCSS
```

**历史脉络——为什么是这套：**

```
2020 前：Ant Design / Element Plus 垄断（npm 黑盒模型）
2021-2022：Radix UI / Headless UI 兴起（组件有了行为，样式你自己写）
2023：shadcn/ui 出现（把行为+默认样式打包复制给你，引爆）
2024-2026：shadcn/ui 成为 React 新项目的事实标准
            ↓
        企业级标准方案 = shadcn/ui + Radix + Tailwind
```

> **面试时可以这样说：** "我们团队的方案是 shadcn/ui + Radix + Tailwind CSS。shadcn/ui 让源码归我们所有，Radix 保证了可访问性和行为一致性，Tailwind 提供样式约束但不限制设计自由度。这套组合兼顾了组件库的效率和自主可控。"

---

### Q6: 选传统组件库还是 Headless？

**答：** 看场景，不站队。

| 场景 | 推荐 | 原因 |
|---|---|---|
| 后台/内部系统 | Ant Design / Element Plus | 效率第一，样式不重要 |
| 自建 Design System | Radix UI + 自定义样式 | 要完全控制 |
| C 端产品 / 品牌定制 | Radix UI / Headless UI | 设计师不会接受"改一套组件库样式" |
| 一人项目 / 快速出活 | shadcn/ui | Headless 的底 + 现成的样式 |
| 表格/列表复杂交互 | TanStack Table | 不关心你用什么 UI，只管逻辑 |

---

## 一句话总结

> **Headless 组件 = 你要一个下拉框的行为，我给你；你要它长什么样，你自己决定。**
