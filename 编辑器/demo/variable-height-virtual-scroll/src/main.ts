import "./style.css";
import { createDocumentBlocks } from "./document-blocks";
import { VariableHeightIndex } from "./height-index";
import type { DocumentBlock, VisibleRange } from "./types";

class VirtualScrollDemo {
  // 高度索引保存全量数据，DOM 始终只保留视口附近的少量 block。
  private readonly blocks = createDocumentBlocks(1000);
  private readonly heightIndex = new VariableHeightIndex(this.blocks.length, 96);
  private readonly viewport = mustQuery<HTMLDivElement>("#viewport");
  private readonly content = mustQuery<HTMLDivElement>("#virtual-content");
  private readonly logElement = mustQuery<HTMLOListElement>("#event-log");
  private readonly resizeObserver: ResizeObserver;
  private overscan = 4;
  private renderScheduled = false;
  private currentRange: VisibleRange = { visibleStart: 0, visibleEnd: 0, renderStart: 0, renderEnd: 0 };

  constructor() {
    this.resizeObserver = new ResizeObserver((entries) => this.handleMeasurements(entries));
    this.bindControls();
    this.render();
    this.log("先滚动到中部，再点击“改变视口上方高度”。");
  }

  private bindControls(): void {
    this.viewport.addEventListener("scroll", () => this.scheduleRender(), { passive: true });

    const overscanInput = mustQuery<HTMLInputElement>("#overscan-input");
    const overscanOutput = mustQuery<HTMLOutputElement>("#overscan-output");
    overscanInput.addEventListener("input", () => {
      this.overscan = Number(overscanInput.value);
      overscanOutput.value = String(this.overscan);
      this.render();
    });

    mustQuery<HTMLButtonElement>("#jump-button").addEventListener("click", () => {
      const input = mustQuery<HTMLInputElement>("#jump-input");
      const oneBasedIndex = Number(input.value);
      if (!Number.isInteger(oneBasedIndex) || oneBasedIndex < 1 || oneBasedIndex > this.blocks.length) {
        this.log("跳转失败：请输入 1 到 1000。", "error");
        return;
      }
      const index = oneBasedIndex - 1;
      this.viewport.scrollTop = this.heightIndex.offsetOf(index);
      this.render();
      this.log("跳转到 block " + oneBasedIndex + " 的估算 offset。");
    });

    mustQuery<HTMLButtonElement>("#grow-button").addEventListener("click", () => this.toggleBlockAbove());
    mustQuery<HTMLButtonElement>("#clear-log").addEventListener("click", () => this.logElement.replaceChildren());
  }

  private scheduleRender(): void {
    // 滚动事件可能在一帧内触发多次，统一合并到下一帧渲染。
    if (this.renderScheduled) return;
    this.renderScheduled = true;
    requestAnimationFrame(() => {
      this.renderScheduled = false;
      this.render();
    });
  }

  private getRange(): VisibleRange {
    // 将滚动偏移映射到 block 下标，再向上下扩展 overscan 以减少滚动时的空白。
    const visibleStart = this.heightIndex.findIndex(this.viewport.scrollTop);
    const visibleEnd = this.heightIndex.findIndex(this.viewport.scrollTop + this.viewport.clientHeight);
    return {
      visibleStart,
      visibleEnd,
      renderStart: Math.max(0, visibleStart - this.overscan),
      renderEnd: Math.min(this.blocks.length, visibleEnd + this.overscan + 1),
    };
  }

  private render(): void {
    // 重建 DOM 前先停止观测旧节点，防止已移除节点的回调混入新一轮测量。
    this.resizeObserver.disconnect();
    this.currentRange = this.getRange();
    const fragment = document.createDocumentFragment();

    // 顶部和底部占位元素补齐未挂载内容的高度，使滚动条仍代表整份文档。
    fragment.append(this.createSpacer("top", this.heightIndex.offsetOf(this.currentRange.renderStart)));
    for (let index = this.currentRange.renderStart; index < this.currentRange.renderEnd; index += 1) {
      fragment.append(this.createBlockElement(this.blocks[index], index));
    }
    const renderedBottom = this.heightIndex.offsetOf(this.currentRange.renderEnd);
    fragment.append(this.createSpacer("bottom", this.heightIndex.totalHeight() - renderedBottom));
    this.content.replaceChildren(fragment);

    this.content.querySelectorAll<HTMLElement>("[data-block-index]").forEach((element) => {
      this.resizeObserver.observe(element);
    });
    this.updateStats();
  }

  private createSpacer(position: "top" | "bottom", height: number): HTMLDivElement {
    const spacer = document.createElement("div");
    spacer.className = "spacer spacer-" + position;
    spacer.style.height = Math.max(0, height) + "px";
    spacer.dataset.height = Math.round(height) + "px";
    return spacer;
  }

