/**
 * Loader 链：webpack 的「一切皆模块」是靠 loader 把非 JS 转成 JS 实现的。
 *
 * 与 Vite 的区别：webpack 在**构建时**用 loader 把任意文件转成 JS 塞进 bundle；
 * Vite 开发态是**请求时**用插件转换单个文件，直接把 ESM 返给浏览器。
 */
export type Loader = (source: string, filePath: string) => string;

/** 模拟 css-loader：把 CSS 文本变成 JS 模块（导出样式字符串） */
export const cssLoader: Loader = (source) => `export default ${JSON.stringify(source)};`;

/** 模拟 style-loader：接住上游产物，运行时插入 <style> */
export const styleLoader: Loader = (source) => `${source.replace('export default', 'const __css =')}
const __el = document.createElement('style');
__el.textContent = __css;
document.head.appendChild(__el);
export default __css;`;

/** rules 配置：对应 webpack 的 module.rules */
export interface Rule {
  test: RegExp;
  use: Loader[];
}

export const rules: Rule[] = [
  {
    test: /\.css$/,
    // 与 webpack 一致：从右到左执行，cssLoader 先跑，产物交给 styleLoader
    use: [styleLoader, cssLoader],
  },
];

/** 对源码依次跑 loader 链（从右到左，即数组末尾往前） */
export function runLoaders(source: string, filePath: string): string {
  const rule = rules.find((r) => r.test.test(filePath));
  if (!rule) return source;
  return rule.use.reduceRight((code, loader) => loader(code, filePath), source);
}
