class CpuSpikeTrigger {
  constructor(private readonly baseUrl: string) {}

  async run(): Promise<void> {
    await this.request('正常输入', 'hello_node');
    await this.request('触发回溯', `${'a'.repeat(25)}!`);

    const metrics = await fetch(`${this.baseUrl}/metrics`);
    console.log('事件循环指标:', await metrics.json());
  }

  private async request(label: string, keyword: string): Promise<void> {
    const url = new URL('/search', this.baseUrl);
    url.searchParams.set('keyword', keyword);
    const startedAt = performance.now();
    const response = await fetch(url);
    const elapsedMs = performance.now() - startedAt;

    console.log(`${label}: HTTP ${response.status}, 客户端耗时 ${elapsedMs.toFixed(2)} ms`);
    console.log(await response.json());
  }
}

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

new CpuSpikeTrigger(baseUrl).run().catch((error: unknown) => {
  console.error('trigger_failed：请先启动服务', error);
  process.exitCode = 1;
});
