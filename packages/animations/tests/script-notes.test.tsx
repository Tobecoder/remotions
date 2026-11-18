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
  it('hides the summary during question cards and hands the active outline to question two after the first conclusion',()=>{
    expect(style(at(100),'[data-question-summary="0"]').opacity).toBe('0');
    const first=at(120),second=at(128.9666666667);
    expect(first.querySelector('[data-question-summary="0"]')!.getAttribute('data-question-state')).toBe('active');
    expect(first.querySelector('[data-question-summary="1"]')!.getAttribute('data-question-state')).toBe('upcoming');
    expect(second.querySelector('[data-question-summary="0"]')!.getAttribute('data-question-state')).toBe('complete');
    expect(second.querySelector('[data-question-summary="1"]')!.getAttribute('data-question-state')).toBe('active');
    expect(style(second,'[data-question-summary="1"]').borderColor).toBe('rgb(213, 155, 137)');
    expect(style(second,'[data-question-summary="0"]').opacity).toBe('0');
    expect(style(second,'[data-section-bookmark]').opacity).toBe('1');
    expect(style(second,'[data-section-bookmark] span').background).toBe('rgb(217, 106, 72)');
    expect(style(second,'[data-section-bookmark] span').color).toBe('rgb(255, 255, 255)');
    expect(style(second,'[data-question-summary="1"] [data-question-number]').color).toBe('rgb(220, 115, 81)');
  });
  it('moves the whole group up and left before the bookmark takes over',()=>{
    const group='[data-section-collapse-scene][data-content-collapse]';
    const bookmark='[data-section-bookmark]';
    const second='[data-question-summary="1"]';
    const start=at(125.5),moving=at(125.8),fading=at(125.97),held=at(126.27);
    expect(style(start,group).transform).toBe('translate(0px,0px) scale(1)');
    const pose=(doc:Document)=>style(doc,group).transform.match(/-?[\d.]+/g)!.map(Number);
    const [x,y,scale]=pose(moving);
    const [nextX,nextY,nextScale]=pose(fading);
    expect(x).toBeLessThan(0);
    expect(y).toBeLessThan(0);
    expect(scale).toBeLessThan(1);
    expect(nextX).toBeLessThan(x);
    expect(nextY).toBeLessThan(y);
    expect(nextScale).toBeLessThan(scale);
    expect(moving.querySelector(group+' [data-notes-document]')).not.toBeNull();
    expect(moving.querySelector(group+' [data-notes-matches]')).not.toBeNull();
    expect(style(moving,bookmark).opacity).toBe('0');
    expect(Number(style(fading,group).opacity)).toBeLessThan(Number(style(moving,group).opacity));
    expect(style(held,group).opacity).toBe('0');
    expect(style(held,bookmark).opacity).toBe('1');
    expect(style(held,second).borderColor).toBe(style(start,second).borderColor);
    expect(style(held,'[data-notes-phase="next-question"]').opacity).toBe('0');
    expect(style(at(125.8),group).transform).toBe(style(moving,group).transform);
  });
  it('shows the two reference thumbnails and connects the shots before revealing their planning note',()=>{
    const cards=at(100);
    const left=cards.querySelector('[data-question-visual="0"]')!,right=cards.querySelector('[data-question-visual="1"]')!;
    expect(left).not.toBeNull();expect(right).not.toBeNull();
    expect(left.querySelectorAll('[data-question-thumbnail] img')).toHaveLength(2);
    expect(right.querySelectorAll('[data-shot-arrow]')).toHaveLength(2);
    expect(style(cards,'[data-shot-planning-note]').opacity).toBe('0');
    expect(style(at(101.2),'[data-shot-planning-note]').opacity).toBe('1');
  });
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
    expect(style(end,'[data-section-collapse-scene]').opacity).toBe('0');
    expect(style(end,'[data-notes-phase="next-question"]').opacity).toBe('1');
    expect(end.querySelector('[data-section-bookmark]')!.textContent).toContain('要备注：段落下标注可用素材');
    expect(end.querySelector('[data-script-notes-scene]')!.lastElementChild!.textContent).toBe('接下来要不要规划分段的脚本');
    expect(end.body.innerHTML).not.toMatch(/NaN|Infinity/);
  });
});
