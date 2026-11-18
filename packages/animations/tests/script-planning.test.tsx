/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';
const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1920,height:1080}),staticFile:(file:string)=>file,AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>,Img:({src,style}:{src:string;style:CSSProperties})=><img src={src} style={style}/>}));
import {ScriptModelComparisonFilm,ScriptPlanningFilm} from '../../../examples/reference-opening/ScriptPlanningScene';
import {ScriptNotesFilm} from '../../../examples/reference-opening/ScriptNotesScene';
const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const at=(frame:number)=>{clock.frame=frame;return dom(<ScriptPlanningFilm/>);};
const style=(doc:Document,selector:string)=>doc.querySelector<HTMLElement>(selector)!.style;
describe('planning document excerpt through the next shot boundary',()=>{
  it('delegates the entire accepted 129-second prefix to the existing film',()=>{
    for(const frame of [0,299,749,1548,1887,2211,2400,2790,2879,2880,3000,3300,3756,3774,3789,3840,3869]){
      clock.frame=frame;
      expect(renderToStaticMarkup(<ScriptPlanningFilm/>)).toBe(renderToStaticMarkup(<ScriptNotesFilm/>));
    }
  });
  it('slides the document in and scrolls through the observed excerpts before highlighting the model note',()=>{
    expect(style(at(3870),'[data-planning-document]').opacity).toBe('0');
    const first=at(3891),middle=at(3930),last=at(4019);
    expect(style(first,'[data-planning-document]').height).toBe('292px');
    expect(style(first,'[data-planning-scroll]').transform).toBe('translateY(0px)');
    expect(style(middle,'[data-planning-scroll]').transform).toBe('translateY(-320px)');
    expect(style(last,'[data-planning-document]').top).toBe('139px');
    expect(style(last,'[data-planning-document]').height).toBe('210px');
    expect(style(last,'[data-planning-scroll]').transform).toBe('translateY(-640px)');
    expect(style(first,'[data-planning-highlight]').width).toBe('0%');
    expect(style(last,'[data-planning-highlight]').width).toBe('100%');
    expect(last.querySelectorAll('[data-planning-page]')).toHaveLength(3);
  });
  it('keeps the first conclusion and active second outline in their accepted positions',()=>{
    const before=at(3869),after=at(4019);
    expect(after.querySelector('[data-section-bookmark]')!.outerHTML).toBe(before.querySelector('[data-section-bookmark]')!.outerHTML);
    expect(after.querySelector('[data-question-summary="1"]')!.outerHTML).toBe(before.querySelector('[data-question-summary="1"]')!.outerHTML);
    expect(style(after,'[data-notes-phase="next-question"]').opacity).toBe('0');
    expect(style(after,'[data-planning-example-label]').opacity).toBe('1');
  });
  it('holds the highlighted document at the cutoff and remains deterministic on backward seeks',()=>{
    const end=at(4019);
    expect(end.querySelector('[data-script-notes-scene]')!.lastElementChild!.textContent).toBe('呃例如对比三个模型能力那段');
    expect(end.querySelector('[data-planning-page="model-agent"]')!.textContent).toContain('模型与 Agent：能力和局限');
    expect(end.body.innerHTML).not.toMatch(/NaN|Infinity/);
    const prior=at(3915).querySelector('[data-planning-excerpt]')!.outerHTML;at(4019);
    expect(at(3915).querySelector('[data-planning-excerpt]')!.outerHTML).toBe(prior);
  });
});

describe('model comparison handoff',()=>{
  it('starts after the existing highlight and shrinks the same document',()=>{
    for(const frame of [0,3869,3870,3990,4019]){
      clock.frame=frame;
      expect(renderToStaticMarkup(<ScriptModelComparisonFilm/>)).toBe(renderToStaticMarkup(<ScriptPlanningFilm/>));
    }
    clock.frame=4020;
    const start=dom(<ScriptModelComparisonFilm/>);
    expect(style(start,'[data-planning-document-collapse]').transform).toBe('translate(0px,0px) scale(1)');
    expect(style(start,'[data-model-comparison-window]').opacity).toBe('0');
    clock.frame=4050;
    const moved=dom(<ScriptModelComparisonFilm/>);
    expect(style(moved,'[data-planning-document-collapse]').transform).toContain(`scale(${336/598})`);
    expect(style(moved,'[data-planning-highlight]').width).toBe('100%');
    expect(style(moved,'[data-model-comparison-window]').opacity).toBe('1');
  });

  it('reveals the model names in order through the final frame',()=>{
    for(const [frame,visible] of [[4070,1],[4105,2],[4140,3],[4184,3]] as const){
      clock.frame=frame;
      const doc=dom(<ScriptModelComparisonFilm/>);
      const names=Array.from(doc.querySelectorAll<HTMLElement>('[data-comparison-model]'));
      expect(names.filter(name=>name.style.opacity==='1').map(name=>name.textContent))
        .toEqual(['Claude','Codex','DeepSeek'].slice(0,visible));
    }
  });
});
