import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions,openBrowser,renderStill,renderMedia} from '@remotion/renderer';
import {PNG} from 'pngjs';

const episode=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(episode,'../..');
const out=path.join(root,'.verification/reference-opening');
await mkdir(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(episode,'index.tsx'),publicDir:path.join(episode,'public'),outDir:path.join(out,'bundle')});
const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||path.join(root,'.verification/browser/chrome-headless-shell.exe');
assert(existsSync(browserExecutable));
const browser=await openBrowser('chrome',{browserExecutable});
const errors=[];
const shared={serveUrl,puppeteerInstance:browser,browserExecutable,port:3368,onBrowserLog:log=>{if(log.type==='error')errors.push(log.text);}};
try {
  const [composition]=await getCompositions(serveUrl,{puppeteerInstance:browser,port:3368});
  assert.equal(composition.durationInFrames,300);assert.equal(composition.fps,30);
  const frames=process.argv.includes('--quick')?[12,99,191,285]:[0,12,72,84,96,108,135,150,165,180,191,240,255,263,270,285,299,96];
  const reports=[];let repeat;
  for(let i=0;i<frames.length;i++){
    const frame=frames[i],file=path.join(out,`frame-${frame}${i===frames.length-1&&frame===96?'-repeat':''}.png`);
    await renderStill({...shared,composition,frame,output:file,imageFormat:'png'});
    const png=PNG.sync.read(await readFile(file));assert.equal(png.width,1920);assert.equal(png.height,1080);
    const nonPaper=Array.from({length:png.width*png.height},(_,j)=>png.data[j*4]<140).filter(Boolean).length;
    assert(nonPaper>12000,`Missing scene at frame ${frame}`);
    if(frame===96){if(repeat)assert(repeat.equals(png.data),'Out of order seek changed pixels');else repeat=png.data;}
    reports.push({frame,time:frame/30,nonPaper,file});console.log(`Rendered ${frame}/299`);
  }
  let media;
  if(!process.argv.includes('--stills')){
    const video=path.join(out,'reference-opening-10s.mp4');
    await renderMedia({...shared,composition,codec:'h264',crf:18,pixelFormat:'yuv420p',outputLocation:video,concurrency:3,onProgress:({progress})=>{if(progress===1)console.log('MP4 rendered');}});
    const ffprobe=path.join(root,'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');
    media=JSON.parse(execFileSync(ffprobe,['-v','error','-count_frames','-show_entries','stream=codec_name,width,height,r_frame_rate,nb_read_frames,duration','-show_entries','format=duration,size','-of','json',video],{encoding:'utf8'}));
    assert.equal(Number(media.format.duration),10);assert.equal(Number(media.streams[0].nb_read_frames),300);
    assert.equal(media.streams[0].width,1920);assert.equal(media.streams[0].height,1080);
  }
  assert.equal(errors.length,0,errors.join('\n'));
  await writeFile(path.join(out,'report.json'),JSON.stringify({duration:10,width:1920,height:1080,fps:30,errors,media,frames:reports},null,2));
}finally{await browser.close({silent:true});}
