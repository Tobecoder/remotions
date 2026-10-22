import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions, openBrowser, renderStill} from '@remotion/renderer';
import {PNG} from 'pngjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.verification/storytelling');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'scripts/verification/StorytellingRender.tsx'), publicDir: path.join(root, 'apps/catalog/public'), outDir: path.join(output, 'bundle')});
const browser = await openBrowser('chrome', {browserExecutable: process.env.REMOTION_BROWSER_EXECUTABLE || undefined});
const port = Number(process.env.REMOTION_VERIFICATION_PORT || 3348);
const report = [];
try {
  const compositions = await getCompositions(serveUrl, {puppeteerInstance: browser, port});
  for (const composition of compositions) {
    const middle = composition.id.startsWith('Speed') ? 12 : Math.floor(composition.durationInFrames * 0.6);
    const frames = composition.id.endsWith('Portrait') ? [middle] : [0, middle, composition.durationInFrames - 1];
    const counts = [];
    for (const frame of frames) {
      const file = path.join(output, `${composition.id}-${frame}.png`);
      await renderStill({serveUrl, composition, port, frame, puppeteerInstance: browser, output: file, imageFormat: 'png'});
      const png = PNG.sync.read(await readFile(file));
      assert.equal(png.width, composition.width);
      assert.equal(png.height, composition.height);
      const bg = composition.id.startsWith('Speed') ? [34, 40, 49] : [237, 242, 244];
      let count = 0;
      for (let index = 0; index < png.data.length; index += 4) {
        if (bg.some((channel, n) => Math.abs(channel - png.data[index + n]) > 20)) count++;
      }
      if (frame === middle) assert(count > 500, `${composition.id}: missing visible content`);
      if (frame === composition.durationInFrames - 1 && !composition.id.startsWith('Messages')) assert(count < 10, `${composition.id}: incomplete exit`);
      counts.push({frame, count});
    }
    report.push({composition: composition.id, counts});
    console.log(`${composition.id}: ${frames.join('/')} verified`);
  }
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
} finally {
  await browser.close({silent: true});
}
