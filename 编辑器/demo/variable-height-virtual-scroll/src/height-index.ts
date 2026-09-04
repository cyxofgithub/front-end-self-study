class FenwickTree {
  // Fenwick 树内部使用 1-based 下标，可在 O(log n) 内更新单项高度和查询前缀高度。
  private readonly tree: Float64Array;

  constructor(private readonly size: number, initialValue: number) {
    this.tree = new Float64Array(size + 1);
    for (let index = 0; index < size; index += 1) this.add(index, initialValue);
  }

  add(index: number, delta: number): void {
    for (let cursor = index + 1; cursor <= this.size; cursor += cursor & -cursor) {
      this.tree[cursor] += delta;
    }
  }

  prefix(endExclusive: number): number {
    let sum = 0;
    for (let cursor = endExclusive; cursor > 0; cursor -= cursor & -cursor) {
      sum += this.tree[cursor];
    }
    return sum;
  }

  total(): number {
    return this.prefix(this.size);
  }

  findIndexAtOffset(offset: number): number {
    // offset 落在总高度之外时夹到有效区间，避免返回越界的 block 下标。
    const target = Math.max(0, Math.min(offset, this.total() - 1));
    let index = 0;
    let sum = 0;
    let step = 1;
    while ((step << 1) <= this.size) step <<= 1;

    // 利用树节点保存的区间和做二进制提升，找到最大的前缀和 <= target。
    for (; step > 0; step >>= 1) {
      const next = index + step;
      if (next <= this.size && sum + this.tree[next] <= target) {
        index = next;
        sum += this.tree[next];
      }
    }
    return Math.min(index, this.size - 1);
  }
}

export class VariableHeightIndex {
  private readonly tree: FenwickTree;
  private readonly heights: Float64Array;
  private readonly measured: Uint8Array;

  constructor(size: number, estimate: number) {
    // 未挂载的 block 先用统一估值参与排版，挂载后再用实测高度逐步校正。
    this.tree = new FenwickTree(size, estimate);
    this.heights = new Float64Array(size).fill(estimate);
    this.measured = new Uint8Array(size);
  }

  update(index: number, actualHeight: number): number {
    const normalized = Math.max(1, Math.round(actualHeight * 10) / 10);
    const delta = normalized - this.heights[index];
    // 忽略微小的子像素抖动，防止 ResizeObserver 和重新渲染反复触发。
    if (Math.abs(delta) < 0.5) return 0;
    this.heights[index] = normalized;
    this.measured[index] = 1;
    this.tree.add(index, delta);
    return delta;
  }

  offsetOf(index: number): number {
    return this.tree.prefix(index);
  }

  heightOf(index: number): number {
    return this.heights[index];
  }

  findIndex(offset: number): number {
    return this.tree.findIndexAtOffset(offset);
  }

  totalHeight(): number {
    return this.tree.total();
  }

  isMeasured(index: number): boolean {
    return this.measured[index] === 1;
  }

  measuredCount(): number {
    let count = 0;
    for (const value of this.measured) count += value;
    return count;
  }
}
