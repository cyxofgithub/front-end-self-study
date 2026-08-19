import { add } from './foo.js';
import { format } from './util.js';

const app = document.getElementById('app');
app.innerHTML = `<p>foo.add(1,2) = ${add(1, 2)}</p><p>${format('hello')}</p>`;
