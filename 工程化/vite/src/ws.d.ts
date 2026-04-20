declare module 'ws' {
  import type { IncomingMessage } from 'http';
  import type { Duplex } from 'stream';

  export class WebSocketServer {
    constructor(options?: { noServer?: boolean });
    handleUpgrade(
      req: IncomingMessage,
      socket: Duplex,
      head: Buffer,
      callback: (ws: WebSocket) => void
    ): void;
    on(event: 'connection', cb: (ws: WebSocket) => void): this;
    emit(event: string, ...args: unknown[]): boolean;
  }

  export class WebSocket {
    readyState: number;
    send(data: string): void;
    on(event: string, cb: () => void): this;
    close(): void;
  }
}
