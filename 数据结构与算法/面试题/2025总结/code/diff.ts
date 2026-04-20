// 1. 定义虚拟DOM结构（模拟React元素）
type VNodeType = string | VNode;

interface VNodeProps {
    [key: string]: any;
    key?: string | number | null;
}

// 定义 Patch 类型
type Patch =
    | { type: 'REMOVE'; index: any }
    | { type: 'ADD'; index: any; newVNode: VNodeType }
    | { type: 'TEXT'; index: any; content: string }
    | { type: 'REPLACE'; index: any; newVNode: VNodeType }
    | { type: 'PROPS'; index: any; props: { [key: string]: any } };

class VNode {
    type: string;
    props: VNodeProps;
    children: Array<VNodeType>;
    key: string | number | null;
    constructor(type: string, props: VNodeProps = {}, children: Array<VNodeType> = []) {
        this.type = type; // 节点类型（如'div'、'span'或组件）
        this.props = props; // 属性（含key）
        this.children = children; // 子节点数组
        this.key = props.key || null; // 列表节点的key（用于优化）
    }
}

// 用类来组织Diff逻辑
class DiffEngine {
    patches: Patch[] = [];

    diff(oldVNode: VNodeType, newVNode: VNodeType) {
        this.patches = [];
        this.walk(oldVNode, newVNode, 0);
        return this.patches;
    }

    private walk(oldVNode: VNodeType, newVNode: VNodeType, index: any) {
        // 情况1：新节点不存在 → 删除旧节点
        if (!newVNode) {
            this.patches.push({
                type: 'REMOVE',
                index,
            });
            return;
        }

        // 情况2：旧节点不存在 → 新增新节点
        if (!oldVNode) {
            this.patches.push({
                type: 'ADD',
                index,
                newVNode,
            });
            return;
        }

        // 情况4：文本节点内容不同 → 更新文本
        if (typeof oldVNode === 'string' && typeof newVNode === 'string') {
            if (oldVNode !== newVNode) {
                this.patches.push({
                    type: 'TEXT',
                    index,
                    content: newVNode,
                });
            }
            return;
        }

        // 情况3：节点类型不同（如div→p）→ 替换整个节点
        if (
            typeof oldVNode !== typeof newVNode ||
            (typeof oldVNode !== 'string' &&
                typeof newVNode !== 'string' &&
                (oldVNode as VNode).type !== (newVNode as VNode).type)
        ) {
            this.patches.push({
                type: 'REPLACE',
                index,
                newVNode,
            });
            return;
        }

        // 情况5：同类型节点（非文本）→ 对比属性和子节点
        if (typeof oldVNode !== 'string' && typeof newVNode !== 'string') {
            // 5.1 对比属性差异
            const propsDiff = this.diffProps((oldVNode as VNode).props, (newVNode as VNode).props);
            if (Object.keys(propsDiff).length > 0) {
                this.patches.push({
                    type: 'PROPS',
                    index,
                    props: propsDiff,
                });
            }

            // 5.2 对比子节点（核心：处理列表节点的key匹配）
            this.diffChildren((oldVNode as VNode).children, (newVNode as VNode).children, index);
        }
    }

    // 对比属性差异：返回需要新增/修改/删除的属性
    private diffProps(oldProps: VNodeProps, newProps: VNodeProps) {
        const propsDiff: { [key: string]: any } = {};

        // 1. 处理需要删除或修改的旧属性
        for (const key in oldProps) {
            if (key === 'key') continue;
            if (!newProps.hasOwnProperty(key)) {
                propsDiff[key] = null;
            } else if (oldProps[key] !== newProps[key]) {
                propsDiff[key] = newProps[key];
            }
        }

        // 2. 处理新增的属性
        for (const key in newProps) {
            if (key === 'key') continue;
            if (!oldProps.hasOwnProperty(key)) {
                propsDiff[key] = newProps[key];
            }
        }

        return propsDiff;
    }

    // 对比子节点（核心：使用key优化列表对比）
    private diffChildren(oldChildren: Array<VNodeType>, newChildren: Array<VNodeType>, parentIndex: any) {
        // 1. 构建旧子节点的key到索引的映射，便于后续通过key快速查找旧节点
        const oldKeyToIndex: { [key: string]: number } = {};
        oldChildren.forEach((child, index) => {
            if (typeof child !== 'string' && child && child.key !== null) {
                oldKeyToIndex[String(child.key)] = index;
            }
        });

        // 2. 用于记录哪些旧节点已经被新节点访问过（复用过），避免重复删除
        const visited = new Set<number>();

        // 3. 遍历新子节点，尝试与旧子节点进行key匹配和diff
        newChildren.forEach((newChild, newIndex) => {
            let newKey: string | number | null = null;
            if (typeof newChild !== 'string' && newChild) {
                newKey = newChild.key || null;
            }
            let oldIndex = -1;

            // 3.1 如果新节点有key且在旧节点中能找到相同key，则复用旧节点
            if (newKey !== null && oldKeyToIndex.hasOwnProperty(String(newKey))) {
                oldIndex = oldKeyToIndex[String(newKey)];
                visited.add(oldIndex); // 标记该旧节点已被访问
            } else {
                // 3.2 否则尝试按索引位置匹配（无key或找不到key的情况）
                oldIndex = newIndex;
                if (oldIndex >= oldChildren.length) oldIndex = -1;
            }

            // 3.3 计算当前子节点的全局索引
            const childIndex = DiffEngine.getChildIndex(parentIndex, newIndex);

            // 3.4 如果找到了对应的旧节点，则递归diff；否则说明是新增节点
            if (oldIndex !== -1 && oldChildren[oldIndex]) {
                this.walk(oldChildren[oldIndex], newChild, childIndex);
            } else {
                if (newChild) {
                    this.patches.push({
                        type: 'ADD',
                        index: childIndex,
                        newVNode: newChild,
                    });
                }
            }
        });

        // 4. 遍历旧子节点，找出哪些节点没有被新节点复用（即需要删除的节点）
        oldChildren.forEach((oldChild, oldIndex) => {
            if (!visited.has(oldIndex) && oldChild) {
                const childIndex = DiffEngine.getChildIndex(parentIndex, oldIndex);
                this.patches.push({
                    type: 'REMOVE',
                    index: childIndex,
                });
            }
        });
    }

    // 辅助函数：计算子节点在全局的索引
    static getChildIndex(parentIndex: any, childIndex: number) {
        return `${parentIndex}-${childIndex}`;
    }
}

// ------------------------------
// 测试：创建新旧虚拟DOM并执行Diff
// ------------------------------

const oldVNode = new VNode('div', { id: 'container' }, [
    new VNode('h1', { key: 'title' }, ['旧标题']),
    new VNode('ul', {}, [new VNode('li', { key: '1' }, ['项目1']), new VNode('li', { key: '2' }, ['项目2'])]),
]);

const newVNode = new VNode('div', { id: 'container', className: 'new' }, [
    new VNode('h1', { key: 'title' }, ['新标题']),
    new VNode('ul', {}, [new VNode('li', { key: '2' }, ['项目2修改']), new VNode('li', { key: '3' }, ['项目3'])]),
]);

const diffEngine = new DiffEngine();
const patches = diffEngine.diff(oldVNode, newVNode);
console.log('生成的DOM操作补丁：', patches);
