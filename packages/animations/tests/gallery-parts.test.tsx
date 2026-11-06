/** @vitest-environment jsdom */
import type {ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {CardEntrance,FocusLayer} from '../src';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const rect={x:110,y:120,width:350,height:170};

describe('independent card entry and foreground focus',()=>{
  it('uses the caller position, direction, content and entry progress for a single card',()=>{
    const scene=dom(<CardEntrance progress={.5} x={20} y={30} width={180} height={100} rotation={7} offset={{x:20,y:-30}}>自定义卡片</CardEntrance>);
    const card=scene.querySelector<HTMLElement>('[data-card-entrance]')!;
    expect(card.style.left).toBe('20px');expect(card.style.width).toBe('180px');
    expect(card.style.opacity).toBe('0.5');expect(card.style.transform).toBe('translate(10px,-15px) rotate(7deg)');
    expect(card.textContent).toBe('自定义卡片');
    expect(scene.querySelector('[data-focus-layer]')).toBeNull();
  });
  it('allows more than five cards with independent positions and progress',()=>{
    const scene=dom(<>{Array.from({length:6},(_,i)=><CardEntrance key={i} progress={i/5} x={20+i*110} y={100} width={100} height={80}>卡片 {i+1}</CardEntrance>)}</>);
    const cards=Array.from(scene.querySelectorAll<HTMLElement>('[data-card-entrance]'));
    expect(cards).toHaveLength(6);expect(new Set(cards.map(card=>card.style.left)).size).toBe(6);
    expect(cards[0].style.opacity).toBe('0');expect(cards[5].style.opacity).toBe('1');
    expect(cards[5].style.left).toBe('570px');
  });
  it('focuses arbitrary content without requiring document cards or a fixed caption',()=>{
    const scene=dom(<FocusLayer progress={.5} rect={rect} background={<span>任意背景</span>} foreground={<strong>重点内容</strong>}/>);
    const background=scene.querySelector<HTMLElement>('[data-focus-background]')!,foreground=scene.querySelector<HTMLElement>('[data-focus-foreground]')!;
    expect(background.style.filter).toBe('blur(1.5px)');expect(Number(background.style.opacity)).toBeCloseTo(.675,8);
    expect(foreground.style.left).toBe('110px');expect(foreground.style.width).toBe('350px');
    expect(foreground.style.opacity).toBe('0.5');expect(foreground.style.transform).toBe('translateY(12px) scale(0.98)');
    expect(foreground.textContent).toBe('重点内容');
    expect(scene.querySelector('[data-card-entrance], [data-gallery-badge]')).toBeNull();
    expect(scene.body.textContent).not.toContain('别拿老方法');
  });
  it('supports custom focus styling and can seek without relying on prior playback',()=>{
    const node=(progress:number)=><FocusLayer progress={progress} rect={rect} blur={8} backgroundOpacity={.2} offset={{x:10,y:-20}} fromScale={.8} panelStyle={{background:'#111'}} background={<span/>} foreground="说明"/>;
    const remembered=renderToStaticMarkup(node(.5)),scene=dom(node(.5));
    expect(scene.querySelector<HTMLElement>('[data-focus-background]')!.style.filter).toBe('blur(4px)');
    const foreground=scene.querySelector<HTMLElement>('[data-focus-foreground]')!;
    expect(foreground.style.transform).toBe('translate(5px,-10px) scale(0.9)');
    expect(foreground.style.backgroundColor).toBe('rgb(17, 17, 17)');
    renderToStaticMarkup(node(1));expect(renderToStaticMarkup(node(.5))).toBe(remembered);
  });
  it('clamps progress and avoids non-finite geometry for both standalone actions',()=>{
    for(const progress of [-1,NaN,2]){
      const scene=dom(<><CardEntrance progress={progress} x={NaN} y={Infinity} width={-10} height={50} offset={{x:Infinity,y:NaN}}>卡片</CardEntrance><FocusLayer progress={progress} rect={{x:NaN,y:Infinity,width:-100,height:80}} blur={Infinity} fromScale={NaN} background="背景" foreground="重点"/></>);
      expect(scene.body.innerHTML).not.toMatch(/NaN|Infinity/);
      expect(scene.querySelector<HTMLElement>('[data-card-entrance]')!.style.opacity).toBe(progress===2?'1':'0');
      expect(scene.querySelector<HTMLElement>('[data-focus-foreground]')!.style.width).toBe('0px');
    }
  });
});
