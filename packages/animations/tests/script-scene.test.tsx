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
import {ScriptDocumentGuide} from '../../../examples/reference-opening/compositions/ScriptDocumentGuide';

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
    expect(overview.querySelector('[data-script-stack]')!.textContent).toContain('音效');
    expect(Number(style(chapter,'[data-script-chapter]').opacity)).toBeGreaterThan(0);
    expect(style(document,'[data-script-phase="document"]').opacity).toBe('1');
    expect(style(document,'[data-script-phase="overview"]').opacity).toBe('0');
    expect(style(document,'[data-script-stack]').opacity).toBe('0');
  });
  it('holds the chapter with its complete layer stack while keeping the old heading and document hidden',()=>{
    for(const frame of [1863,1872,1881,1890,1899]){
      const scene=at(frame);
      expect(Number(style(scene,'[data-script-chapter]').opacity)).toBeCloseTo(1,8);
      expect(style(scene,'[data-script-phase="overview"]').opacity).toBe('0');
      expect(style(scene,'[data-script-stack]').opacity).toBe('1');
      expect(scene.querySelectorAll('[data-script-stack] [data-layer-label]')).toHaveLength(5);
      for(const label of scene.querySelectorAll('[data-script-stack] [data-layer-label]'))expect(label.getAttribute('opacity')).toBe('1');
      expect(style(scene,'[data-script-window]').opacity).toBe('0');
    }
  });
  it('uses one continuously visible ChapterHeading to slide from script to narration',()=>{
    for(const frame of [1899,1902,1908,1914,1920]){
      const scene=at(frame),header=scene.querySelector<HTMLElement>('[data-script-chapter]')!;
      expect(header.style.opacity).toBe('1');
      const headings=header.querySelectorAll<HTMLElement>('[data-chapter-heading]');
      expect(headings).toHaveLength(1);
      const title=headings[0].children[1] as HTMLElement;
      expect(title.children[0].textContent).toBe('脚本');
      expect(title.children[1].textContent).toBe('逐字稿');
      const oldOffset=Number((title.children[0] as HTMLElement).style.transform.match(/translateY\(([-\d.]+)px\)/)![1]);
      const newOffset=Number((title.children[1] as HTMLElement).style.transform.match(/translateY\(([-\d.]+)px\)/)![1]);
      expect(newOffset-oldOffset).toBeCloseTo(58,8);
      if(frame===1899)expect(newOffset).toBeCloseTo(58,8);
      if(frame===1908){expect(newOffset).toBeGreaterThan(0);expect(newOffset).toBeLessThan(58);}
      if(frame===1920)expect(newOffset).toBeCloseTo(0,8);
    }
  });
  it('shrinks the narration heading, reveals the visual instructions and highlights the document',()=>{
    const narration=at(1940),instructions=at(2058),highlight=at(2118),list=at(2196);
    expect(style(narration,'[data-script-narration]').transform).toBe('scale(1)');
    expect(Number(style(instructions,'[data-script-narration]').transform.match(/scale\(([^)]+)\)/)![1])).toBeCloseTo(18/42,8);
    expect(style(instructions,'[data-script-instruction]').opacity).toBe('1');
    expect(style(instructions,'[data-script-highlight]').opacity).toBe('0');
    expect(style(highlight,'[data-script-highlight]').opacity).toBe('1');
    expect(style(list,'[data-script-list]').opacity).toBe('1');
    expect(style(list,'[data-script-instruction]').opacity).toBe('1');
  });
  it('shrinks the same instruction title into the second list item instead of replacing it',()=>{
    let previousScale=1,previousLeft=49;
    for(const frame of [2169,2172,2175,2178,2181,2184,2196]){
      const scene=at(frame),instruction=style(scene,'[data-script-instruction]');
      expect(instruction.opacity).toBe('1');
      expect(instruction.transform).toMatch(/^scale\(/);
      const scale=Number(instruction.transform.match(/scale\(([^)]+)\)/)![1]);
      expect(scale).toBeLessThanOrEqual(previousScale);
      expect(parseFloat(instruction.left)).toBeGreaterThanOrEqual(previousLeft);
      previousScale=scale;previousLeft=parseFloat(instruction.left);
      expect(scene.querySelectorAll('[data-script-instruction-title]')).toHaveLength(1);
      expect(scene.querySelector('[data-script-instruction-title]')!.textContent).toBe('提示词 · 说明');
      expect(scene.querySelector('[data-script-list]')!.textContent).not.toContain('提示词');
      const demo=dom(<ScriptDocumentGuide time={(frame-1854)/30} chapterFrom={{number:'CHAPTER 01 / 06',title:'脚本',description:'逐字稿 · 素材备注 · 动画备注'}} document={<div/>}/>);
      const demoStyle=style(demo,'[data-script-instruction]');
      for(const key of ['left','top','opacity'] as const)expect(parseFloat(instruction[key])).toBeCloseTo(parseFloat(demoStyle[key]),7);
      expect(scale).toBeCloseTo(Number(demoStyle.transform.match(/scale\(([^)]+)\)/)![1]),7);
      if(frame===2169){expect(scale).toBe(1);expect(instruction.left).toBe('49px');expect(instruction.top).toBe('235px');}
      if(frame>=2184){expect(scale).toBe(.6);expect(instruction.left).toBe('75px');expect(parseFloat(instruction.top)).toBeCloseTo(191,8);}
    }
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
    for(const [middle,end,index,left,top] of [[2400,2481,0,435,187],[2520,2600,1,49,255]]){
      const expanded=at(middle).querySelectorAll<HTMLElement>('[data-spotlight-panel]')[index];
      const returned=at(end).querySelectorAll<HTMLElement>('[data-spotlight-panel]')[index];
      expect(expanded.style.width).toBe('336px');expect(expanded.style.height).toBe('189px');
      expect(parseFloat(returned.style.left)).toBeCloseTo(left,8);expect(parseFloat(returned.style.top)).toBeCloseTo(top,8);
      expect(expanded.style.transform).toBe('');
    }
    expect(at(2463).querySelector('[data-script-phase="preview"] [data-neuron-count]')!.textContent).toBe('860亿');
  });
  it('enlarges the black preview directly from the thumbnail and returns to that thumbnail',()=>{
    for(const frame of [2373,2478,2484]){
      const scene=at(frame),card=style(scene,'[data-writing-ai]'),panel=style(scene,'[data-script-phase="preview"] [data-spotlight-panel]');
      expect(parseFloat(panel.left)).toBeCloseTo(parseFloat(card.left)+15,7);
      expect(parseFloat(panel.top)).toBeCloseTo(parseFloat(card.top)+(parseFloat(card.height)-42)/2,7);
      expect(panel.width).toBe('54px');expect(panel.height).toBe('42px');expect(panel.borderRadius).toBe('3px');
      expect(style(scene,'[data-script-phase="preview"]').opacity).toBe('1');
    }
    for(const frame of [2374,2375,2376])expect(style(at(frame),'[data-script-phase="preview"]').opacity).toBe('1');
  });
  it('keeps one continuous neuron counter across the thumbnail, enlargement and return',()=>{
    let previous=0;
    for(const frame of [2364,2372,2373,2374,2385,2394,2405,2406,2417,2418,2432,2447,2450,2460,2477,2478,2487,2490]){
      const scene=at(frame),thumbnail=scene.querySelector('[data-writing-ai] [data-neuron-preview]')!,spotlight=scene.querySelector('[data-script-phase="preview"] [data-neuron-preview]')!;
      expect(thumbnail.querySelector('[data-neuron-count]')!.textContent).toBe(spotlight.querySelector('[data-neuron-count]')!.textContent);
      expect(thumbnail.getAttribute('data-neuron-value')).not.toBeNull();
      const value=Number(thumbnail.getAttribute('data-neuron-value'));
      expect(value).toBe(Number(spotlight.getAttribute('data-neuron-value')));
      expect(value).toBeGreaterThanOrEqual(previous);previous=value;
    }
    const valueAt=(frame:number)=>Number(at(frame).querySelector('[data-writing-ai] [data-neuron-preview]')!.getAttribute('data-neuron-value'));
    for(const frame of [2405,2417,2432]){
      const delta=valueAt(frame+1)-valueAt(frame);
      expect(delta).toBeGreaterThan(0);expect(delta).toBeLessThan(5_000_000_000);
    }
    expect(valueAt(2478)).toBe(86_000_000_000);
  });
  it('finishes the first progress row while the second continues spinning and counting',()=>{
    const finished=at(2730),later=at(2790),latest=at(2835);
    expect(style(finished,'[data-race-row="0"] [data-progress-fill]').width).toBe('100%');
    expect(style(finished,'[data-progress-status="complete"]').opacity).toBe('1');
    expect(style(later,'[data-race-row="1"] [data-progress-fill]').width).not.toBe('100%');
    const count=(scene:Document)=>Number(scene.querySelector('[data-race-count]')!.textContent!.replace(/,/g,''));
    expect(count(latest)).toBeGreaterThan(count(later));
    expect(style(latest,'[data-progress-status="waiting"]').transform).not.toBe(style(later,'[data-progress-status="waiting"]').transform);
  });
  it('ends on paper and the requested question subtitle at 1:36',()=>{
    const end=at(2879);
    for(const phase of end.querySelectorAll<HTMLElement>('[data-script-phase]'))expect(Number(phase.style.opacity)).toBe(0);
    expect(style(end,'[data-script-stack]').opacity).toBe('0');
    expect(end.querySelector('[data-script-scene]')!.lastElementChild!.textContent).toBe('还是重点聊两个大家比较关心的问题');
    expect(end.querySelector('[data-next-question]')).toBeNull();
  });
  it('shares component timing with every standalone catalogue demo and is seek-stable',()=>{
    for(const [offset,id,selectors] of [
      [2211,'typewriter-comparison',['[data-writing-own]','[data-writing-ai]']],
      [2373,'card-spotlight',['[data-script-phase="preview"] [data-spotlight-panel]']],
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
