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
  OffthreadVideo:({src,muted,trimBefore}:{src:string;muted:boolean;trimBefore?:number})=><video src={src} muted={muted} data-source-frame={trimBefore}/>,
  Loop:({durationInFrames,children}:{durationInFrames:number;children:ReactNode})=><div data-loop-duration={durationInFrames}>{children}</div>,
}));
import {ScriptModelComparisonFilm,ScriptPlanningFilm} from '../../../examples/reference-opening/ScriptPlanningScene';
import {ScriptPitfallsFilm} from '../../../examples/reference-opening/ScriptPitfallsScene';
import {ScriptPrinciplesFilm} from '../../../examples/reference-opening/ScriptPrinciplesScene';
import {ScriptClosingFilm} from '../../../examples/reference-opening/ScriptClosingScene';
import {MaterialCollectionFilm} from '../../../examples/reference-opening/MaterialCollectionScene';
import segments from '../../../examples/reference-opening/segments.json';
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
    expect(start.querySelector('[data-pitfall-outgoing] [data-loop-duration="1"] video')?.getAttribute('data-source-frame')).toBe('145');
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

describe('principles conclusion',()=>{
  const atPrinciples=(frame:number)=>{clock.frame=frame;return dom(<ScriptPrinciplesFilm/>);};
  it('preserves the earlier film and first summary during the new handoff',()=>{
    for(const frame of [0,299,749,1548,2211,2879,3300,3784,3962,4143,4185,4416,4589]){
      clock.frame=frame;
      expect(renderToStaticMarkup(<ScriptPrinciplesFilm/>)).toBe(renderToStaticMarkup(<ScriptPitfallsFilm/>));
    }
    const start=atPrinciples(4590),end=atPrinciples(4784);
    expect(style(start,'[data-principles-outgoing]').opacity).toBe('1');
    expect(atPrinciples(4605).querySelector('[data-principles-outgoing]')).toBeNull();
    expect(start.querySelector('[data-section-bookmark]')!.outerHTML).toBe(end.querySelector('[data-section-bookmark]')!.outerHTML);
  });
  it('reveals the panel before the rules and keeps the subtitle on the global clock',()=>{
    const heading=atPrinciples(4653),panel=atPrinciples(4710),rules=atPrinciples(4758);
    expect(style(heading,'[data-principles-heading]').opacity).toBe('1');
    expect(style(heading,'[data-principles-document]').opacity).toBe('0');
    expect(style(panel,'[data-principles-document]').opacity).toBe('1');
    expect(Array.from(panel.querySelectorAll<HTMLElement>('[data-principles-rule]')).every(rule=>rule.style.opacity==='0')).toBe(true);
    expect(Array.from(rules.querySelectorAll<HTMLElement>('[data-principles-rule]')).every(rule=>rule.style.opacity==='1')).toBe(true);
    expect(rules.querySelector('[data-principles-document]')!.textContent).toContain('脚本里的提示词，必须完整展示在画面中');
    expect(rules.querySelector('[data-script-notes-scene]')!.lastElementChild!.textContent).toBe('甚至写入项目的 AGENTS.md 里');
  });
  it('docks the entire group at the second badge before replacing its outline with a summary',()=>{
    const docked=atPrinciples(4777),end=atPrinciples(4784);
    const group=docked.querySelector<HTMLElement>('[data-script-principles] [data-section-collapse-scene]')!;
    expect(group.style.transform).toBe('translate(328.25px,57.12px) scale(0.02300000000000002)');
    expect(group.querySelector('[data-principles-heading]')).not.toBeNull();
    expect(group.querySelector('[data-principles-document]')).not.toBeNull();
    expect(style(docked,'[data-script-principles] [data-section-bookmark]').opacity).toBe('0');
    expect(style(end,'[data-question-summary="1"]').opacity).toBe('0');
    const bookmark=end.querySelector<HTMLElement>('[data-script-principles] [data-section-bookmark]')!;
    expect(bookmark.style.opacity).toBe('1');
    expect(bookmark.textContent).toBe('2几乎不写 · 原则写进 AGENTS.md');
    const before=atPrinciples(4740).body.innerHTML;atPrinciples(4784);
    expect(atPrinciples(4740).body.innerHTML).toBe(before);
  });
});

