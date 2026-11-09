/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';
const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1920,height:1080}),staticFile:(file:string)=>file,AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>,Img:({src,style}:{src:string;style:CSSProperties})=><img src={src} style={style}/>}));
import {ScriptNotesFilm} from '../../../examples/reference-opening/ScriptNotesScene';
import {ScriptFilm} from '../../../examples/reference-opening/ScriptScene';
const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const at=(seconds:number)=>{clock.frame=Math.round(seconds*30);return dom(<ScriptNotesFilm/>);};
const style=(doc:Document,selector:string)=>doc.querySelector<HTMLElement>(selector)!.style;
describe('script notes continuation to the second question',()=>{
  it('preserves the existing 96-second film before the new boundary',()=>{
    for(const frame of [0,299,1739,1887,2211,2380,2484,2790,2879]){
      clock.frame=frame;const next=renderToStaticMarkup(<ScriptNotesFilm/>);
      expect(next).toBe(renderToStaticMarkup(<ScriptFilm/>));
    }
  });
  it('stages questions, annotations and matches in order and supports backward seeks',()=>{
    expect(style(at(99),'[data-notes-phase="overview"]').opacity).toBe('1');
    expect(style(at(110),'[data-notes-document]').opacity).toBe('0');
    expect(style(at(117),'[data-notes-document]').opacity).toBe('1');
    const before=at(116).querySelector('[data-notes-document]')!.innerHTML;
    const matched=at(124);expect(matched.querySelectorAll('[data-notes-matches] circle')).toHaveLength(3);
    for(const group of matched.querySelectorAll('[data-notes-matches] g'))expect(group.getAttribute('opacity')).toBe('1');
    expect(at(116).querySelector('[data-notes-document]')!.innerHTML).toBe(before);
  });
  it('ends with the first summary and the exact requested subtitle, without entering the following document',()=>{
    const end=at(128.9666666667);
    expect(style(end,'[data-notes-phase="explanation"]').opacity).toBe('0');
    expect(style(end,'[data-notes-phase="next-question"]').opacity).toBe('1');
    expect(end.querySelector('[data-question-summary="0"]')!.textContent).toContain('要备注：段落下标注可用素材');
    expect(end.querySelector('[data-script-notes-scene]')!.lastElementChild!.textContent).toBe('接下来要不要规划分段的脚本');
    expect(end.body.innerHTML).not.toMatch(/NaN|Infinity/);
  });
});
