export interface DocumentBlock {
  id: string;
  title: string;
  text: string;
  kind: "paragraph" | "quote" | "checklist";
  expanded: boolean;
}

export interface VisibleRange {
  visibleStart: number;
  visibleEnd: number;
  renderStart: number;
  renderEnd: number;
}
