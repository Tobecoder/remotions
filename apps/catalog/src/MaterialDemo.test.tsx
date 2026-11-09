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

describe('foreground focus example',()=>{
  it('previews the foreground alone without background cards',()=>{
    clock.frame=60;
    const scene=new DOMParser().parseFromString(renderToStaticMarkup(<MaterialDemo id="focus-layer"/>),'text/html');
    expect(scene.querySelector('[data-focus-foreground]')).not.toBeNull();
    expect(scene.querySelector('[data-focus-background], [data-card-entrance]')).toBeNull();
  });
});

describe('neutral typing comparison demo',()=>{
  it('shows neutral alternatives and preserves the original expand-to-columns geometry',()=>{
    for(const frame of [105,180]){
      clock.frame=frame;
      const scene=new DOMParser().parseFromString(renderToStaticMarkup(<MaterialDemo id="typewriter-comparison"/>),'text/html');
      expect(scene.body.textContent).toContain('方案 A');expect(scene.body.textContent).toContain('方案 B');
      for(const text of ['没有体感','AI 校验','我自己写','交给 AI','Vibe'])expect(scene.body.textContent).not.toContain(text);
      expect(scene.querySelector('[data-writing-check]')).toBeNull();
      expect(scene.querySelector<HTMLElement>('[data-writing-own]')!.style.height).toBe(frame===105?'176px':'66px');
    }
  });
});

describe('content collapse example',()=>{
  it('shows a standalone card that stays visible after shrinking without case-specific paths or bookmarks',()=>{
    const stages=[45,90].map(frame=>{
      clock.frame=frame;
      return new DOMParser().parseFromString(renderToStaticMarkup(<MaterialDemo id="content-collapse"/>),'text/html');
    });
    for(const scene of stages){
      const content=scene.querySelector<HTMLElement>('[data-content-collapse]')!;
      expect(content.style.opacity).toBe('1');
      expect(content.textContent).toContain('任意内容，收拢到指定位置');
      expect(scene.querySelector('[data-section-bookmark], [data-path-card]')).toBeNull();
      expect(scene.body.textContent).not.toContain('没有标准答案');
    }
    expect(stages[0].querySelector<HTMLElement>('[data-content-collapse]')!.style.transform).toBe('translate(0px,0px) scale(1)');
    expect(stages[1].querySelector<HTMLElement>('[data-content-collapse]')!.style.transform).toBe('translate(60px,45px) scale(0.30000000000000004)');
  });
});
