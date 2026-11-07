/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1280,height:720}),AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>}));
import {ProgressRowExample} from '../../../examples/component-examples/progress-row/Example';
import {ProgressRace} from '../../../examples/reference-opening/compositions/ProgressRace';
import example from '../../../examples/component-examples/progress-row/example.json';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const rows=(scene:Document)=>Array.from(scene.querySelectorAll('[data-progress-race] [style]'),node=>({style:node.getAttribute('style'),text:node.textContent}));

describe('ProgressRow full comparison example',()=>{
  it('uses the original case choreography from entry to the last frame and can seek backward',()=>{
    for(const frame of [0,30,90,120,165,225,269,120]){
      clock.frame=frame;
      const preview=dom(<ProgressRowExample {...example.defaultProps}/>);
      const original=dom(<ProgressRace {...example.defaultProps} time={frame/30}/>);
      expect(rows(preview)).toEqual(rows(original));
      expect(preview.querySelector<HTMLElement>('[data-component-example]')!.style.transform).toBe('scale(1.6,1.6)');
    }
  });
  it('can replace comparison copy and counting while retaining both reusable progress rows',()=>{
    clock.frame=269;
    const scene=dom(<ProgressRowExample title="两种处理方式" firstLabel="方式甲" secondLabel="方式乙" winnerLabel="完成" slowLabel="处理中" countTo={120} phrases={['等待','校验']}/>);
    expect(scene.querySelectorAll('[data-progress-row]')).toHaveLength(2);
    for(const text of ['两种处理方式','方式甲','方式乙','完成','处理中','等待','校验'])expect(scene.body.textContent).toContain(text);
    expect(scene.querySelector('[data-race-count]')!.textContent).toBe('120');
    expect(scene.body.textContent).not.toContain('6,000');
  });
});
