/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1920,height:1080,durationInFrames:2880}),staticFile:(file:string)=>file,AbsoluteFill:({children,style}:{children?:ReactNode;style?:CSSProperties})=><div style={style}>{children}</div>,Img:({src,style}:{src:string;style?:CSSProperties})=><img src={src} style={style}/>}));
import {ExplodedLayers} from '../src';
import {ScriptFilm} from '../../../examples/reference-opening/ScriptScene';
import {OpeningScene} from '../../../examples/reference-opening/OpeningScene';
import {MaterialDemo} from '../../../apps/catalog/src/MaterialDemo';
const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const film=(frame:number)=>{clock.frame=frame;return dom(<ScriptFilm/>);};
const style=(scene:Document,selector:string)=>scene.querySelector<HTMLElement>(selector)!.style;

describe('live content within approved panels',()=>{
  it('moves the inner wave and playhead while the expanded layer geometry remains fixed',()=>{
    const first=film(1863),later=film(1881);
    const panels=(scene:Document)=>Array.from(scene.querySelectorAll<HTMLElement>('[data-script-stack] [data-perspective-panel]'),el=>el.getAttribute('style'));
    expect(panels(first)).toEqual(panels(later));
    expect(first.querySelector('[data-script-stack] [data-wave-bar="40"]')!.getAttribute('height')).not.toBe(later.querySelector('[data-script-stack] [data-wave-bar="40"]')!.getAttribute('height'));
    expect(first.querySelector('[data-script-stack] [data-timeline-playhead]')!.getAttribute('x1')).not.toBe(later.querySelector('[data-script-stack] [data-timeline-playhead]')!.getAttribute('x1'));
    clock.frame=150+63;const opening=dom(<OpeningScene/>);clock.frame=150;const catalogue=dom(<MaterialDemo id="exploded-layers"/>);
    expect(Number(opening.querySelector('[data-wave-bar="40"]')!.getAttribute('height'))).toBeCloseTo(Number(catalogue.querySelector('[data-wave-bar="40"]')!.getAttribute('height')),8);
    expect(style(opening,'[data-layer-content="script"] [data-panel-scroll-content]').transform).toBe(style(catalogue,'[data-layer-content="script"] [data-panel-scroll-content]').transform);
  });
  it('scrolls real document pages continuously, then stops before drawing the annotation',()=>{
    const first=film(1980),later=film(2040),stopped=film(2118),held=film(2190);
    const y=(scene:Document)=>Number(style(scene,'[data-script-scroll-content]').transform.match(/translateY\(([-\d.]+)px\)/)![1]);
    expect(y(first)).toBeLessThan(0);expect(y(later)).toBeLessThan(y(first));
    expect(y(stopped)).toBe(-233);expect(y(held)).toBe(-233);
    expect(style(stopped,'[data-script-highlight]').opacity).toBe('1');
    expect(style(stopped,'[data-script-scroll-viewport]').overflow).toBe('hidden');
    expect(style(stopped,'[data-script-scroll-content]').height).toBe('calc(100% + 233px)');
    expect(stopped.querySelectorAll('[data-script-pages] img')).toHaveLength(2);
    for(const local of [54,90,150,210,270]){
      const actual=film(1854+local);clock.frame=local;const demo=dom(<MaterialDemo id="script-document-guide"/>);
      expect(Number(actual.querySelector('[data-script-scroll-content]')!.getAttribute('data-scroll-progress'))).toBeCloseTo(Number(demo.querySelector('[data-script-scroll-content]')!.getAttribute('data-scroll-progress')),8);
    }
  });
  it('accepts static and live content without changing the panel poses or becoming dependent on play history',()=>{
    const layers=[{id:'page',label:'正文',content:<span>static</span>}];
    const fixed=dom(<ExplodedLayers time={3} layers={layers} screen={<span>screen</span>}/>);
    const live=()=>dom(<ExplodedLayers time={3} layers={[{...layers[0],content:elapsed=><span data-age>{elapsed}</span>}]} screen={elapsed=><span data-screen-age>{elapsed}</span>}/>);
    const animated=live();
    const poses=(scene:Document)=>Array.from(scene.querySelectorAll('[data-perspective-panel]'),el=>el.getAttribute('style'));
    expect(poses(animated)).toEqual(poses(fixed));
    expect(Number(animated.querySelector('[data-age]')!.textContent)).toBeCloseTo(1.8,8);
    expect(live().body.innerHTML).toBe(animated.body.innerHTML);
  });
});
