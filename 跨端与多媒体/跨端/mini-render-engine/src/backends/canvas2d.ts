/**
 * 渲染后端：使用浏览器 Canvas 2D API 实现 IRenderBackend。
 * 对应「Skia 在某一平台上的具体实现」。
 */

import type { IRenderBackend } from "../backend.js";

export class Canvas2DBackend implements IRenderBackend {
  private readonly ctx: CanvasRenderingContext2D;
  private fillColor: string = "#000000";
  private strokeColor: string = "#000000";
  private strokeWidth: number = 1;

  constructor(ctx: CanvasRenderingContext2D) {
    if (!ctx) throw new Error("Canvas2DBackend: CanvasRenderingContext2D is required");
    this.ctx = ctx;
  }

  clear(): void {
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }

  setFillColor(color: string): void {
    this.fillColor = color;
    this.ctx.fillStyle = color;
  }

  setStrokeColor(color: string): void {
    this.strokeColor = color;
    this.ctx.strokeStyle = color;
  }

  setStrokeWidth(width: number): void {
    this.strokeWidth = width;
    this.ctx.lineWidth = width;
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    this.ctx.fillStyle = this.fillColor;
    this.ctx.fillRect(x, y, width, height);
  }

  strokeRect(x: number, y: number, width: number, height: number): void {
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.strokeRect(x, y, width, height);
  }

  fillText(text: string, x: number, y: number): void {
    this.ctx.fillStyle = this.fillColor;
    this.ctx.font = "16px system-ui, sans-serif";
    this.ctx.fillText(text, x, y);
  }
}
