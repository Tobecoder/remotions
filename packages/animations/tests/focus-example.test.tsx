/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1280,height:720}),AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>}));
import {DocumentFocusExample} from '../../../examples/component-examples/document-focus/Example';
import {DocumentFocusGallery} from '../../../examples/reference-opening/compositions/DocumentFocusGallery';
import example from '../../../examples/component-examples/document-focus/example.json';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const appearance=(scene:Document)=>Array.from(scene.querySelectorAll('[data-focus-background], [data-focus-document], [data-document-caption], [data-focus-foreground], [data-gallery-badge]'),node=>({style:node.getAttribute('style'),text:node.textContent}));

describe('complete document gallery and focus example',()=>{
  it('keeps the original individual entries, caption and foreground focus through arbitrary seeks',()=>{
    const documents=example.defaultProps.cards.map(card=>({id:card.id,content:<span>{card.title}</span>}));
    const focusContent=<p>重点内容</p>,caption=<p>资料说明</p>;
    for(const frame of [0,3,6,12,18,24,30,42,57,60,68,69,80,90,119,179,24]){
      clock.frame=frame;
      const preview=dom(<DocumentFocusExample documents={documents} focusContent={focusContent} caption={caption} badge="重点"/>);
      const original=dom(<DocumentFocusGallery time={frame/30} documents={documents} focusContent={focusContent} caption={caption} badge="重点"/>);
      expect(appearance(preview)).toEqual(appearance(original));
      expect(preview.querySelector<HTMLElement>('[data-component-example]')!.style.transform).toBe('scale(1.6,1.6)');
    }
  });
  it('replaces document summaries, labels and focus content without changing the composition',()=>{
    clock.frame=179;
    const preview=dom(<DocumentFocusExample cards={[{id:'a',label:'资料甲',title:'问题',body:'先说明问题'},{id:'b',label:'资料乙',title:'证据',body:'再展示证据'}]} copy={{captionTitle:'整理材料',focusText:'当前重点',detailText:'补充说明'}} badge="重点标签"/>);
    expect(preview.querySelectorAll('[data-focus-document]')).toHaveLength(2);
    for(const text of ['资料甲','资料乙','先说明问题','再展示证据','整理材料','当前重点','补充说明','重点标签'])expect(preview.body.textContent).toContain(text);
    const custom=dom(<DocumentFocusExample documents={[{id:'custom',content:<div data-custom-document>自定义资料</div>}]} focusContent={<div data-custom-focus>自定义图表</div>} caption={<span>自定义说明</span>}/>);
    expect(custom.querySelectorAll('[data-focus-document]')).toHaveLength(1);
    expect(custom.querySelector('[data-custom-document]')!.textContent).toBe('自定义资料');
    expect(custom.querySelector('[data-custom-focus]')!.textContent).toBe('自定义图表');
    expect(custom.querySelector('[data-example-document], [data-example-focus-content], [data-example-document-caption]')).toBeNull();
    expect(custom.body.textContent).toContain('自定义说明');
  });
  it('keeps explicit empty content empty and rejects extra cards that would overlap the five-card layout',()=>{
    const cardsEmpty=dom(<DocumentFocusExample cards={[]} focusContent={null} caption={null}/>);
    expect(cardsEmpty.querySelectorAll('[data-focus-document]')).toHaveLength(0);
    expect(cardsEmpty.querySelector('[data-example-focus-content], [data-example-document-caption]')).toBeNull();
    expect(dom(<DocumentFocusExample documents={[]}/>).querySelectorAll('[data-focus-document]')).toHaveLength(0);
    const six=Array.from({length:6},(_,index)=>({id:String(index),label:'资料',title:'标题',body:'摘要'}));
    expect(()=>renderToStaticMarkup(<DocumentFocusExample cards={six}/>)).toThrow('最多支持 5 张卡片');
    expect(()=>renderToStaticMarkup(<DocumentFocusExample documents={six.map(card=>({id:card.id,content:'资料'}))}/>)).toThrow('最多支持 5 张卡片');
  });
});
