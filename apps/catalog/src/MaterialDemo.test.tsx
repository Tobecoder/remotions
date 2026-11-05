/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
  useCurrentFrame:()=>clock.frame,
  useVideoConfig:()=>({fps:30,width:800,height:450}),
  AbsoluteFill:({children,style}:{children?:ReactNode;style?:CSSProperties})=><div style={style}>{children}</div>,
}));
import {MaterialDemo} from './MaterialDemo';
import {catalog} from './catalog';

const heading=catalog.find(item=>item.id==='chapter-heading')!;
const at=(frame:number)=>{
  clock.frame=frame;
  return new DOMParser().parseFromString(renderToStaticMarkup(<MaterialDemo id="chapter-heading"/>),'text/html');
};

describe('complete chapter heading example',()=>{
  it('shows the large introductory title in the idle poster',()=>{
    const document=at(heading.posterFrame);
    const intro=document.querySelector<HTMLElement>('[data-title-layer="intro"]');
    expect(intro).not.toBeNull();
    expect(intro!.style.opacity).toBe('1');
    expect(intro!.textContent).toContain('一条讲解视频的制作全流程拆解');
    expect(document.querySelector<HTMLElement>('[data-title-layer="chapter"]')!.style.opacity).toBe('0');
  });
  it('holds the first chapter before continuing to the second',()=>{
    const middle=at(Math.floor(heading.durationInFrames*.4));
    expect(middle.querySelector<HTMLElement>('[data-title-layer="intro"]')!.style.opacity).toBe('0');
    const title=middle.querySelector('[data-chapter-heading]')!.children[1];
    expect((title.children[0] as HTMLElement).style.transform).toBe('translateY(0px)');
    expect(title.children[0].textContent).toBe('制作方法');
    const end=at(heading.durationInFrames-1).querySelector('[data-chapter-heading]')!.children[1];
    expect((end.children[1] as HTMLElement).style.transform).toBe('translateY(0px)');
    expect(end.children[1].textContent).toBe('Skill 推荐');
  });
});
