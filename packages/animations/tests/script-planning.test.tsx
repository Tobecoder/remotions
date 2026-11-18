/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';
const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
  useCurrentFrame:()=>clock.frame,
  useVideoConfig:()=>({fps:30,width:1920,height:1080}),
  staticFile:(file:string)=>file,
  AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>,
  Img:({src,style}:{src:string;style:CSSProperties})=><img src={src} style={style}/>,
  Sequence:({children,from}:{children:ReactNode;from:number})=>clock.frame>=from?children:null,
  OffthreadVideo:({src,muted}:{src:string;muted:boolean})=><video src={src} muted={muted}/>,
  Freeze:({frame,children}:{frame:number;children:ReactNode})=><div data-frozen-frame={frame}>{children}</div>,
}));
import {ScriptModelComparisonFilm,ScriptPlanningFilm} from '../../../examples/reference-opening/ScriptPlanningScene';
import {ScriptPitfallsFilm} from '../../../examples/reference-opening/ScriptPitfallsScene';
import {ScriptNotesFilm} from '../../../examples/reference-opening/ScriptNotesScene';
const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const at=(frame:number)=>{clock.frame=frame;return dom(<ScriptPlanningFilm/>);};
const style=(doc:Document,selector:string)=>doc.querySelector<HTMLElement>(selector)!.style;
describe('planning document excerpt through the next shot boundary',()=>{
  it('uses the existing film until the next subtitle cue',()=>{
    for(const frame of [0,299,749,1548,1887,2211,2400,2790,2879,2880,3000,3300,3756,3774,3789,3840,3867]){
      clock.frame=frame;
      expect(renderToStaticMarkup(<ScriptPlanningFilm/>)).toBe(renderToStaticMarkup(<ScriptNotesFilm/>));
    }
  });
  it('keeps the first card after returning it left, then returns the second card right',()=>{
    const cue=at(3869),first=at(3894),middle=at(3930),paired=at(3962);
    const left='[data-planning-preview="video-models"]';
    const right='[data-planning-preview="motion-library"]';
    const scale=346/598;
    expect(cue.querySelector('[data-script-notes-scene]')!.lastElementChild!.textContent).toContain('只在个别地方做了备注');
    expect(style(first,left).transform).toBe('translate(102px,106px) scale(1)');
    expect(first.querySelector(right)).toBeNull();
    expect(style(middle,left).transform).toBe(`translate(46px,198px) scale(${scale})`);
    expect(style(middle,right).transform).toBe('translate(102px,136px) scale(1)');
    expect(style(middle,right+' [data-planning-highlight]').width).not.toBe('100%');
    expect(style(paired,left).opacity).toBe('1');
    expect(style(paired,right).opacity).toBe('1');
    expect(style(paired,right).transform).toBe(`translate(409px,212px) scale(${scale})`);
    expect(style(paired,right+' [data-planning-highlight]').width).toBe('100%');
    const fading=at(3965);
    expect(style(fading,left).opacity).toBe(style(fading,right).opacity);
    expect(Number(style(fading,left).opacity)).toBeLessThan(1);
  });
  it('opens the third card separately and highlights its note after the two previews clear',()=>{
    const model=at(3975),last=at(4019);
    expect(model.querySelector('[data-planning-preview]')).toBeNull();
    expect(style(model,'[data-planning-document]').opacity).toBe('1');
    expect(style(model,'[data-planning-highlight]').width).toBe('0%');
    expect(style(last,'[data-planning-document]').top).toBe('139px');
    expect(style(last,'[data-planning-document]').height).toBe('210px');
    expect(style(last,'[data-planning-highlight]').width).toBe('100%');
    expect(last.querySelectorAll('[data-planning-page]')).toHaveLength(1);
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

describe('skipped script prompts',()=>{
  const atPitfall=(frame:number)=>{clock.frame=frame;return dom(<ScriptPitfallsFilm/>);};
  const prompt=(id:string)=>`[data-pitfall-prompt="${id}"]`;
  it('continues the existing film and holds the final comparison frame through the fade',()=>{
    for(const frame of [0,3774,3962,4143,4184]){
      clock.frame=frame;
      expect(renderToStaticMarkup(<ScriptPitfallsFilm/>)).toBe(renderToStaticMarkup(<ScriptModelComparisonFilm/>));
    }
    const start=atPitfall(4185);
    expect(start.querySelector('[data-pitfall-outgoing] [data-frozen-frame]')?.getAttribute('data-frozen-frame')).toBe('4184');
    expect(style(start,'[data-pitfall-heading]').opacity).toBe('0');
    expect(atPitfall(4200).querySelector('[data-pitfall-outgoing]')).toBeNull();
  });
  it('parks the two prompts separately before showing the inset and its second phase',()=>{
    const environment=prompt('environment'),project=prompt('project');
    const first=atPitfall(4280),second=atPitfall(4350),parked=atPitfall(4416);
    expect(style(first,environment).transform).toBe('translate(79px,117px) scale(1)');
    expect(style(first,project+' [data-card-entrance]').opacity).toBe('0');
    expect(style(second,environment).transform).toMatch(/^translate\(47px,158px\) scale\(0\.407/);
    expect(style(second,project).transform).toBe('translate(231px,86px) scale(1)');
    expect(style(parked,project).transform).toMatch(/^translate\(79px,270px\) scale\(0\.45/);
    expect(style(parked,'[data-pitfall-result]').opacity).toBe('0');
    expect(style(atPitfall(4500),'[data-pitfall-result-phase="environment"]').opacity).toBe('1');
    const end=atPitfall(4589);
    expect(style(end,'[data-pitfall-result-phase="project"]').opacity).toBe('1');
    expect(style(end,'[data-pitfall-skipped]').opacity).toBe('1');
    expect(style(end,'[data-pitfall-result-note]').opacity).toBe('1');
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
    clock.frame=4038;
    expect(dom(<ScriptModelComparisonFilm/>).querySelector('[data-model-comparison-window] video')).toBeNull();
    clock.frame=4050;
    const moved=dom(<ScriptModelComparisonFilm/>);
    expect(style(moved,'[data-planning-document-collapse]').transform).toContain(`scale(${336/598})`);
    expect(style(moved,'[data-planning-highlight]').width).toBe('100%');
    expect(style(moved,'[data-model-comparison-window]').opacity).toBe('1');
    expect(moved.querySelector('[data-model-comparison-window] video')?.getAttribute('src')).toBe('model-comparison/demo.mp4');
  });

  it('reveals the model names in order through the final frame',()=>{
    for(const [frame,visible] of [[4077,1],[4110,2],[4143,3],[4184,3]] as const){
      clock.frame=frame;
      const doc=dom(<ScriptModelComparisonFilm/>);
      const names=Array.from(doc.querySelectorAll<HTMLElement>('[data-comparison-model]'));
      expect(names.filter(name=>name.style.opacity==='1').map(name=>name.textContent))
        .toEqual(['Claude','Codex','DeepSeek'].slice(0,visible));
    }
  });
});
