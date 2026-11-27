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
import {ResourceCredits} from '../../../examples/reference-opening/compositions/ResourceCredits';
import segments from '../../../examples/reference-opening/segments.json';
const at=(frame:number)=>{clock.frame=frame;return new DOMParser().parseFromString(renderToStaticMarkup(<AnimationSourcesFilm/>),'text/html');};
describe('animation sources and chapter closing',()=>{
 it('preserves the earlier film and all ten prior cut points',()=>{
  for(const frame of [0,6706,7333,7880,8045]){clock.frame=frame;expect(renderToStaticMarkup(<AnimationSourcesFilm/>)).toBe(renderToStaticMarkup(<EditorWalkthroughFilm/>));}
  expect(segments.slice(0,10).map(s=>s.endFrame)).toEqual([750,1740,2880,3870,4785,5400,6090,6706,7333,8046]);expect(segments.at(-1)).toEqual({id:'11-Animation-Sources',endFrame:8733});
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
 it('allows resource copy replacement and shifts the complete timeline',()=>{
  const render=(time:number,startAt=0)=>renderToStaticMarkup(<ResourceCredits time={time} startAt={startAt} copy={{title:'我的资源',dailyValue:'12 份'}}/>);
  expect(render(17,10)).toBe(render(7));expect(render(7)).toContain('12 份');
 });
});
