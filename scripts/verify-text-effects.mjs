import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions, openBrowser, renderStill} from '@remotion/renderer';
import {PNG} from 'pngjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.verification/text-effects');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'scripts/verification/TextEffectsRender.tsx'), publicDir: path.join(root, 'apps/catalog/public'), outDir: path.join(output, 'bundle')});
const browser = await openBrowser('chrome', {browserExecutable: process.env.REMOTION_BROWSER_EXECUTABLE || undefined, chromiumOptions: {gl: 'angle'}});
const port = Number(process.env.REMOTION_VERIFICATION_PORT || 3349);
const report = [];
try {
  const compositions = await getCompositions(serveUrl, {puppeteerInstance: browser, port});
  for (const composition of compositions) {
    const cylinder = composition.id.startsWith('Cylinder');
    const frames = composition.durationInFrames === 1 ? [0] : composition.id.endsWith('Portrait') ? [60] : cylinder ? [0, 45, 179, 180] : [0, 25, 70, 119];
    const counts = [];
    const images = [];
    for (const frame of frames) {
      const file = path.join(output, `${composition.id}-${frame}.png`);
      await renderStill({serveUrl, composition, port, frame, puppeteerInstance: browser, output: file, imageFormat: 'png'});
      const png = PNG.sync.read(await readFile(file));
      assert.equal(png.width, composition.width);
      assert.equal(png.height, composition.height);
      let count = 0;
      for (let i = 0; i < png.data.length; i += 4) if ([237, 242, 244].some((channel, n) => Math.abs(channel - png.data[i + n]) > 25)) count++;
      assert(count > 100, `${composition.id} frame ${frame}: missing visible text`);
      counts.push({frame, count});
      images.push(png);
    }
    if (cylinder && !composition.id.endsWith('Portrait')) {
      let changed = 0;
      for (let i = 0; i < images[0].data.length; i += 4) if (Math.abs(images[0].data[i] - images[3].data[i]) > 5) changed++;
      assert(changed < 50, `${composition.id}: first/full-cycle pixels differ (${changed})`);
      assert(!images[0].data.equals(images[1].data), 'Cylinder did not rotate');
    }
    report.push({composition: composition.id, counts});
    await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log(`${composition.id}: ${frames.join('/')} verified`);
  }
} finally {
  await browser.close({silent: true});
}
