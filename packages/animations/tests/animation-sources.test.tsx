/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect,vi} from 'vitest';
const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
 useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1920,height:1080}),staticFile:(file:string)=>file,
 AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>,Img:({src,style}:{src:string;style:CSSProperties})=><img src={src} style={style}/>,OffthreadVideo:({src}:{src:string})=><video src={src}/>,
 Sequence:({children,from=0,durationInFrames=Infinity}:{children:ReactNode;from:number;durationInFrames:number})=>clock.frame>=from&&clock.frame<from+durationInFrames?<div data-video-from={from}>{children}</div>:null,
 Loop:({children}:{children:ReactNode})=><>{children}</>,
}));
import {AnimationSourcesFilm} from '../../../examples/reference-opening/AnimationSourcesScene';
import {EditorWalkthroughFilm} from '../../../examples/reference-opening/EditorWalkthroughScene';
import {NarrationFilm} from '../../../examples/reference-opening/NarrationScene';
import {ResourceCredits} from '../../../examples/reference-opening/compositions/ResourceCredits';
import segments from '../../../examples/reference-opening/segments.json';
const at=(frame:number)=>{clock.frame=frame;return new DOMParser().parseFromString(renderToStaticMarkup(<AnimationSourcesFilm/>),'text/html');};
describe('animation sources and chapter closing',()=>{
 it('preserves the earlier film and all ten prior cut points',()=>{
  for(const frame of [0,6706,7333,7880,8045]){clock.frame=frame;expect(renderToStaticMarkup(<AnimationSourcesFilm/>)).toBe(renderToStaticMarkup(<EditorWalkthroughFilm/>));}
  expect(segments.slice(0,10).map(s=>s.endFrame)).toEqual([750,1740,2880,3870,4785,5400,6090,6706,7333,8046]);expect(segments[10]).toEqual({id:'11-Animation-Sources',endFrame:8733});
 });
 it('fades the prior shot and reveals code before the model comparison',()=>{
  const outgoing=at(8050).querySelector('[data-sources-outgoing]')!;
  expect(outgoing.querySelector('[data-editor-walkthrough-scene]')).not.toBeNull();
  expect(outgoing.querySelector('img[src="animation-sources/editor-screen-last.png"]')).not.toBeNull();
  expect(outgoing.textContent).toContain('HEVC (Alpha)');
  expect(outgoing.textContent).not.toContain('没有标准答案');
  expect(at(8061).querySelector('[data-sources-outgoing]')).toBeNull();
  const first=at(8120);expect(first.querySelector('[data-sources-code]')).not.toBeNull();expect(first.querySelector('[data-sources-video] video')).toBeNull();
  expect(at(8180).querySelector('[data-sources-video] video')).not.toBeNull();
 });
 it('keeps the collection result while showing rows and striking the old numbers',()=>{
  const end=at(8520);expect(end.querySelectorAll('[data-bowl-token]')).toHaveLength(20);expect(end.querySelectorAll('[data-settled]')).toHaveLength(20);
  expect(end.querySelectorAll('[data-resource-strike]')).toHaveLength(2);expect(end.querySelector('[data-resource-changed]')!.textContent).toBe('现在没那么大方了');
  const overlap=at(8554);expect(overlap.querySelector('[data-sources-credits]')).not.toBeNull();expect(overlap.querySelector('[data-sources-gallery]')).not.toBeNull();
 });
 it('plays three independent gallery clips and ends before the narration chapter',()=>{
  const end=at(8732);expect(end.querySelectorAll('[data-sources-gallery-item] video')).toHaveLength(3);expect(end.body.textContent).not.toContain('旁白和 SRT');
  const before=at(8290).body.innerHTML;at(8732);expect(at(8290).body.innerHTML).toBe(before);
 });
 it('carries the gallery across the cut with the three frozen insets and shared layout',()=>{
  const gallery=at(8732).querySelector('[data-sources-gallery]')!;
  expect(renderToStaticMarkup(<NarrationFilm/>)).toBe(renderToStaticMarkup(<AnimationSourcesFilm/>));
  clock.frame=8733;
  const next=new DOMParser().parseFromString(renderToStaticMarkup(<NarrationFilm/>),'text/html');
  const outgoing=next.querySelector('[data-narration-outgoing] [data-sources-gallery]')!;
  expect(outgoing.textContent).toBe(gallery.textContent);
  expect([...outgoing.querySelectorAll('img')].map(image=>image.getAttribute('src'))).toEqual(
   [0,1,2].map(index=>'animation-sources/gallery-'+index+'-last.png'),
  );
  expect(outgoing.querySelector('video')).toBeNull();
 });
 it('rocks only the microphone around its base as the question cards scatter',()=>{
  const mic=(frame:number)=>{
   clock.frame=frame;
   const document=new DOMParser().parseFromString(renderToStaticMarkup(<NarrationFilm/>),'text/html');
   return document.querySelector<SVGSVGElement>('[data-narration-microphone]')!.style;
  };
  const right=mic(8979);
  expect(right.transformOrigin).toBe('50% 95.7%');
  expect(right.transform).toBe('rotate(9deg)');
  expect(mic(8980).transform).toBe('rotate(-7.8deg)');
  expect(mic(8988).transform).toBe('rotate(-2.9deg)');
  expect(mic(8993).transform).toBe('');
  expect(mic(8978).transform).toBe('');
  expect(mic(8978).left).toBe(right.left);
  expect(parseFloat(mic(9020).left)).toBeLessThan(parseFloat(right.left));
 });
 it('outlines the TTS tag before scatter and clears the emphasis afterward',()=>{
  const highlight=(frame:number)=>{
   clock.frame=frame;
   const document=new DOMParser().parseFromString(renderToStaticMarkup(<NarrationFilm/>),'text/html');
   return [...document.querySelectorAll('[data-narration-tag-highlight]')];
  };
  expect(highlight(8954)).toHaveLength(0);
  const outlined=highlight(8960);
  expect(outlined).toHaveLength(1);
  expect(outlined[0].parentElement!.getAttribute('data-narration-tag')).toBe('是不是TTS？');
  expect(highlight(8984)).toHaveLength(0);
 });
 it('lands on the floor between the five hops across the recording chain',()=>{
  const pose=(frame:number)=>{
   clock.frame=frame;
   const document=new DOMParser().parseFromString(renderToStaticMarkup(<NarrationFilm/>),'text/html');
   return document.querySelector<HTMLElement>('[data-material-agent]')!.style;
  };
  let previousLeft=Infinity;
  for(const [apex,landing] of [[9230,9233],[9237,9240],[9243,9247],[9250,9254],[9257,9260]]){
   const air=pose(apex), floor=pose(landing);
   expect(parseFloat(floor.top)).toBe(237);
   expect(parseFloat(air.top)).toBeLessThan(parseFloat(floor.top)-25);
   expect(parseFloat(air.left)).toBeLessThan(previousLeft);
   previousLeft=parseFloat(floor.left);
  }
  expect(parseFloat(pose(9288).top)).toBeLessThan(parseFloat(pose(9281).top)-25);
 });
 it('drops the tool cards in order, rebounds, and finishes counting after the cards settle',()=>{
  const toolAt=(frame:number,name:string)=>{
   clock.frame=frame;
   const document=new DOMParser().parseFromString(renderToStaticMarkup(<NarrationFilm/>),'text/html');
   return document.querySelector(`[data-voice-tool="${name}"]`);
  };
  const cases=[
   {name:'GPT-SoVITS',start:9408,overshoot:9417,settled:9422,lean:'-8.5',total:'64.1k'},
   {name:'VoxCPM2',start:9415,overshoot:9423,settled:9429,lean:'0',total:'40.8k'},
   {name:'IndexTTS-2.5',start:9421,overshoot:9430,settled:9436,lean:'8.5',total:'24.8k'},
  ];
  const card=(tool:Element)=>tool.querySelector<HTMLElement>('[data-card-entrance]')!.style;
  const stars=(tool:Element)=>tool.querySelector('[data-voice-tool-stars]')!.textContent;
  for(const {name,start,overshoot,settled,lean,total} of cases){
   expect(toolAt(start-1,name)).toBeNull();
   const incoming=toolAt(start,name)!;
   expect(parseFloat(card(incoming).top)).toBeLessThan(-140);
   expect(card(incoming).transform).toContain(`rotate(${lean}deg)`);
   expect(stars(incoming)).toBe('★ 0.0k');
   expect(parseFloat(card(toolAt(overshoot,name)!).top)).toBeGreaterThan(8);
   const landed=toolAt(settled,name)!;
   expect(card(landed).top).toBe('0px');
   expect(card(landed).transform).toContain('rotate(0deg)');
   expect(stars(landed)).not.toBe('★ '+total);
   expect(stars(toolAt(9452,name)!)).toBe('★ '+total);
  }
 });
 it('sends a document from each tool card to the mascot in order',()=>{
  const papers=(frame:number)=>{
   clock.frame=frame;
   const document=new DOMParser().parseFromString(renderToStaticMarkup(<NarrationFilm/>),'text/html');
   return [...document.querySelectorAll<HTMLElement>('[data-voice-tool-document]')];
  };
  expect(papers(9715)).toHaveLength(0);
  const first=papers(9716)[0];
  expect(first.getAttribute('data-voice-tool-document')).toBe('GPT-SoVITS');
  expect(parseFloat(papers(9722)[0].style.top)).toBeLessThan(parseFloat(first.style.top));
  expect(papers(9727).map(paper=>paper.getAttribute('data-voice-tool-document'))).toEqual(['GPT-SoVITS','VoxCPM2','IndexTTS-2.5']);
  const blue=papers(9742)[0];
  expect(blue.getAttribute('data-voice-tool-document')).toBe('IndexTTS-2.5');
  expect(blue.style.left).toBe('96px');
  expect(blue.style.top).toBe('241px');
  expect(papers(9743)).toHaveLength(0);
 });
 it('allows resource copy replacement and shifts the complete timeline',()=>{
  const render=(time:number,startAt=0)=>renderToStaticMarkup(<ResourceCredits time={time} startAt={startAt} copy={{title:'我的资源',dailyValue:'12 份'}}/>);
  expect(render(17,10)).toBe(render(7));expect(render(7)).toContain('12 份');
 });
});
