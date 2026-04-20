import { compile } from "../compiler-core/compile";
import { createDomRendererOptions, createRenderer } from "../runtime-core/renderer";

const renderer = createRenderer(createDomRendererOptions(), compile);

export const createApp = renderer.createApp;
