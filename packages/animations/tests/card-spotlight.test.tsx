/** @vitest-environment jsdom */
import type {ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {CardSpotlight} from '../src';
import {SpotlightSequence} from '../../../examples/reference-opening/compositions/SpotlightSequence';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const from={x:20,y:30,width:100,height:60},to={x:400,y:200,width:300,height:180};

describe('caller-controlled card spotlight',()=>{
  it('interpolates caller rectangles and passes the same progress to its content',()=>{
    const scene=dom(<CardSpotlight progress={.5} from={from} to={to} content={p=><span data-content-progress>{p}</span>}/>);
    const panel=scene.querySelector<HTMLElement>('[data-spotlight-panel]')!;
    expect(panel.style.left).toBe('210px');expect(panel.style.top).toBe('115px');
    expect(panel.style.width).toBe('200px');expect(panel.style.height).toBe('120px');
    expect(panel.textContent).toBe('0.5');
    expect(scene.querySelector('[data-spotlight-badge]')).toBeNull();
  });
  it('holds or returns solely according to caller progress, independent of playback history',()=>{
    const render=(progress:number)=>renderToStaticMarkup(<CardSpotlight progress={progress} from={from} to={to} content={<span>任意内容</span>}/>);
    const initial=render(0),expandedMarkup=render(1),expanded=dom(<div dangerouslySetInnerHTML={{__html:expandedMarkup}}/>);
    const panel=expanded.querySelector<HTMLElement>('[data-spotlight-panel]')!;
    expect(panel.style.left).toBe('400px');expect(panel.style.top).toBe('200px');expect(panel.style.width).toBe('300px');
    render(.3);expect(render(0)).toBe(initial);expect(render(1)).toBe(expandedMarkup);
  });
  it('allows custom corner radii and optional background dimming',()=>{
    const scene=dom(<CardSpotlight progress={.5} from={from} to={to} fromRadius={4} toRadius={20} dimColor="#000" dimOpacity={.4} content="内容"/>);
    expect(scene.querySelector<HTMLElement>('[data-spotlight-panel]')!.style.borderRadius).toBe('12px');
    const dimmer=scene.querySelector<HTMLElement>('[data-spotlight-dimmer]')!;
    expect(dimmer.style.opacity).toBe('0.2');expect(dimmer.style.backgroundColor).toBe('rgb(0, 0, 0)');
    const clear=dom(<CardSpotlight progress={1} from={from} to={to} dimOpacity={0} content="内容"/>);
    expect(clear.querySelector<HTMLElement>('[data-spotlight-dimmer]')!.style.opacity).toBe('0');
  });
  it('bounds progress and prevents invalid rectangle sizes or non-finite geometry',()=>{
    for(const progress of [-1,NaN,2]){
      const scene=dom(<CardSpotlight progress={progress} from={{...from,x:NaN,width:-10}} to={{...to,x:Infinity,height:NaN}} fromRadius={-5} dimOpacity={NaN} content={p=><span>{p}</span>}/>);
      const panel=scene.querySelector<HTMLElement>('[data-spotlight-panel]')!;
      expect(scene.body.innerHTML).not.toMatch(/NaN|Infinity/);
      expect(parseFloat(panel.style.width)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(panel.style.height)).toBeGreaterThanOrEqual(0);
      expect(panel.textContent).toBe(progress===2?'1':'0');
    }
  });
  it('keeps fixed timing and captions in the example composition',()=>{
    const expanded=dom(<SpotlightSequence time={2.2} from={from} badge="案例说明" content="画面"/>);
    const panel=expanded.querySelector<HTMLElement>('[data-spotlight-panel]')!,badge=expanded.querySelector<HTMLElement>('[data-spotlight-badge]')!;
    expect(panel.style.width).toBe('336px');expect(badge.style.opacity).toBe('1');
    expect(expanded.querySelector('[data-card-spotlight]')!.contains(badge)).toBe(false);
    const returned=dom(<SpotlightSequence time={3.5} from={from} badge="案例说明" content="画面"/>);
    expect(returned.querySelector<HTMLElement>('[data-spotlight-panel]')!.style.left).toBe('20px');
    expect(returned.querySelector<HTMLElement>('[data-spotlight-badge]')!.style.opacity).toBe('0');
  });
});
