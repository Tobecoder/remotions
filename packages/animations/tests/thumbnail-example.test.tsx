/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1280,height:720}),staticFile:(file:string)=>file,Img:({src,style}:{src:string;style:CSSProperties})=><img src={src} style={style}/>,AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>}));
import {SceneThumbnailExample} from '../../../examples/component-examples/scene-thumbnail/Example';
import {OpeningScene} from '../../../examples/reference-opening/OpeningScene';
import {during,openingState} from '../src/reference-opening/motion';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const styles=(scene:Document,selector:string)=>Array.from(scene.querySelectorAll(selector),node=>(node.getAttribute('style')??'').replace(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi,value=>String(Number(Number(value).toFixed(8)))));

describe('complete chapter thumbnail handoff example',()=>{
  it('matches the original shrink, heading, layer geometry and next-deck entry through arbitrary seeks',()=>{
    const selectors=['[data-chapter-heading], [data-chapter-heading] div','[data-chapter-thumbnail], [data-chapter-thumbnail-content], [data-chapter-thumbnail-content] + div','[data-exploded-layers] > [data-perspective-panel], [data-exploded-layers] > svg','[data-fan-deck], [data-fan-card], [data-fan-deck] + div'];
    for(const frame of [0,29,30,31,35,38,40,44,45,46,50,51,75,119,35]){
      clock.frame=frame+225;
      const original=dom(<OpeningScene/>);
      clock.frame=frame;
      const preview=dom(<SceneThumbnailExample/>);
      for(const selector of selectors)expect(styles(preview,selector)).toEqual(styles(original,selector));
      expect(preview.querySelector('[data-chapter-heading]')!.textContent).toBe(original.querySelector('[data-chapter-heading]')!.textContent);
      expect(preview.querySelector<HTMLElement>('[data-component-example]')!.style.transform).toBe('scale(1.6,1.6)');
    }
    clock.frame=119;
    const held=dom(<SceneThumbnailExample/>);
    const transform=held.querySelector<HTMLElement>('[data-chapter-thumbnail-content]')!.style.transform;
    expect(transform).toContain('translate(120px,298px)');
    expect(Number(transform.match(/scale\(([^)]+)\)/)![1])).toBeCloseTo(.23,10);
    expect(held.querySelector<HTMLElement>('[data-chapter-thumbnail]')!.style.opacity).toBe('1');
  });
  it('replaces chapter copy and runs both custom artworks on one clock with their own original progress',()=>{
    const visits:{slot:string;time:number;progress:number}[]=[];
    for(const frame of [0,37,45,51,119,12]){
      clock.frame=frame;
      const preview=dom(<SceneThumbnailExample from={{number:'01',title:'问题',description:'提出问题'}} to={{number:'02',title:'步骤',description:'拆解步骤'}} caption="本节回顾" number="A" overview={{title:'新的总览'}} content={context=>{visits.push({slot:'old',...context});return <div data-custom-old>{context.time.toFixed(2)}</div>;}} nextContent={context=>{visits.push({slot:'next',...context});return <div data-custom-next>{context.time.toFixed(2)}</div>;}}/>);
      expect(preview.querySelectorAll('[data-custom-old]')).toHaveLength(1);
      expect(preview.querySelectorAll('[data-custom-next]')).toHaveLength(1);
      expect(preview.querySelector('[data-custom-old]')!.closest('[data-chapter-thumbnail-content]')).not.toBeNull();
      expect(preview.querySelector('[data-custom-next]')!.closest('[data-chapter-thumbnail-content]')).toBeNull();
      expect(preview.querySelector('[data-custom-old]')!.textContent).toBe((frame/30).toFixed(2));
      expect(preview.querySelector('[data-custom-next]')!.textContent).toBe((frame/30).toFixed(2));
      expect(preview.querySelector('[data-fan-deck], [data-exploded-layers]')).toBeNull();
      expect(preview.body.textContent).toContain('本节回顾');expect(preview.body.textContent).toContain('新的总览');
      expect(preview.querySelector('[data-chapter-heading]')!.textContent).toContain('拆解步骤');
      const state=openingState(frame/30+7.5),[old,next]=visits.slice(-2);
      expect(old).toEqual({slot:'old',time:frame/30,progress:state.thumbnail});
      expect(next).toEqual({slot:'next',time:frame/30,progress:state.fan});
      expect(Number(preview.querySelector<HTMLElement>('[data-example-next-content]')!.style.opacity)).toBeCloseTo(during(state.fan,0,.55),10);
    }
  });
  it('does not restore demonstration art or labels when explicit empty content is supplied',()=>{
    clock.frame=119;
    const preview=dom(<SceneThumbnailExample content={null} nextContent={null} caption="" number="" overview={{eyebrow:'',title:''}}/>);
    expect(preview.querySelector('[data-chapter-thumbnail-content]')!.textContent).toBe('');
    expect(preview.querySelector('[data-example-next-content]')!.textContent).toBe('');
    expect(preview.querySelector('[data-example-chapter-overview]')!.textContent).toBe('');
    expect(preview.querySelector('[data-fan-deck], [data-exploded-layers]')).toBeNull();
    expect(preview.body.textContent).not.toContain('SKILL.md');
  });
});
