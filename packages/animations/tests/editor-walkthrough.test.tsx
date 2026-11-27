/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect,vi} from 'vitest';
const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
 useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1920,height:1080}),staticFile:(file:string)=>file,
 AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>,
 Img:({src,style}:{src:string;style:CSSProperties})=><img src={src} style={style}/>,
 OffthreadVideo:({src}:{src:string})=><video src={src}/>,
 Sequence:({children,from=0,durationInFrames=Infinity}:{children:ReactNode;from:number;durationInFrames:number})=>clock.frame>=from&&clock.frame<from+durationInFrames?<div data-video-from={from}>{children}</div>:null,
 Loop:({children}:{children:ReactNode})=><>{children}</>,
}));
import {EditorWalkthroughFilm} from '../../../examples/reference-opening/EditorWalkthroughScene';
import {GreenScreenFilm} from '../../../examples/reference-opening/GreenScreenScene';
import {TutorialWalkthrough} from '../../../examples/reference-opening/compositions/TutorialWalkthrough';
import segments from '../../../examples/reference-opening/segments.json';
const doc=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const at=(frame:number)=>{clock.frame=frame;return doc(<EditorWalkthroughFilm/>);};
const style=(d:Document,q:string)=>(d.querySelector(q) as HTMLElement).style;
describe('editor walkthrough and reusable method handoff',()=>{
 it('preserves the earlier film and all existing cut points',()=>{
  for(const frame of [0,6090,6706,7159,7265,7332]){clock.frame=frame;expect(renderToStaticMarkup(<EditorWalkthroughFilm/>)).toBe(renderToStaticMarkup(<GreenScreenFilm/>));}
  expect(segments.slice(0,9).map(s=>s.endFrame)).toEqual([750,1740,2880,3870,4785,5400,6090,6706,7333]);
  expect(segments.find(s=>s.id==='10-Editor-Walkthrough')).toEqual({id:'10-Editor-Walkthrough',endFrame:8046});
  expect(8046-7333).toBe(713);
 });
 it('crossfades the old stage while highlighting the new method and keeps one continuous recording',()=>{
  const first=at(7333),overlap=at(7337),settled=at(7345);
  expect(first.querySelector('[data-tutorial-previous-stage]')).not.toBeNull();
  expect(Number(style(overlap,'[data-tutorial-stage]').opacity)).toBeGreaterThan(0);
  expect(Number(style(overlap,'[data-tutorial-previous-stage]').opacity)).toBeGreaterThan(0);
  expect(settled.querySelector('[data-tutorial-previous-stage]')).toBeNull();
  expect(Number(style(settled,'[data-tutorial-method="previous"]').opacity)).toBeCloseTo(.45);
  const videos=(d:Document)=>[...d.querySelectorAll('[data-editor-walkthrough-scene] [data-video-from]')].map(el=>[el.getAttribute('data-video-from'),el.querySelector('video')!.getAttribute('src')]);
  expect(videos(at(7400))).toEqual(videos(at(8030)));
  expect(videos(at(8030))).toHaveLength(3);
 });
 it('switches captions on their observed frames without replacing the stage video',()=>{
  expect(at(7408).querySelector('[data-tutorial-step]')).toBeNull();
  for(const [frame,index] of [[7409,0],[7472,1],[7624,2],[7738,3],[7884,4]]){
   const d=at(frame);expect(d.querySelector('[data-tutorial-step]')!.getAttribute('data-tutorial-step')).toBe(String(index));
   expect(d.querySelector('[data-tutorial-stage] [data-video-from]')!.getAttribute('data-video-from')).toBe('7333');
  }
  expect(at(7880).querySelector('[data-editor-walkthrough-scene]')!.lastElementChild!.hasAttribute('data-tutorial-walkthrough')).toBe(true);
  expect(at(8045).querySelector('[data-editor-walkthrough-scene]')!.lastElementChild!.textContent).toBe('导出的就是透明底的动画素材了');
 });
 it('accepts alternate methods, steps and dynamic content with a single time offset',()=>{
  const input={previousMethod:{title:'方案甲',description:'自动完成'},activeMethod:{title:'方案乙',description:'手工调整'},steps:[{at:1,label:'准备'},{at:3,label:'输出'}],children:<div>可替换录屏</div>};
  const initial=renderToStaticMarkup(<TutorialWalkthrough {...input} time={4}/>);
  expect(renderToStaticMarkup(<TutorialWalkthrough {...input} time={18} startAt={14}/>)).toBe(initial);
  const d=doc(<TutorialWalkthrough {...input} time={4}/>);expect(d.querySelector('[data-tutorial-step]')!.textContent).toBe('2 / 2输出');
  expect(doc(<TutorialWalkthrough {...input} steps={[]} time={4}/>).querySelector('[data-tutorial-step]')).toBeNull();
 });
 it('renders identically after seeking past a later step and back',()=>{
  const before=at(7480).body.innerHTML;at(8045);expect(at(7480).body.innerHTML).toBe(before);
 });
});
