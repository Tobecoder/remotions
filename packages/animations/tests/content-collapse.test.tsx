/** @vitest-environment jsdom */
import type {ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {ContentCollapse} from '../src';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const node=(progress:number)=><ContentCollapse progress={progress} to={{x:70,y:40,scale:.25}}><strong>可替换内容</strong></ContentCollapse>;
const layer=(node:ReactNode)=>dom(node).querySelector<HTMLElement>('[data-content-collapse]')!;

describe('independent content collapse',()=>{
  it('keeps arbitrary caller content visible at the requested endpoints without a summary UI',()=>{
    const start=layer(node(0)),end=layer(node(1));
    expect(start.style.transform).toBe('translate(0px,0px) scale(1)');
    expect(end.style.transform).toBe('translate(70px,40px) scale(0.25)');
    expect(end.style.opacity).toBe('1');expect(end.textContent).toBe('可替换内容');
    expect(dom(node(1)).querySelector('[data-section-bookmark]')).toBeNull();
  });
  it('supports a different starting position and scale without a fixed destination',()=>{
    const content=layer(<ContentCollapse progress={.25} from={{x:200,y:100,scale:1}} to={{x:40,y:-20,scale:.5}}>图表</ContentCollapse>);
    expect(content.style.transform).toBe('translate(160px,70px) scale(0.875)');
    expect(content.style.transformOrigin).toBe('0 0');
  });
  it('lets the caller set fading and wrapper styling independently from movement',()=>{
    const scene=dom(<ContentCollapse progress={.5} to={{x:60,y:30,scale:.2}} opacity={.3} className="custom-content" style={{zIndex:3}}>文档</ContentCollapse>);
    const content=scene.querySelector<HTMLElement>('.custom-content')!;
    expect(content.style.opacity).toBe('0.3');expect(content.style.zIndex).toBe('3');
    expect(content.textContent).toBe('文档');
  });
  it('can seek backward without depending on prior playback',()=>{
    const middle=renderToStaticMarkup(node(.4));
    renderToStaticMarkup(node(1));renderToStaticMarkup(node(0));
    expect(renderToStaticMarkup(node(.4))).toBe(middle);
  });
  it('clamps progress, opacity and scale and keeps non-finite positions out of the output',()=>{
    for(const progress of [-1,NaN,2]){
      const content=layer(<ContentCollapse progress={progress} from={{x:Infinity,y:NaN,scale:NaN}} to={{x:NaN,y:Infinity,scale:-2}} opacity={2}>内容</ContentCollapse>);
      expect(content.outerHTML).not.toMatch(/NaN|Infinity/);
      expect(content.style.transform).toBe(`translate(0px,0px) scale(${progress===2?0:1})`);
      expect(content.style.opacity).toBe('1');
    }
  });
});
