export class OrderSnapshot {
  constructor(
    readonly id: number,
    readonly payload: string,
  ) {}
}

export interface AllocationResult {
  allocatedObjects: number;
  retainedBatches: number;
  checksum: number;
}

export class AllocationPressureService {
  private readonly retainedBatches: OrderSnapshot[][] = [];
  private requestSequence = 0;

  constructor(
    private readonly objectsPerRequest = 20_000,
    private readonly maxRetainedBatches = 6,
  ) {}

  allocate(): AllocationResult {
    const requestId = this.requestSequence++;
    const batch = Array.from(
      { length: this.objectsPerRequest },
      (_, index) => new OrderSnapshot(index, `order-${requestId}-${index}-${'x'.repeat(64)}`),
    );

    // 保留最近几批模拟缓存膨胀；淘汰的批次会变成 GC 回收对象。
    this.retainedBatches.push(batch);
    if (this.retainedBatches.length > this.maxRetainedBatches) {
      this.retainedBatches.shift();
    }

    return {
      allocatedObjects: batch.length,
      retainedBatches: this.retainedBatches.length,
      checksum: batch[0]?.payload.length ?? 0,
    };
  }

  release(): number {
    const releasedBatches = this.retainedBatches.length;
    this.retainedBatches.length = 0;
    return releasedBatches;
  }
}