describe('script chapter conclusion and longer segments',()=>{
  const atClosing=(frame:number)=>{clock.frame=frame;return dom(<ScriptClosingFilm/>);};
  it('keeps the complete earlier film before the new boundary',()=>{
    for(const frame of [0,749,1740,2879,3784,4184,4589,4758,4784]){
      clock.frame=frame;
      expect(renderToStaticMarkup(<ScriptClosingFilm/>)).toBe(renderToStaticMarkup(<ScriptPrinciplesFilm/>));
    }
    expect(atClosing(4785).querySelectorAll('[data-section-bookmark]')).toHaveLength(2);
    expect(atClosing(4802).querySelector('[data-planning-outgoing]')).toBeNull();
  });
  it('counts the shots before stamping the verdict and scrolling the AI document',()=>{
    const grid=atClosing(4920);
    expect(grid.querySelector('[data-planning-count]')!.getAttribute('data-planning-count')).toBe('386');
    expect(grid.querySelectorAll('[data-planning-shot]')).toHaveLength(40);
    expect(style(grid,'[data-planning-verdict-stamp]').opacity).toBe('1');
    const early=atClosing(5025),late=atClosing(5190);
    expect(Number(early.querySelector('[data-document-scroll-content]')!.getAttribute('data-scroll-progress')))
      .toBeLessThan(Number(late.querySelector('[data-document-scroll-content]')!.getAttribute('data-scroll-progress')));
    expect(style(late,'[data-planning-reaction]').opacity).toBe('1');
  });
  it('finishes the chapter question and later-topic marker before the material chapter',()=>{
    const end=atClosing(5399);
    expect(style(end,'[data-planning-ai]').opacity).toBe('0');
    expect(style(end,'[data-planning-final-question]').opacity).toBe('1');
    expect(style(end,'[data-planning-later]').opacity).toBe('1');
    expect(end.querySelector('[data-planning-final-question]')!.textContent).toContain('后面聊 · 04 制作视频');
    expect(end.querySelector('[data-script-closing-scene]')!.lastElementChild!.hasAttribute('data-script-planning-verdict')).toBe(true);
    const before=atClosing(5065).body.innerHTML;atClosing(5399);
    expect(atClosing(5065).body.innerHTML).toBe(before);
  });
  it('merges adjacent short clips into continuous segments of at least twenty seconds',()=>{
    let start=0;
    expect(new Set(segments.map(({id})=>id)).size).toBe(segments.length);
    for(const {endFrame} of segments){
      expect(endFrame-start).toBeGreaterThanOrEqual(600);
      start=endFrame;
    }
    expect(segments.slice(0,6).map(({endFrame})=>endFrame)).toEqual([750,1740,2880,3870,4785,5400]);
    expect(segments[5].endFrame-segments[4].endFrame).toBe(615);
  });
});

