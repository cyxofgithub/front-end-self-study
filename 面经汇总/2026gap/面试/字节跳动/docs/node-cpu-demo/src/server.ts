import { createServer, type Server, type ServerResponse } from 'node:http';
import { monitorEventLoopDelay, type IntervalHistogram } from 'node:perf_hooks';
import { AllocationPressureService } from './allocation-pressure.js';
import { GcObserver } from './gc-observer.js';
import {
  SafeRegexValidator,
  type KeywordValidator,
  UnsafeRegexValidator,
} from './keyword-validator.js';

class CpuDemoServer {
  private readonly eventLoopDelay: IntervalHistogram;
  private readonly gcObserver = new GcObserver();
  private readonly allocationPressure = new AllocationPressureService();
  private server?: Server;

  constructor(
    private readonly validator: KeywordValidator,
    private readonly port: number,
  ) {
    this.eventLoopDelay = monitorEventLoopDelay({ resolution: 20 });
  }

  start(): void {
    this.eventLoopDelay.enable();
    this.gcObserver.start();
    this.server = createServer((request, response) => {
      try {
        const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

        if (url.pathname === '/search') {
          this.handleSearch(url, response);
          return;
        }

        if (url.pathname === '/allocate') {
          this.sendJson(response, 200, this.allocationPressure.allocate());
          return;
        }

        if (url.pathname === '/release') {
          const releasedBatches = this.allocationPressure.release();
          globalThis.gc?.();
          this.sendJson(response, 200, {
            releasedBatches,
            forcedGc: typeof globalThis.gc === 'function',
          });
          return;
        }

        if (url.pathname === '/metrics') {
          this.handleMetrics(response);
          return;
        }

        this.sendJson(response, 404, { error: 'not_found' });
      } catch (error) {
        console.error('request_failed', error);
        this.sendJson(response, 500, { error: 'internal_error' });
      }
    });
    this.server.listen(this.port, () => {
      console.log(`mode=${this.validator.name}`);
      console.log(`listening=http://localhost:${this.port}`);
    });
  }

  // --cpu-prof 只有在进程「干净退出」时才落盘；Ctrl+C 默认的 SIGINT
  // 处理会跳过 profile 的序列化。这里显式关停服务器再 exit(0)，
  // 让 CPU profile 有机会写入 profiles/。
  shutdown(): void {
    this.eventLoopDelay.disable();
    this.gcObserver.stop();
    this.server?.close(() => {
      console.log('server closed, flushing cpu profile');
      process.exit(0);
    });
  }

  private handleSearch(url: URL, response: ServerResponse): void {
    const keyword = url.searchParams.get('keyword') ?? '';
    const startedAt = performance.now();
    const valid = this.validator.isValid(keyword);
    const durationMs = performance.now() - startedAt;

    this.sendJson(response, valid ? 200 : 400, { valid, durationMs });
  }

  private handleMetrics(response: ServerResponse): void {
    const eventLoopDelayP99Ms = this.eventLoopDelay.percentile(99) / 1e6;
    const eventLoopDelayMaxMs = this.eventLoopDelay.max / 1e6;
    const memory = process.memoryUsage();
    this.sendJson(response, 200, {
      mode,
      validator: this.validator.name,
      eventLoopDelayP99Ms: Number(eventLoopDelayP99Ms.toFixed(2)),
      eventLoopDelayMaxMs: Number(eventLoopDelayMaxMs.toFixed(2)),
      memoryMb: {
        heapUsed: this.toMegabytes(memory.heapUsed),
        heapTotal: this.toMegabytes(memory.heapTotal),
        rss: this.toMegabytes(memory.rss),
      },
      gc: this.gcObserver.readAndReset(),
    });
    this.eventLoopDelay.reset();
  }

  private toMegabytes(bytes: number): number {
    return Number((bytes / 1024 / 1024).toFixed(2));
  }

  private sendJson(response: ServerResponse, statusCode: number, body: object): void {
    response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(body));
  }
}

const mode = process.env.DEMO_MODE ?? 'unsafe';
const port = Number(process.env.PORT ?? 3000);
const validator = mode === 'unsafe' ? new UnsafeRegexValidator() : new SafeRegexValidator();

const server = new CpuDemoServer(validator, port);
server.start();

process.on('SIGINT', () => server.shutdown());
