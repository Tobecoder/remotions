import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {copyFile,mkdir,readFile,unlink,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions,openBrowser,renderStill,renderMedia} from '@remotion/renderer';
import {PNG} from 'pngjs';

const episode=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(episode,'../..');
const out=path.join(root,'.verification/reference-opening');
const segmentOptions=JSON.parse(await readFile(path.join(episode,'segments.json'),'utf8'));
const segmentArg=process.argv.indexOf('--segment');
const segmentId=segmentArg===-1?null:process.argv[segmentArg+1];
const exportSegments=segmentArg!==-1||process.argv.includes('--segments');
if(segmentArg!==-1)assert(segmentOptions.some(segment=>segment.id===segmentId),`Unknown segment: ${segmentId}. Available: ${segmentOptions.map(segment=>segment.id).join(', ')}`);
const planning=process.argv.includes('--script-planning'),notes=process.argv.includes('--script-notes'),script=process.argv.includes('--script'),preparation=process.argv.includes('--preparation'),beforeWork=process.argv.includes('--before-work'),firstPoint=process.argv.includes('--first-point'),extended=process.argv.includes('--20s');
const comparison=process.argv.includes('--model-comparison');
const modelClip=process.argv.includes('--model-clip');
const pitfalls=process.argv.includes('--script-pitfalls');
const principles=process.argv.includes('--script-principles');
const closing=process.argv.includes('--script-closing');
const materials=process.argv.includes('--material-collection');
const duration=materials?203:closing?180:principles?159.5:pitfalls?153:modelClip?5:comparison?139.5:planning?134:notes?129:script?96:preparation?58:beforeWork?52.5:firstPoint?25:extended?20:10,totalFrames=duration*30;
const compositionId=materials?'Reference-Material-203s':closing?'Reference-Script-180s':principles?'Reference-Script-159-5s':pitfalls?'Reference-Script-153s':modelClip?'Model-Comparison-Clip':comparison?'Reference-Script-139-5s':planning?'Reference-Script-134s':notes?'Reference-Script-129s':script?'Reference-Script-96s':preparation?'Reference-Preparation':beforeWork?'Reference-Before-Work':firstPoint?'Reference-First-Point':extended?'Reference-Opening-20s':'Reference-Opening-10s';
await mkdir(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(episode,'render-root.tsx'),publicDir:path.join(episode,'public'),outDir:path.join(out,'bundle')});
const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||path.join(root,'.verification/browser/chrome-headless-shell.exe');
assert(existsSync(browserExecutable));
const browser=await openBrowser('chrome',{browserExecutable});
const errors=[];
const shared={serveUrl,puppeteerInstance:browser,browserExecutable,port:3368,onBrowserLog:log=>{if(log.type==='error')errors.push(log.text);}};
const renderVideo=async(composition,video)=>{
  await renderMedia({...shared,composition,codec:'h264',crf:18,pixelFormat:'yuv420p',outputLocation:video,concurrency:3});
  const ffprobe=path.join(root,'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');
  const media=JSON.parse(execFileSync(ffprobe,['-v','error','-count_frames','-show_entries','stream=codec_name,width,height,r_frame_rate,nb_read_frames,duration','-show_entries','format=duration,size','-of','json',video],{encoding:'utf8'}));
  assert(Math.abs(Number(media.format.duration)-composition.durationInFrames/composition.fps)<=.001,'Encoded duration differs by more than container millisecond rounding');
  assert.equal(Number(media.streams[0].nb_read_frames),composition.durationInFrames);
  assert.equal(media.streams[0].width,composition.width);
  assert.equal(media.streams[0].height,composition.height);
  assert.equal(errors.length,0,errors.join('\n'));
  console.log(`Rendered ${path.basename(video)}`);
  return media;
};

const renderSegments=async(compositions)=>{
  const segmentOut=path.join(out,'segments');
  await mkdir(segmentOut,{recursive:true});
  const original=compositions.find(item=>item.id==='Reference-Narration');
  assert(original);
  const report=[];
  const baselinePath=path.join(segmentOut,'source-check.png');
  try {
    for(const [index,{id,endFrame}] of segmentOptions.entries()){
      if(segmentId&&id!==segmentId)continue;
      const startFrame=segmentOptions[index-1]?.endFrame??0;
      const composition=compositions.find(item=>item.id===id);
      assert(composition);
      assert.equal(composition.fps,original.fps);
      assert.equal(composition.durationInFrames,endFrame-startFrame);
      const checkpoints=[];
      if(!process.argv.includes('--video-only')){
        for(const frame of [0,Math.floor(composition.durationInFrames/2),composition.durationInFrames-1]){
          const sourceFrame=startFrame+frame;
          const segmentPath=path.join(segmentOut,`${id}-frame-${frame}.png`);
          await renderStill({...shared,composition,frame,output:segmentPath,imageFormat:'png'});
          await renderStill({...shared,composition:original,frame:sourceFrame,output:baselinePath,imageFormat:'png'});
          const local=PNG.sync.read(await readFile(segmentPath));
          const baseline=PNG.sync.read(await readFile(baselinePath));
          assert.equal(local.width,baseline.width);
          assert.equal(local.height,baseline.height);
          if(!local.data.equals(baseline.data))await copyFile(baselinePath,path.join(segmentOut,`${id}-source-${sourceFrame}.png`));
          assert(local.data.equals(baseline.data),`${id} frame ${frame} differs from source frame ${sourceFrame}`);
          checkpoints.push({frame,sourceFrame});
        }
      }
      const media=process.argv.includes('--stills')?undefined:await renderVideo(composition,path.join(segmentOut,`${id}.mp4`));
      report.push({id,startFrame,endFrame,durationInFrames:composition.durationInFrames,checkpoints,media});
      console.log(`Verified ${id}: ${composition.durationInFrames} frames, ${checkpoints.length} matched stills`);
    }
    assert.equal(errors.length,0,errors.join('\n'));
    await writeFile(path.join(segmentOut,segmentId?`report-${segmentId}.json`:'report.json'),JSON.stringify({fps:original.fps,errors,segments:report},null,2));
  } finally {
    if(existsSync(baselinePath))await unlink(baselinePath);
  }
};

