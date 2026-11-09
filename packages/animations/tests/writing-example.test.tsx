/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1280,height:720}),AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>}));
import {WritingComparisonExample} from '../../../examples/component-examples/writing-comparison/Example';
import {WritingComparison,writingComparisonDefaults} from '../../../examples/reference-opening/compositions/WritingComparison';
import {NeuronPreview} from '../src/reference-opening/NeuronPreview';
import example from '../../../examples/component-examples/writing-comparison/example.json';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');

describe('complete original writing comparison example',()=>{
  it('shares the original case across typing, checking, dimming and collection including backward seeks',()=>{
    expect(example.defaultProps).toEqual({ownText:writingComparisonDefaults.ownText,aiText:writingComparisonDefaults.aiText});
    for(const frame of [0,5,30,51,60,69,81,105,115,132,147,156,165,180,209,60]){
      clock.frame=frame;
      const preview=dom(<WritingComparisonExample {...example.defaultProps} ownThumbnail="left" aiThumbnail="right"/>);
      const original=dom(<WritingComparison time={frame/30} ownThumbnail="left" aiThumbnail="right"/>);
      expect(preview.querySelector('[data-writing-comparison]')!.outerHTML).toBe(original.querySelector('[data-writing-comparison]')!.outerHTML);
      expect(preview.querySelector<HTMLElement>('[data-component-example]')!.style.transform).toBe('scale(1.6,1.6)');
    }
  });
  it('replaces case copy and content without changing the motion or reintroducing defaults for empty props',()=>{
    clock.frame=120;
    const custom=dom(<WritingComparisonExample ownText="左正文" aiText="右正文" copy={{checkLabel:'审核提示',critique:'继续调整',headingEmphasis:'内容'}} ownThumbnail={<span>左图</span>} aiThumbnail={<span>右图</span>}/>);
    for(const text of ['左正文','右正文','审核提示','继续调整','左图','右图'])expect(custom.body.textContent).toContain(text);
    expect(custom.body.textContent).not.toContain('AI 校验 · 2 处建议');
    const empty=dom(<WritingComparisonExample ownText="" aiText="" ownThumbnail={null} aiThumbnail={null} copy={{checkLabel:'',critique:''}}/>);
    expect(empty.querySelector('[data-writing-check], [data-neuron-preview]')).toBeNull();
    expect(empty.querySelector('[data-own-typed]')!.textContent).toBe('');
    expect(empty.querySelector('[data-ai-typed]')!.textContent).toBe('');
    expect(empty.querySelector('[data-writing-ai-thumbnail]')!.textContent).toBe('');
  });
  it('keeps the default neuron thumbnail on the original continuous clock',()=>{
    const image=(doc:Document)=>{
      const svg=doc.querySelector('[data-neuron-preview]')!;
      return svg.outerHTML.replaceAll(svg.querySelector('[id]')!.id,'shared-gradient');
    };
    for(const frame of [156,162,165,180,209]){
      clock.frame=frame;
      const preview=dom(<WritingComparisonExample/>),expected=dom(<NeuronPreview time={frame/30-5.4}/>);
      expect(image(preview)).toBe(image(expected));
    }
  });
});
