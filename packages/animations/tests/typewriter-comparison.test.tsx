/** @vitest-environment jsdom */
import type {ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {TypewriterComparison,type TypewriterComparisonProps} from '../src';
import {getComparisonThumbnailRect} from '../src/reference-opening/TypewriterComparison';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const scene=(time:number,props:Partial<TypewriterComparisonProps>={})=>dom(<TypewriterComparison time={time} left={{text:'甲乙丙丁'}} right={{text:'ABCD'}} {...props}/>);
const style=(doc:Document,selector:string)=>doc.querySelector<HTMLElement>(selector)!.style;
const typed=(doc:Document,selector:string)=>doc.querySelector(selector)!.textContent;

describe('neutral complete typewriter comparison',()=>{
  it('types in sequence without imposing opinions, checks, badges or business copy',()=>{
    const first=scene(1.5),second=scene(3.5);
    expect(typed(first,'[data-own-typed]')).not.toBe('');
    expect(typed(first,'[data-ai-typed]')).toBe('');
    expect(typed(second,'[data-own-typed]')).toBe('甲乙丙丁');
    expect(typed(second,'[data-ai-typed]')).toBe('ABCD');
    expect(second.querySelector('[data-writing-check]')).toBeNull();
    expect(style(second,'[data-own-typed]').textDecoration).toBe('none');
    expect((second.querySelector('[data-ai-typed]')!.parentElement as HTMLElement).style.opacity).toBe('1');
    for(const copy of ['自己写','AI 校验','没有体感','Vibe','交给 AI'])expect(second.body.textContent).not.toContain(copy);
  });
  it('accepts caller-owned heading, side labels, compact descriptions and thumbnail content',()=>{
    const doc=scene(6,{heading:'方案对照',left:{text:'左正文',label:'左身份',columnTitle:'左栏',compactTitle:'左摘要',compactDescription:'左说明',thumbnail:<span>左插图</span>},right:{text:'右正文',label:'右身份',columnTitle:'右栏',compactTitle:'右摘要',compactDescription:'右说明',thumbnail:<span>右插图</span>}});
    for(const copy of ['方案对照','左正文','右正文','左身份','右身份','左栏','右栏','左摘要','右摘要','左说明','右说明','左插图','右插图'])expect(doc.body.textContent).toContain(copy);
    expect(style(doc,'[data-writing-own]').height).toBe('66px');
    expect(style(doc,'[data-writing-ai]').width).toBe('320px');
  });
  it('allows expanded comparison to hold without check, dim or compact stages',()=>{
    const doc=scene(20,{compact:false,check:false,dim:false});
    expect(style(doc,'[data-writing-own]').height).toBe('176px');
    expect(style(doc,'[data-writing-ai]').width).toBe('268px');
    expect(doc.querySelector('[data-writing-check], [data-writing-ai-thumbnail]')).toBeNull();
    expect((doc.querySelector('[data-ai-typed]')!.parentElement as HTMLElement).style.opacity).toBe('1');
  });
  it('uses caller timing for each typing, check, dim and compact stage relative to startAt',()=>{
    const props:Partial<TypewriterComparisonProps>={startAt:10,left:{text:'甲乙丙丁',typing:{startAt:1,duration:2}},right:{text:'ABCD',typing:{startAt:3,duration:2}},check:{label:'待核实',startAt:3,duration:1,underlineAt:4},dim:{startAt:5,duration:2,opacity:.2,badge:'备注'},compact:{startAt:8,duration:2}};
    const early=scene(12,props),middle=scene(14,props),dimmed=scene(17,props),compact=scene(20,props);
    expect(typed(early,'[data-own-typed]')).toBe('甲乙');expect(typed(early,'[data-ai-typed]')).toBe('');
    expect(typed(middle,'[data-ai-typed]')).toBe('AB');expect(style(middle,'[data-writing-check]').opacity).toBe('1');
    expect(style(middle,'[data-own-typed]').textDecoration).toBe('none');
    expect(style(dimmed,'[data-own-typed]').textDecoration).toBe('underline');
    expect(Number((dimmed.querySelector('[data-ai-typed]')!.parentElement as HTMLElement).style.opacity)).toBeCloseTo(.2);
    expect(style(dimmed,'[data-writing-own]').height).toBe('176px');
    expect(style(compact,'[data-writing-own]').height).toBe('66px');
  });
  it('allows a check without underlines and a dim without a badge',()=>{
    const doc=scene(4.5,{check:{label:'自定义提示',underlineAt:false},dim:{opacity:.6}});
    expect(style(doc,'[data-writing-check]').opacity).toBe('1');
    expect(style(doc,'[data-own-typed]').textDecoration).toBe('none');
    expect(Number((doc.querySelector('[data-ai-typed]')!.parentElement as HTMLElement).style.opacity)).toBeCloseTo(.6);
    expect(doc.body.textContent).not.toContain('没有体感');
  });
  it('preserves explicit empty content and null titles instead of filling in sample copy',()=>{
    const doc=scene(6,{heading:null,left:{text:'',label:'左身份',columnTitle:'左栏',compactTitle:null,thumbnail:null},right:{text:'',label:'右身份',compactTitle:'',compactDescription:null,thumbnail:null}});
    expect(typed(doc,'[data-own-typed]')).toBe('');expect(typed(doc,'[data-ai-typed]')).toBe('');
    const left=doc.querySelector('[data-writing-own]')!.lastElementChild!,right=doc.querySelector('[data-writing-ai]')!.lastElementChild!;
    expect(left.textContent).toBe('');expect(right.textContent).toBe('');
  });
  it('types Unicode code points intact and remains deterministic on backward seeks',()=>{
    const props={left:{text:'😀中',typing:{startAt:0,duration:2}}};
    expect(typed(scene(1,props),'[data-own-typed]')).toBe('😀');
    const before=scene(1,props).body.innerHTML;scene(6,props);
    expect(scene(1,props).body.innerHTML).toBe(before);
  });
  it('supports instant stages and replaces invalid phase values with finite defaults',()=>{
    const props={left:{text:'instant',typing:{startAt:2,duration:0}},right:{text:'instant',typing:{startAt:2,duration:-1}},compact:{startAt:4,duration:0}};
    expect(typed(scene(1.99,props),'[data-own-typed]')).toBe('');
    expect(typed(scene(2,props),'[data-own-typed]')).toBe('instant');
    expect(typed(scene(2,props),'[data-ai-typed]')).toBe('instant');
    expect(style(scene(4,props),'[data-writing-own]').height).toBe('66px');
    const invalid=scene(6,{left:{text:'safe',typing:{startAt:NaN,duration:Infinity}},dim:{startAt:NaN,duration:-Infinity,opacity:NaN},compact:{startAt:Infinity,duration:NaN}});
    expect(invalid.body.innerHTML).not.toMatch(/NaN|Infinity/);
    expect(typed(invalid,'[data-own-typed]')).toBe('safe');
  });
  it('keeps thumbnail coordinates aligned to both actual cards through default, custom and disabled compact stages',()=>{
    for(const compact of [undefined,false,{startAt:1,duration:1}] as const)for(const time of [0,1,1.5,2,4.9,5.2,5.5,8]){
      const doc=scene(time+10,{startAt:10,compact});
      for(const side of ['left','right'] as const){
        const card=style(doc,side==='left'?'[data-writing-own]':'[data-writing-ai]');
        const rect=getComparisonThumbnailRect(side,time+10,10,compact);
        expect(rect.x).toBeCloseTo(parseFloat(card.left)+15,8);
        expect(rect.y).toBeCloseTo(parseFloat(card.top)+(parseFloat(card.height)-42)/2,8);
        expect(rect.width).toBe(54);expect(rect.height).toBe(42);
      }
    }
  });
});
