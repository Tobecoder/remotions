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
import {Opening20Scene} from '../../../examples/reference-opening/ContinuationScene';
import {OpeningScene} from '../../../examples/reference-opening/OpeningScene';
import {MaterialDemo} from '../../../apps/catalog/src/MaterialDemo';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
const filmAt=(frame:number)=>{clock.frame=frame;return dom(<Opening20Scene/>);};
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
    expect(Number(chosen.querySelector('[data-selected-route]')!.getAttribute('stroke-dashoffset'))).toBeLessThan(.02);
    expect(chosen.querySelector<HTMLElement>('[data-route-label]')!.style.opacity).toBe('1');
  });
  it('uses the same path motion in the real film and the catalog, including arbitrary seeks',()=>{
    for(const localFrame of [159,0,18,45,72,84,96,120,141,159]){
      const film=filmAt(447+localFrame);
      clock.frame=localFrame;
      const catalog=dom(<MaterialDemo id="branching-paths"/>);
      expect(styles(film,'[data-path-card], [data-path-outline], [data-answer-stamp], [data-answer-strike], [data-route-label]').map(rounded)).toEqual(styles(catalog,'[data-path-card], [data-path-outline], [data-answer-stamp], [data-answer-strike], [data-route-label]').map(rounded));
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
});
