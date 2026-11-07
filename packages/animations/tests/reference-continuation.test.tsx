/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
  useCurrentFrame:()=>clock.frame,
  useVideoConfig:()=>({fps:30,width:1920,height:1080,durationInFrames:600}),
  staticFile:(file:string)=>file,
  AbsoluteFill:({children,style}:{children?:ReactNode;style?:CSSProperties})=><div style={style}>{children}</div>,
  Img:({src,style}:{src:string;style?:CSSProperties})=><img src={src} style={style}/>,
}));
import {FirstPointScene,Opening20Scene} from '../../../examples/reference-opening/ContinuationScene';
import {OpeningScene} from '../../../examples/reference-opening/OpeningScene';
import {MaterialDemo} from '../../../apps/catalog/src/MaterialDemo';
import {ContentCollapse} from '../src';
import {during} from '../src/reference-opening/motion';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const filmAt=(frame:number)=>{clock.frame=frame;return dom(<Opening20Scene/>);};
const pointAt=(frame:number)=>{clock.frame=frame;return dom(<FirstPointScene/>);};
const styles=(doc:Document,selector:string)=>Array.from(doc.querySelectorAll(selector),el=>el.getAttribute('style'));
// Subtracting a film start offset can differ from a local frame time by machine epsilon.
const rounded=(value:string|null)=>value?.replace(/-?\d+\.\d{7,}/g,n=>String(Number(Number(n).toFixed(6))));

