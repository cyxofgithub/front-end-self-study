import { add } from './foo.js';
import { format } from './util.js';
// 动态 import：拆出一个异步 chunk，等首次需要时再拉取
import('./lazy.js').then(({ lazyRun }) => lazyRun());

const app = document.getElementById('app');
app.innerHTML = `<p>foo.add(1,2) = ${add(1, 2)}</p><p>${format('hello')}</p>`;
