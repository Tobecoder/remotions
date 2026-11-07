/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1280,height:720}),AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>}));
import {ScriptDocumentExample} from '../../../examples/component-examples/script-document/Example';
import {ScriptDocumentGuide} from '../../../examples/reference-opening/compositions/ScriptDocumentGuide';
import example from '../../../examples/component-examples/script-document/example.json';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const appearance=(scene:Document)=>Array.from(scene.querySelectorAll('[data-script-guide] [style]'),node=>({style:node.getAttribute('style'),text:node.textContent}));

describe('full document explanation example',()=>{
  it('keeps the original chapter handoff, document scroll, highlight and title choreography through arbitrary seeks',()=>{
    const {paragraphs:_,...guideProps}=example.defaultProps;
    for(const frame of [0,30,53,54,66,120,180,244,270,315,330,359,180]){
      clock.frame=frame;
      const document=<p>可替换正文</p>;
      const preview=dom(<ScriptDocumentExample {...guideProps} document={document}/>);
      const original=dom(<ScriptDocumentGuide {...guideProps} time={frame/30} document={document}/>);
      expect(appearance(preview)).toEqual(appearance(original));
      expect(preview.querySelector<HTMLElement>('[data-component-example]')!.style.transform).toBe('scale(1.6,1.6)');
      expect(preview.querySelectorAll('[data-document-window], [data-highlight-box], [data-collapsing-title]')).toHaveLength(3);
    }
  });
  it('replaces copy and document content while retaining the combined effect and respecting explicit empty inputs',()=>{
    clock.frame=359;
    const preview=dom(<ScriptDocumentExample eyebrow="操作步骤" scrollDistance={0} document={<div data-custom-document>真实文档内容</div>} copy={{narrationTitle:'操作正文',instructionTitle:'步骤备注',summary:'准备完成',documentTitle:'操作指南'}}/>);
    for(const text of ['操作步骤','操作正文','步骤备注','准备完成','操作指南','真实文档内容'])expect(preview.body.textContent).toContain(text);
    expect(preview.querySelector('[data-example-script-document]')).toBeNull();
    expect(preview.querySelector<HTMLElement>('[data-document-scroll-content]')!.style.transform).toBe('translateY(0px)');
    expect(dom(<ScriptDocumentExample paragraphs={[]}/>).querySelectorAll('[data-example-script-document] p')).toHaveLength(0);
    expect(dom(<ScriptDocumentExample document={null}/>).querySelector('[data-example-script-document]')).toBeNull();
    const custom=dom(<ScriptDocumentExample paragraphs={['第一步','第二步']} scrollDistance={0}/>);
    expect(custom.querySelectorAll('[data-example-script-document] p')).toHaveLength(2);
  });
});
