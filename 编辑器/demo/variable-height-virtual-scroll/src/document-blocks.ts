import type { DocumentBlock } from "./types";

const phrases = [
  "虚拟滚动只挂载视口附近的内容，其余空间由占位元素表示。",
  "段落长度不同、图片异步加载、评论展开都会使 block 高度在运行时变化。",
  "高度索引把滚动偏移映射为 block 下标，避免从文档开头逐项扫描。",
  "锚点补偿让视口上方的高度变化不会推动用户当前正在阅读的内容。",
];

export function createDocumentBlocks(count: number): DocumentBlock[] {
  return Array.from({ length: count }, (_, index) => {
    const repeat = (index * 7) % 4 + 1;
    return {
      id: "block-" + index,
      title: index % 11 === 0 ? "动态内容区" : index % 7 === 0 ? "结构化清单" : "普通段落",
      text: Array.from({ length: repeat }, (__, phraseIndex) => phrases[(index + phraseIndex) % phrases.length]).join(" "),
      kind: index % 11 === 0 ? "quote" : index % 7 === 0 ? "checklist" : "paragraph",
      expanded: false,
    };
  });
}
