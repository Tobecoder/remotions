/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
  useCurrentFrame:()=>clock.frame,
  useVideoConfig:()=>({fps:30,width:1920,height:1080,durationInFrames:2880}),
  staticFile:(file:string)=>file,
  AbsoluteFill:({children,style}:{children?:ReactNode;style?:CSSProperties})=><div style={style}>{children}</div>,
  Img:({src,style}:{src:string;style?:CSSProperties})=><img src={src} style={style}/>,
}));
import {ScriptFilm} from '../../../examples/reference-opening/ScriptScene';
import {PreparationFilm} from '../../../examples/reference-opening/PreparationScene';
import {MaterialDemo} from '../../../apps/catalog/src/MaterialDemo';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const at=(frame:number)=>{clock.frame=frame;return dom(<ScriptFilm/>);};
const style=(scene:Document,selector:string)=>scene.querySelector<HTMLElement>(selector)!.style;

describe('script continuation through the requested 96-second boundary',()=>{
  it('preserves every accepted section in the original 58-second prefix',()=>{
    for(const frame of [0,80,299,560,749,900,1044,1058,1089,1242,1485,1547,1566,1620,1659,1695,1739]){
      const continued=at(frame);clock.frame=frame;const original=dom(<PreparationFilm/>);
      expect(continued.body.innerHTML).toBe(original.body.innerHTML);
      expect(continued.querySelector('[data-script-scene]')).toBeNull();
    }
  });
  it('continues from the overview stack to the script chapter and document',()=>{
    const overview=at(1830),chapter=at(1887),document=at(1950);
    expect(style(overview,'[data-script-phase="overview"]').opacity).toBe('1');
    expect(overview.querySelectorAll('[data-layer-label]')).toHaveLength(5);
    expect(overview.querySelector('[data-script-phase="overview"]')!.textContent).toContain('音效');
    expect(Number(style(chapter,'[data-script-chapter]').opacity)).toBeGreaterThan(0);
    expect(style(document,'[data-script-phase="document"]').opacity).toBe('1');
    expect(style(document,'[data-script-phase="overview"]').opacity).toBe('0');
  });
  it('holds the chapter alone for a readable beat without overlapping the stack or document',()=>{
    for(const frame of [1863,1872,1881,1890,1899]){
      const scene=at(frame);
      expect(Number(style(scene,'[data-script-chapter]').opacity)).toBeCloseTo(1,8);
      expect(style(scene,'[data-script-phase="overview"]').opacity).toBe('0');
      expect(style(scene,'[data-script-phase="document"]').opacity).toBe('0');
    }
  });
  it('shrinks the narration heading, reveals the visual instructions and highlights the document',()=>{
    const narration=at(1940),instructions=at(2058),highlight=at(2118),list=at(2196);
    expect(Number(style(narration,'[data-script-narration]').fontSize.replace('px',''))).toBe(42);
    expect(style(instructions,'[data-script-narration]').fontSize).toBe('18px');
    expect(style(instructions,'[data-script-instruction]').opacity).toBe('1');
    expect(style(instructions,'[data-script-highlight]').opacity).toBe('0');
    expect(style(highlight,'[data-script-highlight]').opacity).toBe('1');
    expect(style(list,'[data-script-list]').opacity).toBe('1');
    expect(style(list,'[data-script-instruction]').opacity).toBe('0');
  });
  it('types the personal text first, then AI text, before collecting them into columns',()=>{
    const early=at(2223),later=at(2250),ai=at(2300),compact=at(2380);
    const text=(scene:Document,selector:string)=>scene.querySelector(selector)!.textContent!;
    expect(text(later,'[data-own-typed]').length).toBeGreaterThan(text(early,'[data-own-typed]').length);
    expect(text(later,'[data-ai-typed]')).toBe('');
    expect(text(ai,'[data-ai-typed]').length).toBeGreaterThan(0);
    expect(style(ai,'[data-writing-check]').opacity).toBe('1');
    expect(style(compact,'[data-writing-own]').height).toBe('66px');
    expect(style(compact,'[data-writing-ai]').height).toBe('66px');
  });
  it('expands each spotlight and returns it without stretching the headline',()=>{
    for(const [middle,end,index,left,top] of [[2400,2481,0,420,175],[2520,2600,1,49,255]]){
      const expanded=at(middle).querySelectorAll<HTMLElement>('[data-spotlight-panel]')[index];
      const returned=at(end).querySelectorAll<HTMLElement>('[data-spotlight-panel]')[index];
      expect(expanded.style.width).toBe('336px');expect(expanded.style.height).toBe('189px');
      expect(parseFloat(returned.style.left)).toBeCloseTo(left,8);expect(parseFloat(returned.style.top)).toBeCloseTo(top,8);
      expect(expanded.style.transform).toBe('');
    }
    expect(at(2463).querySelector('[data-script-phase="preview"] [data-neuron-count]')!.textContent).toBe('860亿');
  });
  it('finishes the first progress row while the second continues spinning and counting',()=>{
    const finished=at(2730),later=at(2790),latest=at(2835);
    expect(style(finished,'[data-race-bar="0"]').width).toBe('100%');
    expect(style(finished,'[data-race-winner]').opacity).toBe('1');
    expect(style(later,'[data-race-bar="1"]').width).not.toBe('100%');
    const count=(scene:Document)=>Number(scene.querySelector('[data-race-count]')!.textContent!.replace(/,/g,''));
    expect(count(latest)).toBeGreaterThan(count(later));
    expect(style(latest,'[data-race-spinner]').transform).not.toBe(style(later,'[data-race-spinner]').transform);
  });
  it('ends on paper and the requested question subtitle at 1:36',()=>{
    const end=at(2879);
    for(const phase of end.querySelectorAll<HTMLElement>('[data-script-phase]'))expect(Number(phase.style.opacity)).toBe(0);
    expect(end.querySelector('[data-script-scene]')!.lastElementChild!.textContent).toBe('还是重点聊两个大家比较关心的问题');
    expect(end.querySelector('[data-next-question]')).toBeNull();
  });
  it('shares component timing with every standalone catalogue demo and is seek-stable',()=>{
    for(const [offset,id,selectors] of [
      [1908,'script-document-guide',['[data-script-narration]','[data-script-highlight]','[data-script-list]']],
      [2211,'typewriter-comparison',['[data-writing-own]','[data-writing-ai]']],
      [2373,'card-spotlight',['[data-script-phase="preview"] [data-spotlight-panel]']],
      [2604,'progress-race',['[data-race-row="0"]','[data-race-bar="0"]','[data-race-spinner]']],
    ] as const){
      for(const local of [0,12,45,75,108]){
        const film=at(offset+local);clock.frame=local;const demo=dom(<MaterialDemo id={id}/>);
        for(const selector of selectors){
          const actual=style(film,selector),expected=style(demo,selector.replace('[data-script-phase="preview"] ',''));
          for(const key of ['left','top','width','height','opacity'] as const){
            if(actual[key]&&expected[key])expect(parseFloat(actual[key])).toBeCloseTo(parseFloat(expected[key]),7);
          }
        }
      }
    }
    const remembered=at(2760).querySelector('[data-progress-race]')!.outerHTML;at(2879);
    expect(at(2760).querySelector('[data-progress-race]')!.outerHTML).toBe(remembered);
  });
});
