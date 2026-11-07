/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
  useCurrentFrame:()=>clock.frame,
  useVideoConfig:()=>({fps:30,width:1920,height:1080,durationInFrames:1740}),
  staticFile:(file:string)=>file,
  AbsoluteFill:({children,style}:{children?:ReactNode;style?:CSSProperties})=><div style={style}>{children}</div>,
  Img:({src,style}:{src:string;style?:CSSProperties})=><img src={src} style={style}/>,
}));
import {PreparationFilm} from '../../../examples/reference-opening/PreparationScene';
import {BeforeWorkScene} from '../../../examples/reference-opening/SecondPointScene';
import {MaterialDemo} from '../../../apps/catalog/src/MaterialDemo';
import {PreparationCards} from '../../../examples/reference-opening/compositions/PreparationCards';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const at=(frame:number)=>{clock.frame=frame;return dom(<PreparationFilm/>);};
const style=(scene:Document,selector:string)=>scene.querySelector<HTMLElement>(selector)!.style;
const cardOpacity=(card:HTMLElement)=>Number(card.style.opacity)*Number(card.parentElement!.style.opacity);
const transformValues=(element:HTMLElement)=>element.style.transform.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)!.map(Number);

describe('preparation through the last frame before the breakdown title',()=>{
  it('keeps the accepted prefix and all existing motion before 51.6 seconds',()=>{
    for(const frame of [0,80,299,400,749,800,1044,1058,1089,1242,1485,1520,1547]){
      const continued=at(frame);clock.frame=frame;const original=dom(<BeforeWorkScene/>);
      expect(continued.body.innerHTML).toBe(original.body.innerHTML);
      expect(continued.querySelector('[data-preparation-scene]')).toBeNull();
    }
  });
  it('reveals the four preparation cards in order and holds all four',()=>{
    for(const [frame,count] of [[1566,1],[1573,2],[1581,3],[1588,4]]){
      const cards=Array.from(at(frame).querySelectorAll<HTMLElement>('[data-preparation-card]'));
      expect(cards).toHaveLength(4);
      expect(cards.filter(card=>Number(card.style.opacity)>.999)).toHaveLength(count);
    }
    const held=at(1620);
    expect(Array.from(held.querySelectorAll<HTMLElement>('[data-preparation-card]')).every(card=>card.style.opacity==='1')).toBe(true);
    expect(style(held,'[data-agent-tile]').opacity).toBe('0');
    expect(held.querySelector('[data-preparation-title]')!.textContent).toBe('开工之前我会先准备这些素材');
  });
  it('collects the cards at the Agent while the Agent becomes visible',()=>{
    const before=at(1650),collecting=at(1659),finished=at(1668);
    const left=(scene:Document)=>Array.from(scene.querySelectorAll<HTMLElement>('[data-preparation-card-motion]'),el=>transformValues(el)[0]);
    expect(Math.max(...left(collecting))-Math.min(...left(collecting))).toBeLessThan(Math.max(...left(before))-Math.min(...left(before)));
    expect(Number(style(collecting,'[data-agent-tile]').opacity)).toBeGreaterThan(0);
    for(const card of finished.querySelectorAll<HTMLElement>('[data-preparation-card]'))expect(cardOpacity(card)).toBe(0);
    expect(style(finished,'[data-agent-tile]').opacity).toBe('1');
    expect(left(finished).every(x=>x===251)).toBe(true);
  });
  it('shows the tool and connection before the finished result, then holds before the next title',()=>{
    const agent=at(1668),tool=at(1677),finished=at(1695),end=at(1739);
    expect(style(agent,'[data-agent-output]').opacity).toBe('0');
    expect(Number(style(tool,'[data-agent-tool]').opacity)).toBeGreaterThan(0);
    expect(Number(tool.querySelector('[data-agent-connector]')!.getAttribute('opacity'))).toBeGreaterThan(0);
    expect(Number(style(tool,'[data-agent-output]').opacity)).toBe(0);
    expect(style(finished,'[data-agent-output]').opacity).toBe('1');
    expect(style(end,'[data-agent-output]').opacity).toBe('1');
    expect(end.body.textContent).toContain('用 Remotion 来制作');
    expect(end.body.textContent).not.toContain('细拆上期');
    expect(end.body.textContent).not.toContain('接下来');
  });
  it('reuses independent actions in the case sequence and keeps the Agent catalog timeline aligned',()=>{
    for(const local of [0,9,18,30,45,90,103,115,120]){
      const film=at(1548+local);clock.frame=local;
      const sequence=dom(<PreparationCards time={local/30} cards={['脚本','配音','SRT','素材'].map((title,i)=>({id:String(i),title,artwork:<span/>}))}/>);
      const actual=Array.from(film.querySelectorAll<HTMLElement>('[data-preparation-card]'));
      const expected=Array.from(sequence.querySelectorAll<HTMLElement>('[data-preparation-card]'));
      actual.forEach((card,i)=>{
        expect(card.hasAttribute('data-card-entrance')).toBe(true);
        expect(card.parentElement!.hasAttribute('data-content-collapse')).toBe(true);
        expect(cardOpacity(card)).toBeCloseTo(cardOpacity(expected[i]),8);
        for(const [a,b] of [[card,expected[i]],[card.parentElement!,expected[i].parentElement!]]){
          const values=transformValues(a),reference=transformValues(b);
          expect(values).toHaveLength(reference.length);
          values.forEach((value,j)=>expect(value).toBeCloseTo(reference[j],8));
        }
      });
    }
    for(const local of [0,10,24,30,38,48,75]){
      const film=at(1650+local);clock.frame=local;const demo=dom(<MaterialDemo id="agent-pipeline"/>);
      for(const selector of ['[data-agent-tile]','[data-agent-tool]','[data-agent-output]'])expect(Number(style(film,selector).opacity)).toBeCloseTo(Number(style(demo,selector).opacity),8);
      expect(style(film,'[data-agent-cursor]').opacity).toBe([24,48,75].includes(local)?'0':'1');
      expect(style(demo,'[data-agent-cursor]').opacity).toBe(style(film,'[data-agent-cursor]').opacity);
    }
  });
});
