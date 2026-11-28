import {fileURLToPath} from 'node:url';
import {renderExample} from '../render-example.mjs';

await renderExample(new URL('.',import.meta.url),{
  publicDir:fileURLToPath(new URL('../../reference-opening/public',import.meta.url)),
  port:3377,
});