describe('material collection through the feasibility conclusion',()=>{
  const atMaterials=(time:number)=>{clock.frame=Math.round(time*30);return dom(<MaterialCollectionFilm/>);};
  it('keeps the existing film and the final question through the chapter handoff',()=>{
    for(const frame of [0,749,1740,2879,4184,4589,4784,5150,5399]){
      clock.frame=frame;
      expect(renderToStaticMarkup(<MaterialCollectionFilm/>)).toBe(renderToStaticMarkup(<ScriptClosingFilm/>));
    }
    expect(style(atMaterials(180),'[data-material-chapter]').opacity).toBe('1');
    expect(atMaterials(180.6).querySelector('[data-material-outgoing]')).toBeNull();
    expect(atMaterials(182).querySelectorAll('[data-material-window]')).toHaveLength(12);
  });
  it('files the original collage before taking the Agent to the web',()=>{
    expect(style(atMaterials(184.7),'[data-material-agent-drop]').opacity).toBe('0');
    const web=atMaterials(191.3),done=atMaterials(194.6);
    expect(web.querySelector('[data-material-archive]')).toBeNull();
    expect(web.querySelector('[data-material-tablet]')).not.toBeNull();
    expect(web.querySelector('[data-material-capture]')).toBeNull();
    expect(style(done,'[data-material-web-stage]').opacity).toBe('0');
    expect(style(done,'[data-material-apps]').transform).toBe('translate(0px,0px) scale(1)');
  });
  it('keeps the original eight cards until they shrink into the folder behind its front',()=>{
    const before=atMaterials(187.3),collecting=atMaterials(188.2),after=atMaterials(189.7);
    expect(before.querySelectorAll('[data-material-archive]')).toHaveLength(8);
    expect(Array.from(before.querySelectorAll('[data-material-archive]')).every(card=>card.getAttribute('data-archive-progress')==='0')).toBe(true);
    const original=before.querySelector('[data-material-archive="chart"] [data-material-window="chart"] img')!;
    const moving=collecting.querySelector('[data-material-archive="chart"] [data-material-window="chart"] img')!;
    expect(moving.getAttribute('src')).toBe(original.getAttribute('src'));
    expect(Number(collecting.querySelector('[data-material-archive="chart"]')!.getAttribute('data-archive-progress'))).toBeGreaterThan(0);
    expect(style(collecting,'[data-material-archive="chart"]').opacity).toBe('1');
    const collage=collecting.querySelector('[data-material-collage]')!;
    // Both blue panels must cover the large windows before any card moves.
    expect(collage.nextElementSibling!.hasAttribute('data-material-folder-back')).toBe(true);
    expect(collage.nextElementSibling!.nextElementSibling!.hasAttribute('data-material-folder')).toBe(true);
    const staged=atMaterials(188),lastWindows=atMaterials(189.1);
    expect(Array.from(staged.querySelectorAll('[data-material-archive]')).every(card=>card.getAttribute('data-archive-progress')==='0')).toBe(true);
    expect(Array.from(lastWindows.querySelectorAll('[data-material-archive]')).map(card=>card.getAttribute('data-material-archive'))).toEqual(['script-recording','editor-recording']);
    expect(style(lastWindows,'[data-material-window="web-gallery"]').opacity).toBe('0');
    expect(after.querySelectorAll('[data-material-archive]')).toHaveLength(0);
    expect(style(after,'[data-material-folder]').opacity).toBe('1');
    expect(style(atMaterials(189.6),'[data-material-window="web-gallery"]').opacity).toBe('0');
  });
  it('drops the foreground mascot from above while its shadow remains on the ground',()=>{
    const position=(time:number)=>Number(style(atMaterials(time),'[data-material-agent-drop]').transform.match(/translate\(0px,([^p]+)px\)/)![1]);
    const first=position(185),second=position(185.2),third=position(185.4);
    expect(first).toBe(-330);
    expect(second).toBeGreaterThan(first);
    expect(third-second).toBeGreaterThan(second-first);
    const falling=atMaterials(185.4),landed=atMaterials(186.1);
    expect(falling.querySelector('[data-material-agent-shadow]')!.parentElement)
      .toBe(falling.querySelector('[data-material-agent-drop]')!.parentElement);
    expect(style(falling,'[data-material-agent-shadow]').top).toBe('317px');
    expect(style(landed,'[data-material-agent-drop]').transform).toBe('translate(0px,0px) scale(1)');
    const before=atMaterials(185.4).body.innerHTML;atMaterials(202.9);
    expect(atMaterials(185.4).body.innerHTML).toBe(before);
  });
  it('keeps apps locked before MCP and unlocks the editor before the full ready state',()=>{
    const locked=atMaterials(195),middle=atMaterials(199.3),end=atMaterials(202.9);
    expect(Array.from(locked.querySelectorAll('[data-material-lock]')).map(lock=>lock.getAttribute('data-unlock'))).toEqual(['0','0','0']);
    expect(style(locked,'[data-material-mcp]').opacity).toBe('0');
    expect(Array.from(middle.querySelectorAll('[data-material-lock]')).map(lock=>lock.getAttribute('data-unlock'))).toEqual(['0','1','0']);
    expect(style(middle,'[data-material-mcp]').opacity).toBe('1');
    expect(Array.from(end.querySelectorAll<HTMLElement>('[data-material-lock]')).every(lock=>lock.style.opacity==='0')).toBe(true);
    expect(end.querySelector('[data-material-collection-scene]')!.lastElementChild!.textContent).toBe('所以技术上是可行的');
    const before=atMaterials(191).body.innerHTML;atMaterials(202.9);
    expect(atMaterials(191).body.innerHTML).toBe(before);
  });
  it('uses separate left-facing and tablet artwork without mirroring the tablet',()=>{
    const left=atMaterials(188.2),tablet=atMaterials(191.6);
    expect(left.querySelector('[data-material-agent-pose="left"] img')!.getAttribute('src')).toBe('material-collection/agent-left.png');
    expect(style(left,'[data-material-agent-facing]').transform).not.toContain('scale(-');
    expect(tablet.querySelector('[data-material-tablet] img')!.getAttribute('src')).toBe('material-collection/agent-tablet.png');
    expect(atMaterials(193.2).querySelector('[data-material-tablet]')).toBeNull();
  });
  it('changes subtitles on the observed source frames rather than rounded seconds',()=>{
    expect(atMaterials(5422/30).querySelector('[data-material-collection-scene]')!.lastElementChild!.textContent).not.toBe('讲解类视频通常会涉及大量的截图');
    for(const [frame,text] of [[5518,'录屏等素材'],[5797,'但是如果散落在各种软件里面'],[5866,'具体就得看 Agent 有没有相应的操作权限'],[6047,'所以技术上是可行的']] as const){
      expect(atMaterials((frame-1)/30).querySelector('[data-material-collection-scene]')!.lastElementChild!.textContent).not.toBe(text);
      expect(atMaterials(frame/30).querySelector('[data-material-collection-scene]')!.lastElementChild!.textContent).toBe(text);
    }
  });
  it('ends the twenty-three-second segment before the next practical caveat',()=>{
    expect(segments[6]).toEqual({id:'07-Material-Collection',endFrame:6090});
    expect(segments[6].endFrame-segments[5].endFrame).toBe(23*30);
    expect(atMaterials(202.9667).body.textContent).not.toContain('但实际它整理出来的素材');
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
