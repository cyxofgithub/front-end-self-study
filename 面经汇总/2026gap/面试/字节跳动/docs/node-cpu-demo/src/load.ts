interface LoadResult {
  completed: number;
  failed: number;
  averageResponseMs: number;
}

class FixedRateLoadGenerator {
  private completed = 0;
  private failed = 0;
  private totalResponseMs = 0;

  constructor(
    private readonly baseUrl: string,
    private readonly path: string,
    private readonly requestsPerSecond: number,
    private readonly durationSeconds: number,
  ) {}

  async run(): Promise<LoadResult> {
    const intervalMs = 1000 / this.requestsPerSecond;
    const requestCount = Math.floor(this.requestsPerSecond * this.durationSeconds);
    const startedAt = performance.now();
    const requests = Array.from({ length: requestCount }, (_, index) =>
      this.scheduleRequest(startedAt + index * intervalMs),
    );

    await Promise.all(requests);

    return {
      completed: this.completed,
      failed: this.failed,
      averageResponseMs: this.completed === 0 ? 0 : this.totalResponseMs / this.completed,
    };
  }

  private async scheduleRequest(scheduledAt: number): Promise<void> {
    await this.sleep(Math.max(0, scheduledAt - performance.now()));
    await this.sendWorstCaseRequest();
  }

  private async sendWorstCaseRequest(): Promise<void> {
    const url = new URL(this.path, this.baseUrl);
    if (this.path === '/search') {
      url.searchParams.set('keyword', `${'a'.repeat(25)}!`);
    }
    const startedAt = performance.now();

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      await response.arrayBuffer();
      this.completed += 1;
      this.totalResponseMs += performance.now() - startedAt;
    } catch {
      this.failed += 1;
    }
  }

  private sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
const path = process.env.LOAD_PATH ?? '/search';
const requestsPerSecond = Number(process.env.RPS ?? 8);
const durationSeconds = Number(process.env.DURATION_SECONDS ?? 15);

if (!Number.isFinite(requestsPerSecond) || requestsPerSecond <= 0) {
  throw new Error('RPS 必须是大于 0 的数字');
}
if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
  throw new Error('DURATION_SECONDS 必须是大于 0 的数字');
}

console.log(`开始固定速率压测：${path}，${requestsPerSecond} RPS，持续 ${durationSeconds} 秒`);
const generator = new FixedRateLoadGenerator(baseUrl, path, requestsPerSecond, durationSeconds);
const result = await generator.run();
const metricsResponse = await fetch(`${baseUrl}/metrics`);

console.log({
  ...result,
  averageResponseMs: Number(result.averageResponseMs.toFixed(2)),
  eventLoop: await metricsResponse.json(),
});
