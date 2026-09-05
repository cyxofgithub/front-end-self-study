import { PerformanceObserver } from 'node:perf_hooks';

export interface GcSnapshot {
  count: number;
  totalDurationMs: number;
  maxDurationMs: number;
  observationWindowMs: number;
}

export class GcObserver {
  private count = 0;
  private totalDurationMs = 0;
  private maxDurationMs = 0;
  private startedAt = performance.now();
  private readonly observer: PerformanceObserver;

  constructor() {
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.count += 1;
        this.totalDurationMs += entry.duration;
        this.maxDurationMs = Math.max(this.maxDurationMs, entry.duration);
      }
    });
  }

  start(): void {
    this.observer.observe({ entryTypes: ['gc'] });
  }

  stop(): void {
    this.observer.disconnect();
  }

  readAndReset(): GcSnapshot {
    const snapshot = {
      count: this.count,
      totalDurationMs: Number(this.totalDurationMs.toFixed(2)),
      maxDurationMs: Number(this.maxDurationMs.toFixed(2)),
      observationWindowMs: Number((performance.now() - this.startedAt).toFixed(2)),
    };

    this.count = 0;
    this.totalDurationMs = 0;
    this.maxDurationMs = 0;
    this.startedAt = performance.now();
    return snapshot;
  }
}
