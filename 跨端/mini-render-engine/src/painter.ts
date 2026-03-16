/**
 * 门面：持有某个 IRenderBackend，对外提供与抽象 API 一致的绘制方法。
 * 业务代码只依赖 Painter（或直接依赖 IRenderBackend），由运行时注入具体后端。
 */

import type { IRenderBackend } from "./backend.js";

export class Painter {
  constructor(private readonly backend: IRenderBackend) {}

  clear(): void {
    this.backend.clear();
  }

  setFillColor(color: string): void {
    this.backend.setFillColor(color);
  }

  setStrokeColor(color: string): void {
    this.backend.setStrokeColor(color);
  }

  setStrokeWidth(width: number): void {
    this.backend.setStrokeWidth(width);
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    this.backend.fillRect(x, y, width, height);
  }

  strokeRect(x: number, y: number, width: number, height: number): void {
    this.backend.strokeRect(x, y, width, height);
  }

  fillText(text: string, x: number, y: number): void {
    this.backend.fillText(text, x, y);
  }
}
