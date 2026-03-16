export enum NodeTypes {
  ROOT = "ROOT",
  ELEMENT = "ELEMENT",
  TEXT = "TEXT",
  INTERPOLATION = "INTERPOLATION"
}

export interface RootNode {
  type: NodeTypes.ROOT;
  children: TemplateNode[];
}

export interface ElementNode {
  type: NodeTypes.ELEMENT;
  tag: string;
  children: TemplateNode[];
}

export interface TextNode {
  type: NodeTypes.TEXT;
  content: string;
}

export interface InterpolationNode {
  type: NodeTypes.INTERPOLATION;
  content: string;
}

export type TemplateNode = ElementNode | TextNode | InterpolationNode;
