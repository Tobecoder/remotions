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
const output=path.join(root,'.verification/dp-last-step');
const timing=JSON.parse(await readFile(path.join(episode,'timing.json'),'utf8'));
assert.equal(timing.durationInFrames,600);assert.equal(timing.sampleCount,320000);
assert.equal(createHash('sha256').update(await readFile(path.join(episode,'public/audio/narration.wav'))).digest('hex'),timing.audioSha256);
assert(timing.spokenEndSeconds<20 && timing.tailHoldSeconds>=2);
const anchor=(i,needle)=>{
  const cue=timing.cues[i],position=cue.spoken.indexOf(needle);
  assert(position>=0);
  const mark=timing.wordMarks.find(m=>m.cue===cue.id&&m.characterPosition+m.characterCount>position);
  assert(mark);return Math.round(mark.audioSeconds*30);
};
const goldJump=anchor(1,'走一步'),blueJump=anchor(2,'走两步'),five=anchor(3,'五');
const goldEnd=goldJump+27+6,blueEnd=blueJump+33+3;
await mkdir(output,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(episode,'verify-entry.tsx'),publicDir:path.join(episode,'public'),outDir:path.join(output,'bundle')});
const browserFile=path.join(root,'.verification/browser/chrome-headless-shell.exe');
const chromiumOptions={gl:'angle'};
const browser=await openBrowser('chrome',{browserExecutable:process.env.REMOTION_BROWSER_EXECUTABLE||(existsSync(browserFile)?browserFile:undefined),chromiumOptions});
const reports=[];
try{
  const [composition]=await getCompositions(serveUrl,{puppeteerInstance:browser,chromiumOptions,port:3358});
  const frames=[0,90,170,goldJump+14,goldEnd,blueJump+15,blueEnd,five-1,five+15,599,goldJump+14];
  let repeat;
  for(let i=0;i<frames.length;i++){
    const frame=frames[i];let report;
    const errors=[];
    const file=path.join(output,`frame-${frame}${i===frames.length-1?'-repeat':''}.png`);
    await renderStill({serveUrl,composition,frame,puppeteerInstance:browser,chromiumOptions,port:3358,output:file,imageFormat:'png',onBrowserLog:log=>{
      if(log.text.startsWith('DP20_REPORT:')) report=JSON.parse(log.text.slice(12));
      if(log.type==='error')errors.push(log.text);
    }});
    assert(report&&report.frame===frame,`Missing layout report at ${frame}`);
    assert(!report.checks.some(c=>c.clipped),`Text clipping: ${JSON.stringify(report.checks.filter(c=>c.clipped))}`);
    assert(report.canvas,'Three.js canvas missing');
    assert.equal(report.fiveOpacity>0,frame>five,'Answer should follow its actual spoken word');
    if(frame===goldEnd)assert.equal(report.arrived,3);
    if(frame===blueEnd||frame===599)assert.equal(report.arrived,5);
    if(frame===0||frame===90)assert.equal(report.arrived,0);
    assert.equal(errors.length,0,errors.join('\n'));
    const png=PNG.sync.read(await readFile(file));
    assert.equal(png.width,1920);assert.equal(png.height,1080);
    let goldPixels=0,bluePixels=0;
    for(let j=0;j<png.data.length;j+=4){const [r,g,b]=png.data.subarray(j,j+3);if(r>g*1.18&&g>b*1.25&&r>110)goldPixels++;if(b>r*1.13&&g>r*1.12&&b>70)bluePixels++;}
    if(frame===goldEnd)assert(goldPixels>300,'Golden 3D tokens not visible');
    if(frame===blueEnd)assert(bluePixels>300,'Blue 3D tokens not visible');
    const hash=createHash('sha256').update(png.data).digest('hex');
    if(frame===goldJump+14){if(repeat)assert.equal(hash,repeat,'Reverse seek changed pixels');else repeat=hash;}
    reports.push({...report,goldPixels,bluePixels,hash,file:path.basename(file)});
    console.log(`Frame ${frame}: 3D canvas, text bounds, arrivals and voice sync passed.`);
  }
  await writeFile(path.join(output,'report.json'),JSON.stringify({duration:20,narrationEnd:timing.spokenEndSeconds,frames:reports},null,2));
}finally{await browser.close({silent:true});}
