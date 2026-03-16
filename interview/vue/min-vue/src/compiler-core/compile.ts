import type { VNode } from "../runtime-core/vnode";
import { generate } from "./codegen";
import { parse } from "./parse";

export const compile = (template: string): ((ctx: Record<string, unknown>) => VNode) => {
  const ast = parse(template);
  const render = generate(ast);
  return (ctx: Record<string, unknown>) => render(ctx);
};
