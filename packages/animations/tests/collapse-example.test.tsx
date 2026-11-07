/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1280,height:720}),AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>}));
import {SectionCollapseExample} from '../../../examples/component-examples/content-collapse/Example';
import {SectionCollapse} from '../../../examples/reference-opening/compositions/SectionCollapse';
import {during} from '../src/reference-opening/motion';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const appearance=(scene:Document)=>Array.from(scene.querySelectorAll('[data-content-collapse], [data-section-bookmark], [data-section-bookmark] span'),node=>({style:node.getAttribute('style'),text:node.textContent}));

describe('complete section collapse example',()=>{
  it('preserves the original collapse, crossfade and summary through forward and backward seeks',()=>{
    const content=<article>已经讲完的完整场景</article>;
    for(const frame of [0,210,255,262,263,270,272,277,280,284,285,286,300,329,263]){
      clock.frame=frame;
      const preview=dom(<SectionCollapseExample label="本节结论" number="2" content={content}/>);
      const original=dom(<SectionCollapse progress={during(frame/30+14.9,23.65,24.4)} label="本节结论" number="2">{content}</SectionCollapse>);
      expect(appearance(preview)).toEqual(appearance(original));
      expect(preview.querySelector<HTMLElement>('[data-component-example]')!.style.transform).toBe('scale(1.6,1.6)');
    }
    clock.frame=285;
    const end=dom(<SectionCollapseExample content={content}/>);
    clock.frame=329;
    const held=dom(<SectionCollapseExample content={content}/>);
    expect(appearance(held)).toEqual(appearance(end));
    const transform=held.querySelector<HTMLElement>('[data-content-collapse]')!.style.transform;
    expect(transform).toContain('translate(49px,47px)');
    expect(Number(transform.match(/scale\(([^)]+)\)/)![1])).toBeCloseTo(.06,10);
    expect(held.querySelector<HTMLElement>('[data-content-collapse]')!.style.opacity).toBe('0');
    expect(held.querySelector<HTMLElement>('[data-section-bookmark]')!.style.opacity).toBe('1');
  });
  it('replaces summary and default copy and keeps custom animated content on the same clock',()=>{
    clock.frame=225;
    const preview=dom(<SectionCollapseExample label="先讲问题" number="3" copy={{description:'换一种方法',fromLabel:'问题',toLabel:'答案',resultLabel:'得到结论'}}/>);
    expect(preview.querySelector('[data-example-section-heading]')!.textContent).toContain('先讲问题');
    expect(preview.querySelector('[data-section-bookmark]')!.textContent).toBe('3先讲问题');
    for(const text of ['换一种方法','问题','答案','得到结论'])expect(preview.body.textContent).toContain(text);
    const times:number[]=[];
    for(const frame of [0,263,285,329,90]){
      clock.frame=frame;
      const custom=dom(<SectionCollapseExample content={time=>{times.push(time);return <div data-custom-scene>{time.toFixed(2)}</div>;}}/>);
      expect(custom.querySelector('[data-custom-scene]')!.textContent).toBe((frame/30).toFixed(2));
      expect(custom.querySelector('[data-branching-paths], [data-example-section-heading]')).toBeNull();
    }
    expect(times).toEqual([0,263/30,9.5,329/30,3]);
  });
  it('keeps explicit empty scene and summary text instead of restoring demonstration content',()=>{
    clock.frame=329;
    const preview=dom(<SectionCollapseExample content={null} label="" number=""/>);
    expect(preview.querySelector('[data-content-collapse]')!.textContent).toBe('');
    expect(preview.querySelector('[data-section-bookmark]')!.textContent).toBe('');
    expect(preview.querySelector('[data-branching-paths], [data-example-section-heading]')).toBeNull();
  });
});
