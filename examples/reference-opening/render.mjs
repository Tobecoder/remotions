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
const notes=process.argv.includes('--script-notes'),script=process.argv.includes('--script'),preparation=process.argv.includes('--preparation'),beforeWork=process.argv.includes('--before-work'),firstPoint=process.argv.includes('--first-point'),extended=process.argv.includes('--20s');
const duration=notes?129:script?96:preparation?58:beforeWork?52.5:firstPoint?25:extended?20:10,totalFrames=duration*30;
const compositionId=notes?'Reference-Script-129s':script?'Reference-Script-96s':preparation?'Reference-Preparation':beforeWork?'Reference-Before-Work':firstPoint?'Reference-First-Point':extended?'Reference-Opening-20s':'Reference-Opening-10s';
await mkdir(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(episode,'index.tsx'),publicDir:path.join(episode,'public'),outDir:path.join(out,'bundle')});
const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||path.join(root,'.verification/browser/chrome-headless-shell.exe');
assert(existsSync(browserExecutable));
const browser=await openBrowser('chrome',{browserExecutable});
const errors=[];
const shared={serveUrl,puppeteerInstance:browser,browserExecutable,port:3368,onBrowserLog:log=>{if(log.type==='error')errors.push(log.text);}};
try {
  const compositions=await getCompositions(serveUrl,{puppeteerInstance:browser,port:3368});
  const composition=compositions.find(item=>item.id===compositionId);
  assert(composition);assert.equal(composition.durationInFrames,totalFrames);assert.equal(composition.fps,30);
  const frames=process.argv.includes('--video-only')?[]:notes?[2879,2880,2970,3060,3210,3360,3510,3630,3720,3800,3869]:preparation?[1547,1548,1560,1575,1590,1620,1650,1665,1680,1695,1739]:process.argv.includes('--quick')?(beforeWork?[780,960,1305,1574]:firstPoint?[599,630,720,749]:extended?[299,335,375,599]:[12,99,191,285]):beforeWork?[749,750,780,810,900,960,1020,1065,1155,1230,1305,1410,1470,1515,1530,1563,1574]:firstPoint?[299,314,385,510,548,599,615,630,660,690,711,720,732,749]:extended?[299,300,315,330,345,360,385,405,450,480,520,550,575,599]:[0,12,72,84,96,108,135,150,165,180,191,240,255,263,270,285,299,96];
  const reports=[];let repeat;
  for(let i=0;i<frames.length;i++){
    const frame=frames[i],file=path.join(out,`frame-${frame}${i===frames.length-1&&frame===96?'-repeat':''}.png`);
    await renderStill({...shared,composition,frame,output:file,imageFormat:'png'});
    const png=PNG.sync.read(await readFile(file));assert.equal(png.width,1920);assert.equal(png.height,1080);
    const nonPaper=Array.from({length:png.width*png.height},(_,j)=>png.data[j*4]<140).filter(Boolean).length;
    assert(nonPaper>12000,`Missing scene at frame ${frame}`);
    if(frame===96){if(repeat)assert(repeat.equals(png.data),'Out of order seek changed pixels');else repeat=png.data;}
    reports.push({frame,time:frame/30,nonPaper,file});console.log(`Rendered ${frame}/${totalFrames-1}`);
  }
  let media;
  if(!process.argv.includes('--stills')){
    const video=path.join(out,notes?'reference-script-129s.mp4':script?'reference-script-96s.mp4':preparation?'reference-preparation.mp4':beforeWork?'reference-before-work.mp4':firstPoint?'reference-first-point.mp4':`reference-opening-${duration}s.mp4`);
    await renderMedia({...shared,composition,codec:'h264',crf:18,pixelFormat:'yuv420p',outputLocation:video,concurrency:3,onProgress:({progress})=>{if(progress===1)console.log('MP4 rendered');}});
    const ffprobe=path.join(root,'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');
    media=JSON.parse(execFileSync(ffprobe,['-v','error','-count_frames','-show_entries','stream=codec_name,width,height,r_frame_rate,nb_read_frames,duration','-show_entries','format=duration,size','-of','json',video],{encoding:'utf8'}));
    assert.equal(Number(media.format.duration),duration);assert.equal(Number(media.streams[0].nb_read_frames),totalFrames);
    assert.equal(media.streams[0].width,1920);assert.equal(media.streams[0].height,1080);
  }
  assert.equal(errors.length,0,errors.join('\n'));
  await writeFile(path.join(out,notes?'report-script-notes.json':script?'report-script.json':preparation?'report-preparation.json':beforeWork?'report-before-work.json':firstPoint?'report-first-point.json':extended?'report-20s.json':'report.json'),JSON.stringify({duration,width:1920,height:1080,fps:30,errors,media,frames:reports},null,2));
}finally{await browser.close({silent:true});}
