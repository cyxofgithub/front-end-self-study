import { NodeTypes, type RootNode, type TemplateNode } from "./ast";
import { h } from "../runtime-core/h";

type RenderFunction = (ctx: Record<string, unknown>) => ReturnType<typeof h>;

export const generate = (ast: RootNode): RenderFunction => {
  if (ast.children.length !== 1) {
    throw new Error("Template must have exactly one root node.");
  }

  const root = ast.children[0];
  return (ctx) => {
    const renderNode = generateNode(root, ctx);
    return renderNode as ReturnType<typeof h>;
  };
};

const generateNode = (node: TemplateNode, ctx: Record<string, unknown>): unknown => {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return h(
        node.tag,
        null,
        mergeChildren(node.children.map((child) => generateNode(child, ctx)))
      );
    case NodeTypes.TEXT:
      return node.content;
    case NodeTypes.INTERPOLATION:
      return String(resolveExpression(ctx, node.content));
    default:
      return "";
  }
};

const mergeChildren = (children: unknown[]): string | ReturnType<typeof h>[] => {
  if (children.length === 0) {
    return "";
  }

  const hasElement = children.some((child) => typeof child !== "string");
  if (!hasElement) {
    return children.join("");
  }

  return children.map((child) => {
    if (typeof child === "string") {
      return h("span", null, child);
    }
    return child as ReturnType<typeof h>;
  });
};

const resolveExpression = (ctx: Record<string, unknown>, expression: string): unknown => {
  const key = expression.trim();
  if (!key) {
    return "";
  }

  if (key in ctx) {
    return ctx[key];
  }

  throw new Error(`Unknown interpolation variable: ${key}`);
};
