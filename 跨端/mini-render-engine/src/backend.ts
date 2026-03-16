/**
 * 抽象绘制 API：与平台无关的渲染接口。
 * 任何「渲染后端」实现此接口，即可在同一套业务代码下切换输出目标（如 Canvas 2D、Skia、Mock）。
 */

/** 颜色：CSS 颜色字符串或 rgba 等 */
export type Color = string;

/** 抽象渲染后端接口：只定义「画什么」，不定义「用什么画」 */
export interface IRenderBackend {
  /** 清空画布 */
  clear(): void;
  /** 设置填充色 */
  setFillColor(color: Color): void;
  /** 设置描边色 */
  setStrokeColor(color: Color): void;
  /** 设置描边宽度 */
  setStrokeWidth(width: number): void;
  /** 填充矩形 */
  fillRect(x: number, y: number, width: number, height: number): void;
  /** 描边矩形 */
  strokeRect(x: number, y: number, width: number, height: number): void;
  /** 绘制文字（简化：仅位置，字体由后端或上层约定） */
  fillText(text: string, x: number, y: number): void;
}
