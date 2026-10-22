import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions,openBrowser,renderStill} from '@remotion/renderer';
import {PNG} from 'pngjs';

const episode=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(episode,'../..');
const out=path.join(root,'.verification/dp-intro');
const timing=JSON.parse(await readFile(path.join(episode,'timing.json'),'utf8'));
const wav=await readFile(path.join(episode,'public/audio/narration.wav'));
assert.equal(createHash('sha256').update(wav).digest('hex'),timing.audioSha256);
assert.equal(timing.scenes.length,8);
assert.equal(timing.cues.length,70);
for(const [i,scene] of timing.scenes.entries()) {
  assert.equal(scene.startFrame,i ? timing.scenes[i-1].endFrame : 0);
  assert.equal(scene.endFrame-scene.startFrame,scene.durationInFrames);
}
for(const [i,cue] of timing.cues.entries()) {
  assert(cue.end>cue.start && cue.end<=timing.durationInSeconds);
  if(i) assert(cue.start>=timing.cues[i-1].end);
}
const results=['等于二','等于三','等于五'].map((text,index)=>{
  const cue=timing.cues.find(c=>c.scene===5 && c.text.includes(text));
  const mark=timing.wordMarks.find(m=>m.cue===cue.id && m.characterPosition+m.characterCount>cue.spoken.indexOf(text)+2);
  assert(mark,'Missing actual word timing');
  return {frame:Math.round(mark.audioSeconds*30),index:index+2,value:String([2,3,5][index])};
});
await mkdir(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(episode,'verify-entry.tsx'),publicDir:path.join(episode,'public'),outDir:path.join(out,'bundle')});
const cachedBrowser=path.join(root,'.verification/browser/chrome-headless-shell.exe');
const browser=await openBrowser('chrome',{browserExecutable:process.env.REMOTION_BROWSER_EXECUTABLE || (existsSync(cachedBrowser)?cachedBrowser:undefined)});
const report=[];
try {
  const [composition]=await getCompositions(serveUrl,{puppeteerInstance:browser,port:3356});
  assert.equal(composition.durationInFrames,timing.durationInFrames);
  const frames=[...new Set([...timing.scenes.map(s=>s.endFrame-35),...results.flatMap(r=>[r.frame-1,r.frame]),timing.durationInFrames-1,4200,5070])].sort((a,b)=>a-b);
  for(const frame of frames) {
    let probe;
    const file=path.join(out,`frame-${frame}.png`);
    await renderStill({serveUrl,composition,frame,puppeteerInstance:browser,port:3356,output:file,imageFormat:'png',onBrowserLog:log=>{
      if(log.text.startsWith('DP_VERIFY:')) probe=JSON.parse(log.text.slice(10));
    }});
    assert(probe,`No browser probe for frame ${frame}`);
    assert(probe.checks.length>=2);
    assert(!probe.checks.some(c=>c.clipped),`Clipped text at ${frame}: ${JSON.stringify(probe.checks)}`);
    for(const result of results) {
      if(frame===result.frame-1) assert.equal(probe.values[result.index],'?','Answer appeared before its spoken word');
      if(frame===result.frame) assert.equal(probe.values[result.index],result.value,'Answer did not appear at its spoken word');
    }
    const png=PNG.sync.read(await readFile(file));
    assert.equal(png.width,1920); assert.equal(png.height,1080);
    let visible=0;
    for(let i=0;i<png.data.length;i+=4) if(Math.abs(png.data[i]-246)+Math.abs(png.data[i+1]-245)+Math.abs(png.data[i+2]-240)>80) visible++;
    assert(visible>1000,`Empty scene at ${frame}`);
    report.push({...probe,visible,file:path.basename(file)});
    console.log(`Frame ${frame}: visible content, text bounds, narration timing passed`);
  }
  await writeFile(path.join(out,'report.json'),JSON.stringify({audioSha256:timing.audioSha256,durationInFrames:timing.durationInFrames,report},null,2));
} finally {await browser.close({silent:true});}
