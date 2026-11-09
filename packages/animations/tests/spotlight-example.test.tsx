/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1280,height:720}),AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>}));
import {CardSpotlightExample} from '../../../examples/component-examples/card-spotlight/Example';
import {SpotlightSequence} from '../../../examples/reference-opening/compositions/SpotlightSequence';
import {getAiComparisonThumbnailRect} from '../../../examples/reference-opening/compositions/WritingComparison';
import example from '../../../examples/component-examples/card-spotlight/example.json';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const appearance=(scene:Document)=>Array.from(scene.querySelectorAll('[data-spotlight-panel], [data-spotlight-dimmer], [data-spotlight-badge]'),node=>({style:node.getAttribute('style'),text:node.textContent}));

describe('full spotlight and return example',()=>{
  it('uses the original zoom, hold, caption and return choreography including backward seeks',()=>{
    for(const frame of [0,3,6,12,30,57,66,89,90,96,102,105,119,30]){
      clock.frame=frame;
      const preview=dom(<CardSpotlightExample {...example.defaultProps} content="示例画面"/>);
      const original=dom(<SpotlightSequence time={frame/30} from={getAiComparisonThumbnailRect(frame/30+5.4)} fromRadius={3} content="示例画面" badge={example.defaultProps.badge}/>);
      expect(appearance(preview)).toEqual(appearance(original));
      expect(preview.querySelector<HTMLElement>('[data-component-example]')!.style.transform).toBe('scale(1.6,1.6)');
      if(frame>=105){
        const source=preview.querySelector<HTMLElement>('[data-example-source-thumbnail]')!,returned=preview.querySelector<HTMLElement>('[data-spotlight-panel]')!;
        for(const key of ['left','top','width','height','borderRadius'] as const)expect(returned.style[key]).toBe(source.style[key]);
        expect(preview.querySelector<HTMLElement>('[data-spotlight-dimmer]')!.style.opacity).toBe('0');
      }
    }
  });
  it('keeps dynamic source and foreground content on one clock and supports custom or empty content',()=>{
    for(const frame of [30,66,96,105,119]){
      clock.frame=frame;
      const custom=dom(<CardSpotlightExample title="自定义案例" sourceTitle="图表示例" badge="观察变化" content={({time,expanded})=><span data-content-time={time} data-expanded={expanded}>自定义图表</span>}/>);
      const copies=custom.querySelectorAll('[data-content-time]');
      expect(copies).toHaveLength(2);
      for(const node of copies)expect(Number(node.getAttribute('data-content-time'))).toBe(frame/30);
      expect(copies[0].getAttribute('data-expanded')).toBe('0');
      expect(custom.body.textContent).toContain('自定义案例');expect(custom.body.textContent).toContain('图表示例');
      const defaults=dom(<CardSpotlightExample/>),counts=Array.from(defaults.querySelectorAll('[data-neuron-preview]'),node=>({value:node.getAttribute('data-neuron-value'),text:node.querySelector('[data-neuron-count]')!.textContent}));
      expect(counts).toHaveLength(2);expect(counts[0]).toEqual(counts[1]);
    }
    const empty=dom(<CardSpotlightExample content={null} badge={null}/>);
    expect(empty.querySelector('[data-neuron-preview], [data-spotlight-badge]')).toBeNull();
    expect(empty.querySelector('[data-example-source-thumbnail]')!.textContent).toBe('');
    expect(empty.querySelector('[data-spotlight-panel]')!.textContent).toBe('');
  });
});
