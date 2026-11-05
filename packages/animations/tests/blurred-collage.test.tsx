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
import {BlurredCollage} from '../src';
import {OpeningScene} from '../../../examples/reference-opening/OpeningScene';
import {MaterialDemo} from '../../../apps/catalog/src/MaterialDemo';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const drift=(doc:Document)=>doc.querySelector<HTMLElement>('[data-collage-drift]')!;
const cards=[{id:'a',x:10,y:20,width:100,height:80,rotation:-5,content:<span>图片内容</span>}];

describe('blurred collage background',()=>{
  it('moves down and left at constant speed while keeping the paper stationary',()=>{
    for(const time of [0,1,2,3]){
      const doc=dom(<BlurredCollage time={time} cards={cards} paper={<span>纸纹</span>}/>);
      expect(drift(doc).style.transform).toBe(`translate(${-16*time}px,${8*time}px)`);
      expect(Number(drift(doc).style.opacity)).toBeCloseTo(.33);
      const paper=doc.querySelector<HTMLElement>('[data-collage-paper]')!;
      expect(paper.style.transform).toBe('');
      expect(paper.style.opacity).toBe('');
      expect(paper.textContent).toBe('纸纹');
    }
  });
  it('fades the collage around 3–4 seconds without fading the paper, including random seeks',()=>{
    for(const [time,alpha] of [[4.25,0],[3,.33],[3.625,.165],[0,.33],[10,0]]){
      const doc=dom(<BlurredCollage time={time} cards={cards}/>);
      expect(Number(drift(doc).style.opacity)).toBeCloseTo(alpha);
      expect(doc.querySelector('[data-collage-paper] svg')).not.toBeNull();
      expect(doc.querySelector('[data-collage-paper] animate')).toBeNull();
    }
    const delayed=dom(<BlurredCollage time={5} startAt={4} cards={cards}/>);
    expect(drift(delayed).style.transform).toBe('translate(-16px,8px)');
    expect(Number(drift(delayed).style.opacity)).toBeCloseTo(.33);
  });
  it('uses identical motion, fade and card placement in the catalog and actual ten-second scene',()=>{
    for(const frame of [0,18,30,60,90,105,120,128,179,299]){
      clock.frame=frame;
      const example=dom(<OpeningScene/>),catalogue=dom(<MaterialDemo id="blurred-collage"/>);
      expect(drift(example).getAttribute('style')).toBe(drift(catalogue).getAttribute('style'));
      const placement=(doc:Document)=>Array.from(doc.querySelectorAll('[data-collage-card]'),el=>el.getAttribute('style'));
      expect(placement(example)).toEqual(placement(catalogue));
      expect(placement(example)).toHaveLength(9);
    }
  });
});