  private createBlockElement(block: DocumentBlock, index: number): HTMLElement {
    const article = document.createElement("article");
    article.className = "document-block kind-" + block.kind;
    if (index === this.currentRange.visibleStart) article.classList.add("viewport-anchor");
    article.dataset.blockIndex = String(index);

    const header = document.createElement("div");
    header.className = "block-header";
    const title = document.createElement("strong");
    title.textContent = "#" + (index + 1) + "  " + block.title;
    const status = document.createElement("span");
    status.className = this.heightIndex.isMeasured(index) ? "status measured" : "status estimated";
    status.textContent = this.heightIndex.isMeasured(index)
      ? "实测 " + Math.round(this.heightIndex.heightOf(index)) + "px"
      : "预估 96px";
    header.append(title, status);

    const body = document.createElement("p");
    body.textContent = block.text;
    article.append(header, body);

    if (block.kind === "checklist") {
      const list = document.createElement("ul");
      list.innerHTML = "<li>保持稳定 ID</li><li>缓存实测高度</li><li>按偏移二分查找</li>";
      article.append(list);
    }
    if (block.expanded) {
      const expansion = document.createElement("div");
      expansion.className = "expansion";
      expansion.textContent = "这个区域模拟图片加载、评论展开或异步内容，使 block 突然增加 128px。";
      article.append(expansion);
    }
    return article;
  }

  private handleMeasurements(entries: ResizeObserverEntry[]): void {
    if (entries.length === 0) return;
    // 保存当前视口锚点及其屏内距离，高度校正后用它恢复阅读位置。
    const anchorIndex = this.heightIndex.findIndex(this.viewport.scrollTop + 1);
    const anchorDistance = this.viewport.scrollTop - this.heightIndex.offsetOf(anchorIndex);
    let changed = false;

    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      const index = Number(element.dataset.blockIndex);
      // borderBoxSize 包含 padding 和 border，与 block 实际占用的布局高度一致。
      const delta = this.heightIndex.update(index, entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height);
      if (delta === 0) continue;
      changed = true;
      this.log("实测 #" + (index + 1) + "：高度差 " + signed(delta) + "px");
    }
    if (!changed) return;

    // 锚点之前的 block 高度变化时，同步调整 scrollTop，避免用户眼前的内容跳动。
    const compensatedScrollTop = this.heightIndex.offsetOf(anchorIndex) + anchorDistance;
    const compensation = compensatedScrollTop - this.viewport.scrollTop;
    if (Math.abs(compensation) >= 0.5) {
      this.viewport.scrollTop = compensatedScrollTop;
      this.log("锚点 #" + (anchorIndex + 1) + "：scrollTop 补偿 " + signed(compensation) + "px", "anchor");
    }
    this.scheduleRender();
  }

  private toggleBlockAbove(): void {
    if (this.currentRange.visibleStart < 2) {
      this.viewport.scrollTop = this.heightIndex.offsetOf(499);
      this.render();
      this.log("视口太靠前，已先跳转到 block 500。", "anchor");
      requestAnimationFrame(() => this.toggleBlockAbove());
      return;
    }
    // 修改视口上方紧邻的 block，便于直接观察锚点补偿效果。
    const targetIndex = this.currentRange.visibleStart - 1;
    const target = this.blocks[targetIndex];
    target.expanded = !target.expanded;
    this.log("#" + (targetIndex + 1) + (target.expanded ? " 展开" : " 收起") + "，等待 ResizeObserver 实测。", "action");
    this.render();
  }

  private updateStats(): void {
    const values: Record<string, string> = {
      "#scroll-top": Math.round(this.viewport.scrollTop) + " px",
      "#visible-range": "#" + (this.currentRange.visibleStart + 1) + " - #" + (this.currentRange.visibleEnd + 1),
      "#render-range": "#" + (this.currentRange.renderStart + 1) + " - #" + this.currentRange.renderEnd,
      "#dom-count": (this.currentRange.renderEnd - this.currentRange.renderStart) + " / " + this.blocks.length,
      "#top-spacer": Math.round(this.heightIndex.offsetOf(this.currentRange.renderStart)) + " px",
      "#bottom-spacer": Math.round(this.heightIndex.totalHeight() - this.heightIndex.offsetOf(this.currentRange.renderEnd)) + " px",
      "#measured-count": String(this.heightIndex.measuredCount()),
      "#total-height": Math.round(this.heightIndex.totalHeight()) + " px",
    };
    for (const [selector, value] of Object.entries(values)) mustQuery<HTMLElement>(selector).textContent = value;
  }

  private log(message: string, type: "normal" | "anchor" | "action" | "error" = "normal"): void {
    const item = document.createElement("li");
    item.className = "log-" + type;
    const time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
    item.textContent = time + "  " + message;
    this.logElement.prepend(item);
    while (this.logElement.children.length > 12) this.logElement.lastElementChild?.remove();
  }

}

function mustQuery<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error("Missing element: " + selector);
  return element;
}

function signed(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return (rounded > 0 ? "+" : "") + rounded;
}

new VirtualScrollDemo();