const renderLegacy=async(compositions)=>{
  const composition=compositions.find(item=>item.id===compositionId);
  assert(composition);assert.equal(composition.durationInFrames,totalFrames);assert.equal(composition.fps,30);
  const {width,height}=composition;
  const frames=process.argv.includes('--video-only')?[]:materials?[5399,5400,5480,5544,5550,5556,5562,5570,5583,5619,5635,5645,5655,5668,5676,5685,5740,5845,5940,6010,6060,6089,5645]:closing?[4784,4785,4806,4850,4915,4950,5005,5065,5150,5235,5280,5360,5399,5005]:principles?[4589,4590,4596,4605,4653,4690,4710,4740,4758,4770,4784,4605]:pitfalls?[4184,4185,4192,4215,4280,4347,4416,4468,4500,4556,4589]:modelClip?[0,18,44,72,110,144]:comparison?[3765,3774,3784,3788,3792,3808,3869,3894,3930,3962,3965,3975,4019,4020,4035,4044,4077,4110,4143,4184]:planning?[3869,3894,3930,3962,3965,3975,3990,4019]:notes?[2879,2880,2970,3060,3210,3360,3510,3630,3720,3765,3774,3784,3788,3792,3808,3869]:preparation?[1547,1548,1560,1575,1590,1620,1650,1665,1680,1695,1739]:process.argv.includes('--quick')?(beforeWork?[780,960,1305,1574]:firstPoint?[599,630,720,749]:extended?[299,335,375,599]:[12,99,191,285]):beforeWork?[749,750,780,810,900,960,1020,1065,1155,1230,1305,1410,1470,1515,1530,1563,1574]:firstPoint?[299,314,385,510,548,599,615,630,660,690,711,720,732,749]:extended?[299,300,315,330,345,360,385,405,450,480,520,550,575,599]:[0,12,72,84,96,108,135,150,165,180,191,240,255,263,270,285,299,96];
  const reports=[];let repeat;
  for(let i=0;i<frames.length;i++){
    const frame=frames[i],file=path.join(out,`${modelClip?'model-clip-frame':'frame'}-${frame}${i===frames.length-1&&frame===96?'-repeat':''}.png`);
    await renderStill({...shared,composition,frame,output:file,imageFormat:'png'});
    const png=PNG.sync.read(await readFile(file));assert.equal(png.width,width);assert.equal(png.height,height);
    const nonPaper=Array.from({length:png.width*png.height},(_,j)=>png.data[j*4]<140).filter(Boolean).length;
    assert(nonPaper>(modelClip?2000:12000),`Missing scene at frame ${frame}`);
    if(frame===96){if(repeat)assert(repeat.equals(png.data),'Out of order seek changed pixels');else repeat=png.data;}
    reports.push({frame,time:frame/30,nonPaper,file});console.log(`Rendered ${frame}/${totalFrames-1}`);
  }
  let media;
  if(!process.argv.includes('--stills')){
    const video=path.join(out,materials?'reference-material-203s.mp4':closing?'reference-script-180s.mp4':principles?'reference-script-159-5s.mp4':pitfalls?'reference-script-153s.mp4':modelClip?'model-comparison-clip.mp4':comparison?'reference-script-139-5s.mp4':planning?'reference-script-134s.mp4':notes?'reference-script-129s.mp4':script?'reference-script-96s.mp4':preparation?'reference-preparation.mp4':beforeWork?'reference-before-work.mp4':firstPoint?'reference-first-point.mp4':`reference-opening-${duration}s.mp4`);
    media=await renderVideo(composition,video);
    if(modelClip)await copyFile(video,path.join(episode,'public/model-comparison/demo.mp4'));
  }
  assert.equal(errors.length,0,errors.join('\n'));
  await writeFile(path.join(out,materials?'report-material-collection.json':closing?'report-script-closing.json':principles?'report-script-principles.json':pitfalls?'report-script-pitfalls.json':modelClip?'report-model-clip.json':comparison?'report-model-comparison.json':planning?'report-script-planning.json':notes?'report-script-notes.json':script?'report-script.json':preparation?'report-preparation.json':beforeWork?'report-before-work.json':firstPoint?'report-first-point.json':extended?'report-20s.json':'report.json'),JSON.stringify({duration,width,height,fps:30,errors,media,frames:reports},null,2));
};

try {
  const compositions=await getCompositions(serveUrl,{puppeteerInstance:browser,port:3368});
  if(exportSegments)await renderSegments(compositions);
  else await renderLegacy(compositions);
}finally{await browser.close({silent:true});}
