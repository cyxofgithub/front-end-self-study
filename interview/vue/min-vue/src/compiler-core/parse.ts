import { NodeTypes, type ElementNode, type RootNode, type TemplateNode } from "./ast";

interface ParserContext {
  source: string;
}

export const parse = (template: string): RootNode => {
  const context: ParserContext = { source: template.trim() };
  const children = parseChildren(context, []);
  return {
    type: NodeTypes.ROOT,
    children
  };
};

const parseChildren = (context: ParserContext, ancestors: string[]): TemplateNode[] => {
  const nodes: TemplateNode[] = [];

  while (!isEnd(context, ancestors)) {
    const source = context.source;
    let node: TemplateNode;

    if (source.startsWith("{{")) {
      node = parseInterpolation(context);
    } else if (source.startsWith("<") && /[a-z]/i.test(source[1] ?? "")) {
      node = parseElement(context, ancestors);
    } else {
      node = parseText(context);
    }

    nodes.push(node);
  }

  return nodes;
};

const parseElement = (context: ParserContext, ancestors: string[]): ElementNode => {
  const match = /^<([a-z][^\s/>]*)>/i.exec(context.source);
  if (!match) {
    throw new Error(`Invalid element start: ${context.source.slice(0, 20)}`);
  }

  const tag = match[1];
  advanceBy(context, match[0].length);
  ancestors.push(tag);
  const children = parseChildren(context, ancestors);
  ancestors.pop();

  const endTag = `</${tag}>`;
  if (!context.source.startsWith(endTag)) {
    throw new Error(`Missing end tag </${tag}>`);
  }
  advanceBy(context, endTag.length);

  return {
    type: NodeTypes.ELEMENT,
    tag,
    children
  };
};

const parseInterpolation = (context: ParserContext): TemplateNode => {
  const closeIndex = context.source.indexOf("}}", 2);
  if (closeIndex === -1) {
    throw new Error("Interpolation missing closing braces");
  }

  const rawContent = context.source.slice(2, closeIndex).trim();
  advanceBy(context, closeIndex + 2);

  return {
    type: NodeTypes.INTERPOLATION,
    content: rawContent
  };
};

const parseText = (context: ParserContext): TemplateNode => {
  let endIndex = context.source.length;
  const ltIndex = context.source.indexOf("<");
  const interpolationIndex = context.source.indexOf("{{");

  if (ltIndex !== -1 && ltIndex < endIndex) {
    endIndex = ltIndex;
  }
  if (interpolationIndex !== -1 && interpolationIndex < endIndex) {
    endIndex = interpolationIndex;
  }

  const content = context.source.slice(0, endIndex);
  advanceBy(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content
  };
};

const isEnd = (context: ParserContext, ancestors: string[]): boolean => {
  if (!context.source) {
    return true;
  }

  for (let index = ancestors.length - 1; index >= 0; index -= 1) {
    if (context.source.startsWith(`</${ancestors[index]}>`)) {
      return true;
    }
  }
  return false;
};

const advanceBy = (context: ParserContext, numberOfCharacters: number): void => {
  context.source = context.source.slice(numberOfCharacters);
};