describe('observed 11–20 second continuation',()=>{
  it('retains the opening scene for the entire original ten-second interval',()=>{
    for(const frame of [0,18,57,67,78,99,165,240,285,299]){
      clock.frame=frame;
      // useId identifiers may change between renders; compare geometry, visibility and text instead.
      const old=dom(<OpeningScene/>),extended=filmAt(frame);
      expect(styles(extended,'[data-opening-scene], [data-perspective-panel], [data-fan-card], [data-title-layer]')).toEqual(styles(old,'[data-opening-scene], [data-perspective-panel], [data-fan-card], [data-title-layer]'));
      expect(extended.body.textContent).toBe(old.body.textContent);
      expect(extended.querySelector('[data-continuation-scene]')).toBeNull();
    }
  });
  it('collects three chapters before revealing the principles page and paths',()=>{
    const sound=filmAt(314); // First frame with “音效怎么处理”; the handoff must already be complete.
    expect(sound.querySelector('[data-audio-pulse]')).not.toBeNull();
    expect(sound.body.textContent).toContain('音效怎么处理');
    const titleRows=Array.from(sound.querySelector('[data-chapter-heading]')!.children);
    const title=titleRows[1];
    expect(title.children[0].textContent).toBe('Skill 推荐');
    expect((title.children[0] as HTMLElement).style.transform).toBe('translateY(-58px)');
    expect(title.children[1].textContent).toBe('音效处理');
    expect((title.children[1] as HTMLElement).style.transform).toBe('translateY(0px)');
    expect(Number(sound.querySelector<HTMLElement>('[data-audio-pulse]')!.parentElement!.parentElement!.style.opacity)).toBe(1);
    const skillCard=Array.from(sound.querySelectorAll<HTMLElement>('[data-chapter-thumbnail]')).find(card=>card.style.left==='325px')!;
    expect(Number(skillCard.style.opacity)).toBe(1);
    const overview=filmAt(385);
    expect(overview.querySelectorAll('[data-chapter-card]')).toHaveLength(3);
    expect(overview.body.textContent).toContain('展开具体内容之前');
    const principles=filmAt(420);
    expect(Number(principles.querySelector<HTMLElement>('[data-principles-header]')!.style.opacity)).toBe(1);
    expect(Number(principles.querySelector<HTMLElement>('[data-route-endpoint]')!.style.opacity)).toBe(0);
    const routeOffsets=(frame:number)=>Array.from(filmAt(frame).querySelectorAll('[data-branch-route]'),path=>Number(path.getAttribute('stroke-dashoffset')));
    const early=routeOffsets(450);
    expect(early[0]).toBeLessThan(1);expect(early[1]).toBe(1);expect(early[2]).toBe(1);
    const staggered=routeOffsets(461);
    expect(staggered[0]).toBeLessThan(staggered[2]);expect(staggered[2]).toBeLessThan(1);expect(staggered[1]).toBe(1);
    const finishing=routeOffsets(474);
    expect(finishing[0]).toBe(0);expect(finishing[2]).toBeLessThan(finishing[1]);expect(finishing[1]).toBeLessThan(1);
    expect(routeOffsets(488)).toEqual([0,0,0]);
    expect(filmAt(510).querySelectorAll('[data-path-card]')).toHaveLength(11);
  });
  it('crosses out the answer, then highlights one route while retaining dimmed alternatives',()=>{
    const answer=filmAt(528);
    expect(Number(answer.querySelector<HTMLElement>('[data-answer-stamp]')!.style.opacity)).toBe(1);
    expect(answer.querySelector<HTMLElement>('[data-answer-strike]')!.style.transform).toBe('scaleX(0)');
    expect(filmAt(548).querySelector<HTMLElement>('[data-answer-strike]')!.style.transform).toBe('scaleX(1)');
    const chosen=filmAt(599);
    expect(Number(chosen.querySelector<HTMLElement>('[data-answer-stamp]')!.style.opacity)).toBe(0);
    const nodes=Array.from(chosen.querySelectorAll<HTMLElement>('[data-path-card]'));
    expect(nodes.filter(node=>Number(node.style.opacity)===1)).toHaveLength(3);
    expect(nodes.filter(node=>Number(node.style.opacity)<.3)).toHaveLength(8);
    const selected=nodes.filter(node=>node.dataset.pathSelected==='true'),background=nodes.filter(node=>node.dataset.pathSelected==='false');
    const backgroundLayer=Math.max(...background.map(node=>Number(node.style.zIndex)));
    for(const node of selected)expect(Number(node.style.zIndex)).toBeGreaterThan(backgroundLayer);
    expect(chosen.querySelector<HTMLElement>('[data-branching-paths]')!.style.isolation).toBe('isolate');
    expect(Number(chosen.querySelector<HTMLElement>('[data-route-tracer]')!.style.zIndex)).toBeGreaterThan(Math.max(...selected.map(node=>Number(node.style.zIndex))));
    expect(Array.from(answer.querySelectorAll<HTMLElement>('[data-path-card]')).every(node=>Number(node.style.zIndex)===1)).toBe(true);
    expect(Number(chosen.querySelector('[data-selected-route]')!.getAttribute('stroke-dashoffset'))).toBeLessThan(.02);
    expect(chosen.querySelector<HTMLElement>('[data-route-label]')!.style.opacity).toBe('1');
  });
  it('uses the same path motion in the real film and the catalog, including arbitrary seeks',()=>{
    for(const localFrame of [159,0,18,45,72,84,96,120,141,159]){
      const film=filmAt(447+localFrame);
      clock.frame=localFrame;
      const catalog=dom(<MaterialDemo id="branching-paths"/>);
      expect(styles(film,'[data-path-card], [data-path-outline], [data-answer-stamp], [data-answer-strike], [data-route-label], [data-route-tracer], [data-route-result]').map(rounded)).toEqual(styles(catalog,'[data-path-card], [data-path-outline], [data-answer-stamp], [data-answer-strike], [data-route-label], [data-route-tracer], [data-route-result]').map(rounded));
      for(const selector of ['[data-branch-route]','[data-selected-route]']){
        const geometry=(doc:Document)=>Array.from(doc.querySelectorAll(selector),el=>['d','stroke-dashoffset','opacity'].map(attr=>rounded(el.getAttribute(attr))));
        expect(geometry(film)).toEqual(geometry(catalog));
      }
    }
  });
  it('keeps the chapter cards in the same small positions at the handoff and within the final stage',()=>{
    const before=filmAt(358).querySelectorAll<HTMLElement>('[data-chapter-thumbnail]');
    const after=filmAt(359).querySelectorAll<HTMLElement>('[data-chapter-card]');
    expect(before).toHaveLength(3);expect(after).toHaveLength(3);
    after.forEach((card,i)=>{
      for(const property of ['left','top','width','height'] as const)expect(card.style[property]).toBe(before[i].style[property]);
    });
    for(const frame of [360,370,380,386]){
      const film=filmAt(frame);
      clock.frame=frame-345;
      const catalog=dom(<MaterialDemo id="chapter-card-row"/>);
      expect(styles(film,'[data-chapter-card]').map(rounded)).toEqual(styles(catalog,'[data-chapter-card]').map(rounded));
      for(const card of film.querySelectorAll<HTMLElement>('[data-chapter-card]')){
        expect(parseFloat(card.style.left)).toBeGreaterThanOrEqual(0);
        expect(parseFloat(card.style.left)+parseFloat(card.style.width)).toBeLessThanOrEqual(800);
        expect(parseFloat(card.style.top)+parseFloat(card.style.height)).toBeLessThanOrEqual(450);
      }
    }
  });
  it('centers the skill artwork and sound badge from the first small card through the settled overview',()=>{
    for(const frame of [359,360,365,370,375,380,386,390,394]){
      const scene=filmAt(frame);
      for(const [kind,anchor,expectedScale] of [['skill',{x:470,y:207.2},.4],['sound',{x:470,y:184},.48]] as const){
        const card=scene.querySelector<HTMLElement>(`[data-chapter-card="${kind}"]`)!;
        const [top,,bottom]=card.querySelector<HTMLElement>('[data-chapter-illustration]')!.style.inset.split(/\s+/).map(value=>parseFloat(value));
        const viewportWidth=parseFloat(card.style.width)-14,viewportHeight=parseFloat(card.style.height)-top-bottom;
        const miniature=card.querySelector<HTMLElement>('[data-chapter-miniature]')!;
        const [,x,y,scale]=miniature.style.transform.match(/translate\(([-\d.]+)px,([-\d.]+)px\) scale\(([-\d.]+)\)/)!.map(Number);
        if(frame>=386)expect(scale).toBe(expectedScale);
        expect(x+anchor.x*scale).toBeCloseTo(viewportWidth/2,8);
        expect(y+anchor.y*scale).toBeCloseTo(viewportHeight/2,8);
        const halfWidth=kind==='skill'?200*scale:96*scale,halfHeight=kind==='skill'?81.2*scale:96*scale;
        expect(viewportWidth/2-halfWidth).toBeGreaterThanOrEqual(0);
        expect(viewportHeight/2-halfHeight).toBeGreaterThanOrEqual(0);
      }
    }
  });
  it('lands the shrinking artwork directly at the small-card position without another alignment move',()=>{
    const arriving=filmAt(358.5-1e-8).querySelectorAll<HTMLElement>('[data-chapter-thumbnail-content]');
    const collected=filmAt(359);
    for(const [index,kind] of [[1,'skill'],[2,'sound']] as const){
      const card=collected.querySelector<HTMLElement>(`[data-chapter-card="${kind}"]`)!;
      const miniature=card.querySelector<HTMLElement>('[data-chapter-miniature]')!;
      const read=(transform:string)=>transform.match(/translate\(([-\d.]+)px,([-\d.]+)px\) scale\(([-\d.]+)\)/)!.slice(1).map(Number);
      const [arrivalX,arrivalY,arrivalScale]=read(arriving[index].style.transform);
      const [x,y,scale]=read(miniature.style.transform);
      expect(arrivalX).toBeCloseTo(parseFloat(card.style.left)+7+x,5);
      expect(arrivalY).toBeCloseTo(parseFloat(card.style.top)+3+y,5);
      expect(arrivalScale).toBeCloseTo(scale,5);
    }
  });
  it('moves the light forward to the result before revealing the inspiration label',()=>{
    let previousX=0;
    for(const frame of [571,590,610,627,640]){
      const document=pointAt(frame),dot=document.querySelector('[data-route-dot]')!;
      const x=Number(dot.getAttribute('cx'));
      expect(x).toBeGreaterThanOrEqual(previousX);previousX=x;
      if(frame>=627){expect(x).toBeCloseTo(678,7);expect(Number(dot.getAttribute('cy'))).toBeCloseTo(294,7);}
    }
    expect(pointAt(620).querySelector<HTMLElement>('[data-route-result]')!.style.opacity).toBe('0');
    const resolved=pointAt(650).querySelector<HTMLElement>('[data-route-result]')!;
    expect(resolved.style.opacity).toBe('1');expect(resolved.textContent).toBe('启发 · 灵感');
    expect(pointAt(650).body.textContent).toContain('如果能让你收获一些启发或者灵感');
    const distance=(start:number)=>{
      let total=0,previous:{x:number;y:number}|undefined;
      for(let frame=start;frame<=start+9;frame++){
        const dot=pointAt(frame).querySelector('[data-route-dot]')!;
        const current={x:Number(dot.getAttribute('cx')),y:Number(dot.getAttribute('cy'))};
        if(previous)total+=Math.hypot(current.x-previous.x,current.y-previous.y);
        previous=current;
      }
      return total;
    };
    // Equal frame windows: the middle should travel noticeably farther than the approach.
    expect(distance(594)).toBeGreaterThan(distance(615)*1.3);
  });
  it('finishes with the first point archived and holds before any second-point content',()=>{
    const before=pointAt(709),middle=pointAt(722),end=pointAt(749);
    expect(before.querySelector<HTMLElement>('[data-section-collapse-scene]')!.style.opacity).toBe('1');
    expect(before.querySelector<HTMLElement>('[data-section-bookmark]')!.style.opacity).toBe('0');
    const middleBookmark=Number(middle.querySelector<HTMLElement>('[data-section-bookmark]')!.style.opacity);
    expect(middleBookmark).toBeGreaterThan(0);expect(middleBookmark).toBeLessThan(1);
    expect(end.querySelector<HTMLElement>('[data-section-collapse-scene]')!.style.opacity).toBe('0');
    const bookmark=end.querySelector<HTMLElement>('[data-section-bookmark]')!;
    expect(bookmark.style.opacity).toBe('1');expect(bookmark.textContent).toBe('1没有标准答案');
    expect(bookmark.style.left).toBe('49px');expect(bookmark.style.top).toBe('47px');
    expect(end.body.textContent).toContain('那这期分享就值得了');
    expect(end.body.textContent).not.toMatch(/先开枪|后瞄准|第二/);
    expect(styles(pointAt(732),'[data-section-collapse-scene], [data-section-bookmark]')).toEqual(styles(end,'[data-section-collapse-scene], [data-section-bookmark]'));
  });
  it('uses the standalone collapse action while the case owns its summary entry',()=>{
    for(const frame of [709,711,720,728,732,749]){
      const film=pointAt(frame);
      const progress=during(frame/30,23.65,24.4);
      const library=dom(<ContentCollapse progress={progress} to={{x:49,y:47,scale:.06}} opacity={1-during(progress,.65,1)}>任意内容</ContentCollapse>);
      expect(styles(film,'[data-content-collapse]').map(rounded)).toEqual(styles(library,'[data-content-collapse]').map(rounded));
      expect(film.querySelector('[data-section-bookmark]')).not.toBeNull();
      expect(library.querySelector('[data-section-bookmark]')).toBeNull();
    }
  });
});
