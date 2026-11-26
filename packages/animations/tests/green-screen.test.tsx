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
import {GreenScreenFilm} from '../../../examples/reference-opening/GreenScreenScene';
import {MaterialQualityFilm} from '../../../examples/reference-opening/MaterialQualityScene';
import {ThreeStepFlow} from '../../../examples/reference-opening/compositions/ThreeStepFlow';
import segments from '../../../examples/reference-opening/segments.json';
const at=(frame:number)=>{clock.frame=frame;return new DOMParser().parseFromString(renderToStaticMarkup(<GreenScreenFilm/>),'text/html');};
const style=(doc:Document,q:string)=>(doc.querySelector(q) as HTMLElement).style;
describe('green-screen workflow continuation',()=>{
 it('delegates all earlier frames unchanged and preserves existing segment cuts',()=>{
  for(const frame of [0,5400,6090,6382,6705]){
   clock.frame=frame;expect(renderToStaticMarkup(<GreenScreenFilm/>)).toBe(renderToStaticMarkup(<MaterialQualityFilm/>));
  }
  expect(segments.slice(0,8).map(s=>s.endFrame)).toEqual([750,1740,2880,3870,4785,5400,6090,6706]);
  expect(segments.find(s=>s.id==='09-Green-Screen')).toEqual({id:'09-Green-Screen',endFrame:7333});
  expect(7333-6706).toBeGreaterThanOrEqual(600);
 });
 it('continues the old inset clock while crossfading and staggers five stock cards',()=>{
  const overlap=at(6712);
  expect(Number(style(overlap,'[data-green-outgoing]').opacity)).toBeGreaterThan(0);
  expect(overlap.querySelectorAll('[data-green-outgoing] video')).toHaveLength(5);
  expect(overlap.querySelector('[data-quality-main-video] [data-video-from]')!.getAttribute('data-video-from')).toBe('6633');
  const stagger=at(6720);
  expect(Number(style(stagger,'[data-stock-card="0"]').opacity)).toBeGreaterThan(Number(style(stagger,'[data-stock-card="2"]').opacity));
  expect(style(stagger,'[data-stock-card="4"]').opacity).toBe('0');
  expect(at(6800).querySelector('[data-stock-gallery]')).toBeNull();
 });
 it('reveals steps in narration order and preserves both video clocks after shrinking',()=>{
  const first=at(6870);expect(style(first,'[data-flow-card="0"]').opacity).toBe('1');expect(style(first,'[data-flow-card="1"]').opacity).toBe('0');
  const second=at(7000);expect(style(second,'[data-flow-card="1"]').opacity).toBe('1');expect(style(second,'[data-flow-card="2"]').opacity).toBe('0');
  const before=at(7130),after=at(7250);
  const videos=(doc:Document)=>[...doc.querySelectorAll('[data-flow-collapse] [data-video-from]')].map(v=>[v.getAttribute('data-video-from'),v.querySelector('video')!.getAttribute('src')]);
  expect(videos(after)).toEqual(videos(before));expect(videos(after)).toHaveLength(2);
  expect(after.querySelectorAll('[data-flow-collapse] [data-flow-label]')).toHaveLength(3);
  expect(after.querySelectorAll('[data-flow-collapse] [data-flow-connector]')).toHaveLength(2);
  expect(style(after,'[data-flow-collapse]').transform).toBe('translate(74px,-5px) scale(0.36)');
  expect(style(after,'[data-flow-heading]').opacity).toBe('0');expect(style(after,'[data-flow-summary]').opacity).toBe('1');
 });
 it('shows the Agent result after the summary without including the following editor method',()=>{
  expect(at(7259).querySelector('[data-agent-alpha]')).toBeNull();
  const end=at(7332);expect(end.querySelector('[data-agent-alpha] video')!.getAttribute('src')).toBe('green-screen/agent-alpha.mp4');
  expect(end.querySelector('[data-green-screen-scene]')!.lastElementChild!.textContent).toBe('你可以直接丢给Agent让它帮你处理');
  const earlier=at(6720).body.innerHTML;at(7332);expect(at(6720).body.innerHTML).toBe(earlier);
 });
 it('allows replacement content and shifts the complete flow using one start time',()=>{
  const steps=[{id:'a',label:'输入',content:<b>甲</b>},{id:'b',label:'处理',content:<b>乙</b>},{id:'c',label:'输出',content:<b>丙</b>}] as const;
  const original=renderToStaticMarkup(<ThreeStepFlow time={10} steps={steps} copy={{title:'替换标题'}}/>);
  expect(renderToStaticMarkup(<ThreeStepFlow time={24} startAt={14} steps={steps} copy={{title:'替换标题'}}/>)).toBe(original);
  expect(original).toContain('替换标题');expect(original).toContain('<b>丙</b>');
 });
});
