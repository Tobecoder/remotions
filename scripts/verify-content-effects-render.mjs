import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';
import {bundle} from '@remotion/bundler';
import {getCompositions, getVideoMetadata, openBrowser, renderMedia, renderStill, RenderInternals} from '@remotion/renderer';
import {PNG} from 'pngjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.verification/content-effects');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'scripts/verification/ContentEffectsRender.tsx'), outDir: path.join(output, 'bundle')});
const browser = await openBrowser('chrome', {
  browserExecutable: process.env.REMOTION_BROWSER_EXECUTABLE || undefined,
  chromiumOptions: {gl: 'angle'},
});
const results = [];
const run = promisify(execFile);
const ffmpeg = RenderInternals.getExecutablePath({type: 'ffmpeg', indent: false, logLevel: 'error', binariesDirectory: null});
try {
  // Keep the renderer away from the catalog's localhost:3000 development server.
  const port = Number(process.env.REMOTION_VERIFICATION_PORT || 3347);
  const compositions = await getCompositions(serveUrl, {puppeteerInstance: browser, port});
  for (const composition of compositions) {
    console.log(`Rendering ${composition.id} (${composition.durationInFrames} frames)...`);
    const outputLocation = path.join(output, `${composition.id}.mp4`);
    const common = {serveUrl, composition, puppeteerInstance: browser, port};
    await renderMedia({...common, codec: 'h264', outputLocation, concurrency: 1, timeoutInMilliseconds: 60000});
    const frames = [0, Math.floor(composition.durationInFrames / 2), composition.durationInFrames - 1];
    const coloredPixelCounts = [];
    for (const frame of frames) {
      await renderStill({...common, frame, output: path.join(output, `${composition.id}-${frame}.png`), imageFormat: 'png', timeoutInMilliseconds: 60000});
      // Decode the encoded MP4 too: fresh stills alone cannot prove its first frame is present.
      const seek = ['-hide_banner', '-loglevel', 'error', '-i', outputLocation, '-ss', String(frame / composition.fps), '-frames:v', '1'];
      const decodedPath = path.join(output, `${composition.id}-mp4-${frame}.png`);
      await run(ffmpeg, [...seek, '-y', decodedPath]);
      const {data, width, height} = PNG.sync.read(await readFile(decodedPath));
      assert.equal(width, composition.width);
      assert.equal(height, composition.height);
      let coloredPixels = 0;
      for (let pixel = 0; pixel < data.length; pixel += 4) {
        if (data[pixel + 2] - data[pixel] > 20) coloredPixels++;
      }
      coloredPixelCounts.push(coloredPixels);
    }
    const metadata = await getVideoMetadata(outputLocation);
    assert.equal(metadata.width, composition.width);
    assert.equal(metadata.height, composition.height);
    assert(Math.abs(metadata.durationInSeconds - composition.durationInFrames / composition.fps) < 0.05);
    assert(coloredPixelCounts[0] > 10000, `${composition.id}: blank encoded first frame`);
    assert(coloredPixelCounts[1] > 1000, `${composition.id}: missing middle-frame content`);
    if (composition.id === 'Peel') assert(coloredPixelCounts[2] < 100, 'Peel did not exit');
    else assert(coloredPixelCounts[2] > 10000, `${composition.id}: missing final content`);
    results.push({id: composition.id, frames, coloredPixelCounts, metadata});
    console.log(`${composition.id}: MP4 and first/middle/last PNGs exported.`);
  }
  await writeFile(path.join(output, 'report.json'), JSON.stringify(results, null, 2));
} finally {
  await browser.close({silent: true});
}
