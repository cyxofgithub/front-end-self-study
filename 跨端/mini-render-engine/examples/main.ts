/**
 * 浏览器示例：用抽象 API + Canvas 2D 后端在页面上绘制。
 * 同一套 Painter 调用，换后端即可换输出（此处为 Web Canvas）。
 */

import { Canvas2DBackend } from "../src/backends/canvas2d.js";
import { Painter } from "../src/painter.js";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
if (!canvas) throw new Error("canvas#canvas not found");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("getContext('2d') failed");

const backend = new Canvas2DBackend(ctx);
const painter = new Painter(backend);

painter.clear();
painter.setFillColor("steelblue");
painter.fillRect(50, 50, 120, 80);
painter.setStrokeColor("coral");
painter.setStrokeWidth(3);
painter.strokeRect(200, 50, 120, 80);
painter.setFillColor("#333");
painter.fillText("Mini 跨端渲染引擎", 50, 180);
