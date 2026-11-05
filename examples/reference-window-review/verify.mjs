import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions, openBrowser, renderStill} from '@remotion/renderer';
import {PNG} from 'pngjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, '.verification/reference-window');
await mkdir(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'examples/reference-window-review/index.tsx'), publicDir: path.join(root, 'apps/catalog/public'), outDir: path.join(out, 'bundle')});
const browserFile = path.join(root, '.verification/browser/chrome-headless-shell.exe');
const browser = await openBrowser('chrome', {browserExecutable: process.env.REMOTION_BROWSER_EXECUTABLE || (existsSync(browserFile) ? browserFile : undefined)});
const report = [];
try {
  const compositions = new Map();
  const states = [['document', 0], ['document', 12], ['document', 30], ['document', 50], ['document', 75], ['document', 95], ['document', 120], ['document', 239], ['code', 120], ['document', 30]];
  let restingHash, firstThirtyHash;
  for (let i = 0; i < states.length; i++) {
    const [example, frame] = states[i];
    if (!compositions.has(example)) {
      const [composition] = await getCompositions(serveUrl, {inputProps: {example}, puppeteerInstance: browser, port: 3360});
      compositions.set(example, composition);
    }
    const composition = compositions.get(example);
    let probe;
    const prefix = 'WINDOW_REVIEW:';
    const file = path.join(out, `${example}-${frame}${i === states.length - 1 ? '-repeat' : ''}.png`);
    await renderStill({serveUrl, composition, inputProps: {example}, frame, puppeteerInstance: browser, port: 3360, output: file, imageFormat: 'png', onBrowserLog: (log) => {if (log.text.startsWith(prefix)) probe = JSON.parse(log.text.slice(prefix.length));}});
    assert(probe && probe.frame === frame);
    assert(probe.card.x >= 0 && probe.card.y >= 0);
    assert(probe.card.x + probe.card.width <= 1281 && probe.card.y + probe.card.height <= 721);
    assert(Math.abs(probe.card.width / probe.card.height - 1440 / 760) < 0.001);
    assert(probe.highlight.x >= 0 && probe.highlight.y >= 0);
    assert(probe.highlight.x + probe.highlight.width <= probe.card.width + 1);
    assert(probe.highlight.y + probe.highlight.height <= probe.card.height + 1);
    if (frame <= 30) assert.equal(probe.markOpacity, 0);
    if (frame >= 75) assert.equal(probe.markOpacity, 1);
    const png = PNG.sync.read(await readFile(file));
    assert.equal(png.width, 1280); assert.equal(png.height, 720);
    const hash = createHash('sha256').update(png.data).digest('hex');
    if (example === 'document' && frame === 120) restingHash = hash;
    if (example === 'document' && frame === 239) assert.equal(hash, restingHash, 'The held final image should not move or loop backwards');
    if (example === 'code') assert.notEqual(hash, restingHash, 'Replacement screenshot did not render');
    if (example === 'document' && frame === 30) {if (firstThirtyHash) assert.equal(hash, firstThirtyHash); else firstThirtyHash = hash;}
    report.push({example, ...probe, hash, file: path.basename(file)});
    console.log(`${example} frame ${frame}: bounds, aspect, focus and deterministic output passed`);
  }
  await writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
} finally {await browser.close({silent: true});}
