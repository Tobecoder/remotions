/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
  useCurrentFrame:()=>clock.frame,
  useVideoConfig:()=>({fps:30,width:1920,height:1080,durationInFrames:300}),
  staticFile:(file:string)=>file,
  AbsoluteFill:({children,style}:{children?:ReactNode;style?:CSSProperties})=><div style={style}>{children}</div>,
  Img:({src,style}:{src:string;style?:CSSProperties})=><img src={src} style={style}/>,
}));
import {OpeningScene} from '../../../examples/reference-opening/OpeningScene';
import {during} from '../src/reference-opening/motion';
const at=(frame:number)=>{
  clock.frame=frame;
  return new DOMParser().parseFromString(renderToStaticMarkup(<OpeningScene/>),'text/html');
};

describe('ten-second example paper layering',()=>{
  it('keeps every appearing paper opaque so underlying waveforms cannot bleed through captions',()=>{
    for(const frame of [133,143,153,163,173,183]){
      const panels=at(frame).querySelectorAll<HTMLElement>('[data-exploded-layers] > [data-perspective-panel]');
      for(const panel of Array.from(panels).slice(1,-1))expect([0,1]).toContain(Number(panel.style.opacity));
    }
  });
  it('preserves the approved upward entry path and original timing for every middle card',()=>{
    const entries=[{index:1,row:3,start:4.3},{index:2,row:2,start:4.65},{index:3,row:1,start:5},{index:4,row:0,start:5.4}];
    for(const entry of entries){
      let previous=Infinity;
      for(const fraction of [0,.25,.5,.75,1]){
        const frame=Math.round((entry.start+.55*fraction)*30);
        const panel=at(frame).querySelectorAll<HTMLElement>('[data-exploded-layers] > [data-perspective-panel]')[entry.index];
        const matrix=panel.style.transform.match(/matrix\(([^)]+)\)/)![1].split(',').map(Number);
        const p=during(frame/30,entry.start,entry.start+.55);
        const expectedY=53+35.6*(entry.row+1)+18*(1-p*p);
        expect(matrix[5]).toBeCloseTo(expectedY,6);
        expect(matrix[5]).toBeLessThanOrEqual(previous);
        previous=matrix[5];
      }
    }
  });
  it('shows one screenshot at a time, including source-frame changes',()=>{
    for(const frame of [0,27,28,29,30,54,55,92,93,117,142,175,202,229,299]){
      const images=at(frame).querySelectorAll<HTMLElement>('[data-screen-frame]');
      expect(Array.from(images).filter(el=>Number(el.style.opacity)>0)).toHaveLength(1);
    }
  });
});
