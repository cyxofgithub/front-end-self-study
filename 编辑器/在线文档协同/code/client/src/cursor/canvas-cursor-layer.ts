import type { EditorView } from 'prosemirror-view';
import type { Doc, XmlFragment } from 'yjs';
import * as Y from 'yjs';
import { relativePositionToAbsolutePosition } from 'y-prosemirror';
import type { PerfTracker } from '../shared/perf';

interface UserAwarenessState {
    name?: string;
    color?: string;
}

interface CursorAwarenessState {
    anchor: unknown;
    head: unknown;
}

interface CanvasCursorLayerOptions {
    editorView: EditorView;
    awareness: AwarenessLike;
    ydoc: Doc;
    yXmlFragment: XmlFragment;
    host: HTMLElement;
    getMapping: () => Map<unknown, { nodeSize: number }> | null;
    perfTracker?: PerfTracker;
    perfLogEnabled?: boolean;
    cursorStateField?: string;
}

interface RectLike {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface AwarenessLike {
    getStates: () => Map<number, unknown>;
    on: (event: 'change', listener: () => void) => void;
    off: (event: 'change', listener: () => void) => void;
}

export class CanvasCursorLayer {
    private readonly editorView: EditorView;
    private readonly awareness: AwarenessLike;
    private readonly ydoc: Doc;
    private readonly yXmlFragment: XmlFragment;
    private readonly host: HTMLElement;
    private readonly getMapping: () => Map<unknown, { nodeSize: number }> | null;
    private readonly perfTracker?: PerfTracker;
    private readonly perfLogEnabled: boolean;
    private readonly cursorStateField: string;
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private rafId: number | null = null;
    private destroyed = false;

    constructor(options: CanvasCursorLayerOptions) {
        this.editorView = options.editorView;
        this.awareness = options.awareness;
        this.ydoc = options.ydoc;
        this.yXmlFragment = options.yXmlFragment;
        this.host = options.host;
        this.getMapping = options.getMapping;
        this.perfTracker = options.perfTracker;
        this.perfLogEnabled = options.perfLogEnabled ?? false;
        this.cursorStateField = options.cursorStateField ?? 'cursor';

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'collab-canvas-cursor-layer';
        this.canvas.style.position = 'absolute';
        this.canvas.style.inset = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '4';

        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Canvas 2D 上下文初始化失败');
        }
        this.ctx = context;

        this.host.appendChild(this.canvas);
        this.resizeCanvas();

        this.awareness.on('change', this.onAwarenessChange);
        window.addEventListener('resize', this.onViewportResize);
        window.addEventListener('scroll', this.onViewportScroll, true);
        this.requestRender();
    }

    requestRender() {
        if (this.destroyed || this.rafId !== null) {
            return;
        }

        this.rafId = window.requestAnimationFrame(() => {
            this.rafId = null;
            this.render();
        });
    }

