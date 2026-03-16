import { add } from './foo.js';
import { capitalize } from 'lodash-es';

const app = document.getElementById('app');
app.innerHTML = `<p>foo.add(1,2) = ${add(1, 2)}</p><p>lodash-es: ${capitalize('hello')}</p>`;
