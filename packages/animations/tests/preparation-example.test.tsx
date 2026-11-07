/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1280,height:720}),staticFile:(file:string)=>file,Img:({src,style}:{src:string;style:CSSProperties})=><img src={src} style={style}/>,AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>}));
import {PreparationCardsExample} from '../../../examples/component-examples/preparation-cards/Example';
import {PreparationScene} from '../../../examples/reference-opening/PreparationScene';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const styles=(scene:Document,selector:string)=>Array.from(scene.querySelectorAll(selector),node=>(node.getAttribute('style')??'').replace(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi,value=>String(Number(Number(value).toFixed(8)))));

describe('complete material preparation example',()=>{
  it('keeps the original entries, hold, collection, Agent handoff and blinking cursor through arbitrary seeks',()=>{
    const selectors=['[data-preparation-title], [data-preparation-title] > div','[data-preparation-card-motion], [data-preparation-card], [data-preparation-card] > div','[data-agent-tile], [data-agent-tool], [data-agent-output], [data-agent-cursor]'];
    for(const frame of [0,5,12,20,30,39,60,100,101,102,108,110,117,118,119,126,132,144,147,180,191,60]){
      clock.frame=frame+1548;
      const original=dom(<PreparationScene/>);
      clock.frame=frame;
      const preview=dom(<PreparationCardsExample/>);
      for(const selector of selectors)expect(styles(preview,selector)).toEqual(styles(original,selector));
      expect(preview.querySelector('[data-agent-connector]')!.getAttribute('opacity')).toBe(original.querySelector('[data-agent-connector]')!.getAttribute('opacity'));
      expect(preview.querySelector('[data-preparation-title]')!.textContent).toBe(original.querySelector('[data-preparation-title]')!.textContent);
      expect(Array.from(preview.querySelectorAll('[data-preparation-card]'),card=>card.children[1].textContent)).toEqual(['脚本','配音','SRT','素材']);
      expect(preview.querySelector<HTMLElement>('[data-component-example]')!.style.transform).toBe('scale(1.6,1.6)');
    }
    clock.frame=191;
    const held=dom(<PreparationCardsExample/>);
    for(const card of held.querySelectorAll<HTMLElement>('[data-preparation-card-motion]')){
      expect(card.style.transform).toContain('translate(251px,168px)');expect(card.style.opacity).toBe('0');
    }
    expect(held.querySelector<HTMLElement>('[data-agent-output]')!.style.opacity).toBe('1');
  });
  it('replaces material artwork and copy while custom output keeps the same continuous clock',()=>{
    const times:number[]=[];
    for(const frame of [0,60,117,144,191,30]){
      clock.frame=frame;
      const preview=dom(<PreparationCardsExample cards={[{id:'custom',title:'图表',description:'已准备',artwork:<svg data-custom-art/>},{id:'empty',title:'旁白',artwork:null}]} copy={{title:'整理好再开工'}} agentLabel="助手" toolLabel="工具" output={time=>{times.push(time);return <div data-custom-output>{time.toFixed(2)}</div>;}}/>);
      expect(preview.querySelectorAll('[data-preparation-card]')).toHaveLength(2);
      expect(preview.querySelectorAll('[data-custom-art]')).toHaveLength(1);
      expect(preview.querySelectorAll('[data-preparation-card] svg')).toHaveLength(1);
      expect(preview.querySelector('[data-example-preparation-output]')).toBeNull();
      expect(preview.querySelector('[data-custom-output]')!.textContent).toBe((frame/30).toFixed(2));
      for(const text of ['图表','已准备','整理好再开工','助手','工具'])expect(preview.body.textContent).toContain(text);
    }
    expect(times).toEqual([0,2,3.9,4.8,191/30,1]);
    expect(dom(<PreparationCardsExample copy={{outputTitle:'新的成片'}}/>).querySelector('[data-example-preparation-output]')!.textContent).toContain('新的成片');
  });
  it('preserves explicit empty input and rejects cards or illustration kinds outside the original layout',()=>{
    const empty=dom(<PreparationCardsExample cards={[]} output={null}/>);
    expect(empty.querySelectorAll('[data-preparation-card]')).toHaveLength(0);
    expect(empty.querySelector('[data-agent-output]')!.textContent).toBe('');
    expect(empty.querySelector('[data-example-preparation-output]')).toBeNull();
    const five=Array.from({length:5},(_,index)=>({id:String(index),title:'素材'}));
    expect(()=>renderToStaticMarkup(<PreparationCardsExample cards={five}/>)).toThrow('最多支持 4 张卡片');
    for(const kind of [-1,.5,NaN,4])expect(()=>renderToStaticMarkup(<PreparationCardsExample cards={[{id:'invalid',title:'素材',kind}]}/>)).toThrow('kind 必须为 0–3');
    expect(()=>renderToStaticMarkup(<PreparationCardsExample cards={[{id:'custom',title:'素材',kind:99,artwork:null}]}/>)).not.toThrow();
  });
});