    destroy() {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;

        if (this.rafId !== null) {
            window.cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        this.awareness.off('change', this.onAwarenessChange);
        window.removeEventListener('resize', this.onViewportResize);
        window.removeEventListener('scroll', this.onViewportScroll, true);
        this.canvas.remove();
    }

    private readonly onAwarenessChange = () => {
        this.requestRender();
    };

    private readonly onViewportResize = () => {
        this.resizeCanvas();
        this.requestRender();
    };

    private readonly onViewportScroll = () => {
        this.requestRender();
    };

    private resizeCanvas() {
        const width = this.host.clientWidth;
        const height = this.host.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        const scaledWidth = Math.max(1, Math.floor(width * dpr));
        const scaledHeight = Math.max(1, Math.floor(height * dpr));

        if (this.canvas.width === scaledWidth && this.canvas.height === scaledHeight) {
            return;
        }

        this.canvas.width = scaledWidth;
        this.canvas.height = scaledHeight;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    private render() {
        const begin = performance.now();
        this.resizeCanvas();
        const width = this.host.clientWidth;
        const height = this.host.clientHeight;
        const mapping = this.getMapping();

        this.ctx.clearRect(0, 0, width, height);
        if (!mapping || mapping.size === 0) {
            return;
        }

        const hostRect = this.host.getBoundingClientRect();
        const docSize = this.editorView.state.doc.content.size;
        let renderedUsers = 0;

        this.awareness.getStates().forEach((state: unknown, clientId: number) => {
            if (clientId === this.ydoc.clientID) {
                return;
            }

            const record = state as Record<string, unknown>;
            const cursor = (record[this.cursorStateField] ?? null) as CursorAwarenessState | null;
            if (!cursor) {
                return;
            }

            const user = (record.user ?? {}) as UserAwarenessState;
            const color = toHexColor(user.color);
            const name = (user.name ?? `用户 ${clientId}`).trim() || `用户 ${clientId}`;

            const anchorPos = this.resolveAbsolutePosition(cursor.anchor, mapping, docSize);
            const headPos = this.resolveAbsolutePosition(cursor.head, mapping, docSize);
            if (anchorPos === null || headPos === null) {
                return;
            }

            const from = Math.min(anchorPos, headPos);
            const to = Math.max(anchorPos, headPos);

            if (from !== to) {
                const selectionRects = this.getSelectionRects(from, to);
                this.drawSelectionRects(selectionRects, hostRect, color, width, height);
            }

            const caretRect = this.getCaretRect(headPos);
            if (!caretRect) {
                return;
            }
            this.drawCaret(caretRect, hostRect, color, width, height);
            this.drawUserLabel(caretRect, hostRect, color, name, width, height);
            renderedUsers += 1;
        });

        const renderCost = performance.now() - begin;
        this.perfTracker?.record('cursorCanvas.renderMs', renderCost);
        this.perfTracker?.record('cursorCanvas.userCount', renderedUsers);
        if (this.perfLogEnabled && this.perfTracker?.shouldReport('cursorCanvas.renderMs')) {
            console.info('[collab-perf] canvas 光标层采样摘要', {
                renderMs: this.perfTracker.getSummary('cursorCanvas.renderMs'),
                userCount: this.perfTracker.getSummary('cursorCanvas.userCount'),
            });
        }
    }

    private resolveAbsolutePosition(
        relativePosition: unknown,
        mapping: Map<unknown, { nodeSize: number }>,
        docSize: number,
    ) {
        try {
            const absolute = relativePositionToAbsolutePosition(
                this.ydoc,
                this.yXmlFragment,
                Y.createRelativePositionFromJSON(relativePosition),
                mapping as any,
            );
            if (absolute === null) {
                return null;
            }
            return Math.max(0, Math.min(absolute, docSize));
        } catch {
            return null;
        }
    }

    private getCaretRect(pos: number): RectLike | null {
        try {
            const coords = this.editorView.coordsAtPos(pos);
            const width = Math.max(2, Math.abs(coords.right - coords.left));
            const height = Math.max(16, coords.bottom - coords.top);
            return {
                left: coords.left,
                top: coords.top,
                width,
                height,
            };
        } catch {
            return null;
        }
    }

    private getSelectionRects(from: number, to: number): DOMRect[] {
        try {
            const start = this.editorView.domAtPos(from);
            const end = this.editorView.domAtPos(to);
            const range = document.createRange();
            range.setStart(start.node, start.offset);
            range.setEnd(end.node, end.offset);
            return Array.from(range.getClientRects());
        } catch {
            return [];
        }
    }

    private drawSelectionRects(
        rects: DOMRect[],
        hostRect: DOMRect,
        color: string,
        width: number,
        height: number,
    ) {
        if (rects.length === 0) {
            return;
        }

        this.ctx.fillStyle = withAlpha(color, 0.2);
        rects.forEach((rect) => {
            const localLeft = rect.left - hostRect.left;
            const localTop = rect.top - hostRect.top;
            if (
                localLeft + rect.width < 0 ||
                localTop + rect.height < 0 ||
                localLeft > width ||
                localTop > height
            ) {
                return;
            }
            this.ctx.fillRect(localLeft, localTop, rect.width, rect.height);
        });
    }

    private drawCaret(rect: RectLike, hostRect: DOMRect, color: string, width: number, height: number) {
        const localLeft = rect.left - hostRect.left;
        const localTop = rect.top - hostRect.top;
        if (
            localLeft + rect.width < 0 ||
            localTop + rect.height < 0 ||
            localLeft > width ||
            localTop > height
        ) {
            return;
        }

        this.ctx.fillStyle = color;
        this.ctx.fillRect(localLeft - 1, localTop, 2, rect.height);
    }

    private drawUserLabel(
        rect: RectLike,
        hostRect: DOMRect,
        color: string,
        name: string,
        width: number,
        height: number,
    ) {
        const localLeft = rect.left - hostRect.left;
        const localTop = rect.top - hostRect.top;
        if (localLeft > width || localTop > height) {
            return;
        }

        this.ctx.font = '12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
        const labelWidth = this.ctx.measureText(name).width + 8;
        const labelHeight = 18;
        const desiredY = localTop - labelHeight - 4;
        const labelY = desiredY < 0 ? localTop + 2 : desiredY;
        const labelX = Math.max(0, Math.min(localLeft, width - labelWidth));

        this.ctx.fillStyle = color;
        this.ctx.fillRect(labelX, labelY, labelWidth, labelHeight);
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(name, labelX + 4, labelY + 13);
    }
}

function toHexColor(color: unknown): string {
    if (typeof color !== 'string') {
        return '#4caf50';
    }
    const normalized = color.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(normalized)) {
        return normalized;
    }
    return '#4caf50';
}

function withAlpha(hex: string, alpha: number) {
    const safeAlpha = Math.max(0, Math.min(alpha, 1));
    const value = hex.replace('#', '');
    const red = Number.parseInt(value.slice(0, 2), 16);
    const green = Number.parseInt(value.slice(2, 4), 16);
    const blue = Number.parseInt(value.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${safeAlpha})`;
}
