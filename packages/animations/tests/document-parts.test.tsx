/** @vitest-environment jsdom */
import type {ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {DocumentWindow,HighlightBox,CollapsingTitle} from '../src';
import {ScriptDocumentGuide} from '../../../examples/reference-opening/compositions/ScriptDocumentGuide';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');

describe('independent document presentation parts',()=>{
  it('shows only caller document content and explicit scroll progress, without script choreography',()=>{
    const scene=dom(<DocumentWindow title="操作指南" scrollProgress={.5} scrollDistance={240}><p>自定义教程内容</p></DocumentWindow>);
    expect(scene.querySelector('[data-document-window]')!.textContent).toContain('操作指南');
    expect(scene.querySelector('[data-document-scroll-content]')!.textContent).toBe('自定义教程内容');
    expect(scene.querySelector<HTMLElement>('[data-document-scroll-content]')!.style.transform).toBe('translateY(-120px)');
    expect(scene.querySelector('[data-highlight-box], [data-collapsing-title], [data-chapter-heading]')).toBeNull();
    expect(scene.body.textContent).not.toContain('提示词');
  });
  it('allows a stationary overlay while the document scrolls independently, with safe scroll bounds',()=>{
    const at=(progress:number)=>dom(<DocumentWindow scrollProgress={progress} scrollDistance={200} overlay={<HighlightBox progress={.6} x={10} y={20} width={100} height={50}/>}><p>正文</p></DocumentWindow>);
    const first=at(.2),last=at(2);
    expect(first.querySelector<HTMLElement>('[data-document-scroll-content]')!.style.transform).toBe('translateY(-40px)');
    expect(last.querySelector<HTMLElement>('[data-document-scroll-content]')!.style.transform).toBe('translateY(-200px)');
    expect(first.querySelector('[data-highlight-box]')!.getAttribute('style')).toBe(last.querySelector('[data-highlight-box]')!.getAttribute('style'));
    expect(last.querySelector('[data-document-scroll-viewport]')!.contains(last.querySelector('[data-highlight-box]'))).toBe(false);
    const invalid=dom(<DocumentWindow scrollProgress={NaN} scrollDistance={Infinity}><span/></DocumentWindow>);
    expect(invalid.querySelector('[data-document-scroll-content]')!.getAttribute('style')).not.toMatch(/NaN|Infinity/);
  });
  it('draws a standalone highlight without requiring a window or title',()=>{
    const scene=dom(<HighlightBox progress={.4} x={10} y={20} width={100} height={50} color="blue"/>);
    const box=scene.querySelector<HTMLElement>('[data-highlight-box]')!;
    expect(box.style.transform).toBe('scaleX(0.4)');
    expect(box.style.left).toBe('10px');expect(box.style.borderColor).toBe('blue');
    expect(scene.querySelector('[data-document-window], [data-collapsing-title]')).toBeNull();
  });
  it('moves a single caller-provided title between caller anchors and remains seekable',()=>{
    const render=(progress:number)=>renderToStaticMarkup(<CollapsingTitle progress={progress} title="核心概念" lead="先展开" description="原始说明" compactDescription="摘要" from={{x:120,y:240}} to={{x:60,y:80}} fontSize={40} compactFontSize={20}/>);
    const start=dom(<div dangerouslySetInnerHTML={{__html:render(0)}}/>),end=dom(<div dangerouslySetInnerHTML={{__html:render(1)}}/>);
    expect(start.querySelector<HTMLElement>('[data-collapsing-title]')!.style.top).toBe('240px');
    const title=end.querySelector<HTMLElement>('[data-collapsing-title]')!;
    expect(title.style.left).toBe('60px');expect(title.style.top).toBe('80px');expect(title.style.transform).toBe('scale(0.5)');
    expect(end.querySelectorAll('[data-collapsing-title-text]')).toHaveLength(1);
    expect(end.querySelector('[data-collapsing-title-text]')!.textContent).toBe('核心概念');
    expect(end.querySelector('[data-document-window], [data-highlight-box]')).toBeNull();
    const remembered=render(.3);render(1);expect(render(.3)).toBe(remembered);
  });
  it('lets the example compose the standalone parts without exporting its fixed choreography',()=>{
    const scene=dom(<ScriptDocumentGuide time={9.6} document={<p>自定义内容</p>} copy={{narrationTitle:'讲稿',instructionTitle:'变量类型',documentTitle:'操作指南',summary:'整理知识'}}/>);
    expect(scene.querySelectorAll('[data-document-window]')).toHaveLength(1);
    expect(scene.querySelectorAll('[data-highlight-box]')).toHaveLength(1);
    expect(scene.querySelectorAll('[data-collapsing-title]')).toHaveLength(1);
    expect(scene.querySelector('[data-script-instruction-title]')!.textContent).toBe('变量类型');
    expect(scene.querySelector('[data-document-window]')!.textContent).toContain('操作指南');
    expect(scene.body.textContent).not.toContain('提示词 · 说明');
    expect(scene.body.textContent).toContain('整理知识');
  });
});
