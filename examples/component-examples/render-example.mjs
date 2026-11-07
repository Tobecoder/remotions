import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {copyFile,mkdir,readFile,stat,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions,openBrowser,renderMedia,renderStill} from '@remotion/renderer';

export const renderExample=async(folderUrl)=>{
  const folder=fileURLToPath(folderUrl),root=path.resolve(folder,'../../..');
  const example=JSON.parse(await readFile(path.join(folder,'example.json'),'utf8'));
  const work=path.join(root,'.verification/component-examples',example.id),publicRoot=path.join(root,'apps/catalog/public');
  await mkdir(work,{recursive:true});
  const outputPath=url=>{
    assert(url.startsWith('/examples/'));
    const target=path.resolve(publicRoot,`.${url}`);
    assert(target.startsWith(publicRoot+path.sep));
    return target;
  };
  const video=outputPath(example.preview.video),poster=outputPath(example.preview.poster),guide=outputPath(example.preview.guide);
  await mkdir(path.dirname(video),{recursive:true});
  const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||path.join(root,'.verification/browser/chrome-headless-shell.exe');
  assert(existsSync(browserExecutable),'Set REMOTION_BROWSER_EXECUTABLE to the local headless Chrome executable');
  const serveUrl=await bundle({entryPoint:path.join(folder,'index.tsx'),outDir:path.join(work,'bundle')});
  const browser=await openBrowser('chrome',{browserExecutable});
  const errors=[];
  try{
    const compositions=await getCompositions(serveUrl,{puppeteerInstance:browser});
    const composition=compositions.find(item=>item.id===example.composition.id);
    assert(composition);
    for(const key of ['width','height','fps','durationInFrames'])assert.equal(composition[key],example.composition[key]);
    const shared={serveUrl,composition,puppeteerInstance:browser,browserExecutable,onBrowserLog:log=>{if(log.type==='error')errors.push(log.text);}};
    await renderStill({...shared,frame:example.composition.posterFrame,output:poster,imageFormat:'jpeg',jpegQuality:90});
    let reported=-1;
    await renderMedia({...shared,outputLocation:video,codec:'h264',crf:20,pixelFormat:'yuv420p',concurrency:2,onProgress:({progress})=>{
      const step=Math.floor(progress*4);if(step!==reported){reported=step;console.log(`Preview rendering ${Math.round(progress*100)}%`);}
    }});
    assert.deepEqual(errors,[]);
    await copyFile(path.join(folder,'README.md'),guide);
    const compositor=path.join(root,'node_modules/@remotion/compositor-win32-x64-msvc');
    const media=JSON.parse(execFileSync(path.join(compositor,'ffprobe.exe'),['-v','error','-count_frames','-show_entries','stream=codec_type,width,height,r_frame_rate,nb_read_frames:format=duration,size','-of','json',video],{encoding:'utf8'}));
    const stream=media.streams.find(item=>item.codec_type==='video');
    assert(stream);
    assert.equal(Number(stream.nb_read_frames),composition.durationInFrames);
    assert.equal(stream.width,composition.width);assert.equal(stream.height,composition.height);
    assert.equal(Number(media.format.duration),composition.durationInFrames/composition.fps);
    const [numerator,denominator]=stream.r_frame_rate.split('/').map(Number);assert.equal(numerator/denominator,composition.fps);
    execFileSync(path.join(compositor,'ffmpeg.exe'),['-v','error','-i',video,'-c:v','rawvideo','-f','null','-'],{stdio:'pipe'});
    const posterInfo=JSON.parse(execFileSync(path.join(compositor,'ffprobe.exe'),['-v','error','-show_entries','stream=width,height','-of','json',poster],{encoding:'utf8'}));
    assert.equal(posterInfo.streams[0].width,composition.width);assert.equal(posterInfo.streams[0].height,composition.height);
    assert((await stat(poster)).size>0);
    await writeFile(path.join(work,'render-report.json'),JSON.stringify({exampleId:example.id,source:example.source.implementation,media,poster,errors,visualReview:'pending'},null,2));
    console.log(JSON.stringify({video,poster,frames:composition.durationInFrames,seconds:Number(media.format.duration),bytes:Number(media.format.size)}));
  }finally{
    await browser.close({silent:true});
  }
};
