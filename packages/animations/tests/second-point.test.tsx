/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
  useCurrentFrame:()=>clock.frame,
  useVideoConfig:()=>({fps:30,width:1920,height:1080,durationInFrames:1575}),
  staticFile:(file:string)=>file,
  AbsoluteFill:({children,style}:{children?:ReactNode;style?:CSSProperties})=><div style={style}>{children}</div>,
  Img:({src,style}:{src:string;style?:CSSProperties})=><img src={src} style={style}/>,
}));
import {BeforeWorkScene} from '../../../examples/reference-opening/SecondPointScene';
import {FirstPointScene} from '../../../examples/reference-opening/ContinuationScene';
import {MaterialDemo} from '../../../apps/catalog/src/MaterialDemo';
import {RisingCurve,TetheredMotion} from '../src';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const at=(frame:number)=>{clock.frame=frame;return dom(<BeforeWorkScene/>);};
const styles=(document:Document,selector:string)=>Array.from(document.querySelectorAll(selector),el=>el.getAttribute('style'));
const rounded=(value:string|null)=>value?.replace(/(?<![#a-z\d])-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi,n=>String(Number(Number(n).toFixed(6))));

describe('second point through the before-work title',()=>{
  it('keeps the existing first 25 seconds as the original scene',()=>{
    for(const frame of [0,67,299,314,385,571,600,627,711,732,749]){
      const full=at(frame);clock.frame=frame;const original=dom(<FirstPointScene/>);
      expect(styles(full,'[data-opening-scene], [data-path-card], [data-title-layer], [data-section-bookmark]')).toEqual(styles(original,'[data-opening-scene], [data-path-card], [data-title-layer], [data-section-bookmark]'));
      expect(full.body.textContent).toBe(original.body.textContent);
      expect(full.querySelector('[data-second-point-scene]')).toBeNull();
    }
  });
  it('plays the observed phase order without keeping earlier scenes visible',()=>{
    for(const [frame,active] of [[780,'aim'],[1065,'tether'],[1155,'growth'],[1305,'documents'],[1470,'release']] as const){
      const document=at(frame);
      for(const phase of document.querySelectorAll<HTMLElement>('[data-second-phase]'))expect(Number(phase.style.opacity)).toBe(phase.dataset.secondPhase===active?1:0);
    }
  });
  it('lands off center before the reticle centers and the target moves left',()=>{
    const shot=at(774),centered=at(804),settled=at(858);
    expect(shot.querySelector('[data-target-shot]')!.getAttribute('opacity')).toBe('1');
    expect(Number(shot.querySelector('[data-target-crosshair]')!.getAttribute('opacity'))).toBeCloseTo(0,10);
    expect(centered.querySelector('[data-target-crosshair]')!.getAttribute('transform')).toBe('translate(0 0)');
    expect(settled.querySelector('[data-target-face]')!.getAttribute('transform')).toBe('translate(199 277) scale(0.78)');
    const recoil=(frame:number)=>at(frame).querySelector('[data-target-impact]')!.getAttribute('transform');
    expect(recoil(767)).toBe('translate(0 0) rotate(0)');
    const first=recoil(769)!,second=recoil(770)!;
    const offset=(transform:string)=>Number(transform.match(/translate\(([-\d.e+]+)/)![1]);
    expect(Math.abs(offset(first))).toBeGreaterThan(1);
    expect(offset(first)*offset(second)).toBeLessThan(0);
    expect(recoil(777)).toBe('translate(0 0) rotate(0)');
    expect(recoil(769)).toBe(first); // A random seek must not change the recoil.
  });
  it('closes the switches in sequence and strikes only the completed rows',()=>{
    const first=at(924),rows=first.querySelectorAll<HTMLElement>('[data-constraint-switch]');
    expect(rows[0].dataset.switchOff).toBe('1');expect(rows[1].style.opacity).toBe('0');
    expect(rows[0].querySelector<HTMLElement>('[data-switch-thumb]')!.style.left).toBe('3px');
    const finished=at(996).querySelectorAll<HTMLElement>('[data-constraint-switch]');
    for(const row of finished){expect(row.dataset.switchOff).toBe('1');expect(row.querySelector<HTMLElement>('[data-switch-strike]')!.style.transform).toBe('scaleX(1)');}
  });
  it('moves the actor forward, catches it with the rope and shows only one pose',()=>{
    let previous=-Infinity;
    for(const frame of [1002,1014,1026,1038,1044]){
      const document=at(frame),actor=document.querySelector<HTMLElement>('[data-tether-actor]')!;
      const x=parseFloat(actor.style.left);expect(x).toBeGreaterThanOrEqual(previous);previous=x;
      expect(actor.querySelectorAll('img')).toHaveLength(1);
    }
    const caught=at(1050);
    expect(caught.querySelector('[data-tether-actor] img')!.getAttribute('src')).toContain('characters/runner-v2.png');
    expect(caught.querySelector('[data-runner-sprite]')!.getAttribute('data-pose')).toBe('caught');
    expect(caught.querySelector('[data-tether-rope]')!.getAttribute('opacity')).toBe('1');
  });
  it('holds the caught actor before a slow pullback while keeping the rope curved',()=>{
    const actor=(frame:number)=>at(frame).querySelector<HTMLElement>('[data-tether-actor]')!;
    const x=(frame:number)=>parseFloat(actor(frame).style.left);
    expect(Number(at(1032).querySelector('[data-tether-rope]')!.getAttribute('data-taut'))).toBeLessThan(1);
    expect(at(1044).querySelector('[data-tether-rope]')!.getAttribute('data-taut')).toBe('1');
    for(const frame of [1050,1058,1059]){
      expect(x(frame)).toBeCloseTo(x(1044),8);
      expect(actor(frame).style.top).toBe(actor(1044).style.top);
      expect(actor(frame).style.transform).toBe(actor(1044).style.transform);
    }
    expect(x(1059)-x(1065)).toBeGreaterThan(0);
    expect(x(1059)-x(1065)).toBeLessThan(12);
    expect(x(1065)).toBeGreaterThan(x(1076));
    expect(x(1076)).toBeGreaterThan(x(1089));
    expect(x(1089)).toBeGreaterThan(x(1092));
    expect(actor(1048).style.transform).not.toBe('rotate(0deg)');
    expect(x(1103)).toBeCloseTo(446,8);
    expect(x(1044)-x(1103)).toBeCloseTo(72,8);
    expect(actor(1103).style.top).toBe('205px');
    for(const frame of [1044,1058,1076,1092,1103]){
      const path=at(frame).querySelector('[data-tether-rope] path')!.getAttribute('d')!;
      const points=Array.from(path.matchAll(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g),match=>Number(match[0]));
      expect(points[3]-(points[1]+points[5])/2).toBeGreaterThanOrEqual(18-1e-8);
    }
    for(const frame of [1032,1044,1050,1058,1065,1076,1089,1103]){
      const film=at(frame);clock.frame=frame-1002;
      const demo=dom(<MaterialDemo id="tethered-motion"/>);
      const filmActor=film.querySelector<HTMLElement>('[data-tether-actor]')!,demoActor=demo.querySelector<HTMLElement>('[data-tether-actor]')!;
      for(const key of ['left','top'] as const)expect(parseFloat(filmActor.style[key])).toBeCloseTo(parseFloat(demoActor.style[key]),8);
      const numbers=(value:string)=>Array.from(value.matchAll(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g),match=>Number(match[0]));
      const filmPose=numbers(filmActor.style.transform),demoPose=numbers(demoActor.style.transform);
      filmPose.forEach((value,index)=>expect(value).toBeCloseTo(demoPose[index],8));
      const filmRope=numbers(film.querySelector('[data-tether-rope] path')!.getAttribute('d')!),demoRope=numbers(demo.querySelector('[data-tether-rope] path')!.getAttribute('d')!);
      expect(filmRope).toHaveLength(demoRope.length);
      filmRope.forEach((value,index)=>expect(value).toBeCloseTo(demoRope[index],8));
    }
  });
  it('animates a run cycle, plays the brace once and holds it during the slow pull',()=>{
    const sprite=(frame:number)=>at(frame).querySelector<HTMLElement>('[data-runner-sprite]')!;
    expect(sprite(1002).dataset.spriteFrame).toBe('0');
    expect(sprite(1022).dataset.spriteFrame).toBe('0');
    expect(new Set([1002,1005,1008,1011].map(frame=>sprite(frame).dataset.spriteFrame)).size).toBe(4);
    expect(sprite(1043).dataset.pose).toBe('caught');
    expect(sprite(1043).dataset.spriteFrame).toBe('8');
    expect(Number(sprite(1050).dataset.spriteFrame)).toBeGreaterThan(8);
    for(const frame of [1056,1059,1065,1089,1103])expect(sprite(frame).dataset.spriteFrame).toBe('15');
    const seek=sprite(1050).outerHTML;at(1103);expect(sprite(1050).outerHTML).toBe(seek);
    for(const frame of [1002,1008,1043,1050,1056,1089]){
      const film=sprite(frame);clock.frame=frame-1002;
      const demo=dom(<MaterialDemo id="tethered-motion"/>).querySelector<HTMLElement>('[data-runner-sprite]')!;
      expect(film.dataset.spriteFrame).toBe(demo.dataset.spriteFrame);
      expect(film.querySelector('img')!.getAttribute('style')).toBe(demo.querySelector('img')!.getAttribute('style'));
    }
  });
  it('continues to support custom running and caught content without a sprite atlas',()=>{
    const custom=(time:number)=>dom(<TetheredMotion time={time} running={<span>custom run</span>} caught={<span>custom brace</span>}/>);
    expect(custom(.5).querySelector('[data-tether-actor]')!.textContent).toBe('custom run');
    expect(custom(2).querySelector('[data-tether-actor]')!.textContent).toBe('custom brace');
    expect(custom(2).querySelector('[data-runner-sprite]')).toBeNull();
  });
  it('moves the growth tip up and right and keeps multiple gradient instances independent',()=>{
    let previous={x:0,y:450};
    for(const frame of [1125,1145,1170]){
      const tip=at(frame).querySelector('[data-growth-tip]')!;
      const current={x:Number(tip.getAttribute('cx')),y:Number(tip.getAttribute('cy'))};
      expect(current.x).toBeGreaterThan(previous.x);expect(current.y).toBeLessThan(previous.y);previous=current;
    }
    const two=dom(<><RisingCurve progress={1}/><RisingCurve progress={1} color="#409eff"/></>);
    const ids=Array.from(two.querySelectorAll('linearGradient'),gradient=>gradient.id);
    expect(new Set(ids).size).toBe(2);
  });
  it('focuses the quote over blurred documents, then drops constraints before revealing the result',()=>{
    const gallery=at(1230),focused=at(1305);
    expect(gallery.querySelectorAll('[data-focus-document]')).toHaveLength(5);
    expect(gallery.querySelector<HTMLElement>('[data-document-focus]')!.style.opacity).toBe('0');
    expect(focused.querySelector<HTMLElement>('[data-document-focus]')!.style.opacity).toBe('1');
    expect(focused.querySelector<HTMLElement>('[data-document-background]')!.style.filter).toBe('blur(3px)');
    const tags=at(1404).querySelectorAll<HTMLElement>('[data-release-tag]');
    expect(tags).toHaveLength(6);expect(Array.from(tags).every(tag=>Number(tag.style.opacity)===1)).toBe(true);
    const released=at(1485);
    expect(Array.from(released.querySelectorAll<HTMLElement>('[data-release-tag]')).every(tag=>Number(tag.style.opacity)===0)).toBe(true);
    expect(released.querySelector<HTMLElement>('[data-release-screen]')!.style.width).toBe('356px');
    expect(released.querySelector<HTMLElement>('[data-release-badge]')!.style.opacity).toBe('1');
  });
  it('shares gallery timing with the catalog and stops on the before-work title',()=>{
    for(const localFrame of [0,30,69,80,96,105]){
      const film=at(1194+localFrame);clock.frame=localFrame;const catalog=dom(<MaterialDemo id="document-focus-gallery"/>);
      expect(styles(film,'[data-document-background], [data-focus-document], [data-document-focus]').map(rounded)).toEqual(styles(catalog,'[data-document-background], [data-focus-document], [data-document-focus]').map(rounded));
    }
    const end=at(1574),title=end.querySelector<HTMLElement>('[data-before-work]')!;
    expect(title.style.opacity).toBe('1');expect(title.textContent).toBe('开工之前我会先准备这些素材');
    expect(end.querySelectorAll('[data-preparation-card]')).toHaveLength(0);
    expect(end.querySelector('[data-second-point-scene]')).not.toBeNull();
  });
});
