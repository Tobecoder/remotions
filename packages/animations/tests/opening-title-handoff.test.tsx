/** @vitest-environment jsdom */
import type {CSSProperties, ReactNode} from 'react';
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

describe('opening title handoff at the actual scene call site',()=>{
  it('does not fade both titles to near-invisible between the two supplied layouts',()=>{
    const coverage=[];
    const offsets=[];
    for(let frame=169;frame<=193;frame++){
      clock.frame=frame;
      const document=new DOMParser().parseFromString(renderToStaticMarkup(<OpeningScene/>),'text/html');
      const intro=document.querySelector<HTMLElement>('[data-title-layer="intro"]')!;
      const chapter=document.querySelector<HTMLElement>('[data-title-layer="chapter"]')!;
      coverage.push(Number(intro.style.opacity||1)+Number(chapter.style.opacity||1));
      const transform=document.querySelector<HTMLElement>('[data-title-motion="intro"]')!.style.transform;
      const match=transform.match(/translateY\((-?[\d.]+)px\)|translate3d\(0,\s*(-?[\d.]+)px/);
      expect(match).not.toBeNull();
      offsets.push(Number(match![1]??match![2]));
    }
    expect(Math.min(...coverage)).toBeGreaterThanOrEqual(.99);
    for(let i=1;i<offsets.length;i++)expect(Math.abs(offsets[i]-offsets[i-1])).toBeLessThan(2);
  });
});
