import { format } from './util.js';

export function lazyRun() {
  console.log('[lazy]', format('async loaded'));
}
