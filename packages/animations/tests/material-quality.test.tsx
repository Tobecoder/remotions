/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect,vi} from 'vitest';
const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
  useCurrentFrame:()=>clock.frame,useVideoConfig:()=>({fps:30,width:1920,height:1080}),staticFile:(file:string)=>file,
  AbsoluteFill:({children,style}:{children:ReactNode;style:CSSProperties})=><div style={style}>{children}</div>,
  Img:({src,style}:{src:string;style:CSSProperties})=><img src={src} style={style}/>,
  OffthreadVideo:({src}:{src:string})=><video src={src}/>,
  Sequence:({children,from=0}:{children:ReactNode;from:number})=>clock.frame>=from?children:null,
  Loop:({children}:{children:ReactNode})=><>{children}</>,
}));
import {MaterialQualityFilm} from '../../../examples/reference-opening/MaterialQualityScene';
import {MaterialCollectionFilm} from '../../../examples/reference-opening/MaterialCollectionScene';
import segments from '../../../examples/reference-opening/segments.json';
const at=(time:number)=>{clock.frame=Math.round(time*30);return new DOMParser().parseFromString(renderToStaticMarkup(<MaterialQualityFilm/>),'text/html');};
const style=(doc:Document,q:string)=>(doc.querySelector(q) as HTMLElement).style;
describe('material quality continuation and earlier film boundary',()=>{
  it('uses the unchanged earlier film before frame 6090',()=>{
    for(const frame of [0,749,1740,2880,4184,5399,6089]){
      clock.frame=frame;expect(renderToStaticMarkup(<MaterialQualityFilm/>)).toBe(renderToStaticMarkup(<MaterialCollectionFilm/>));
    }
  });
  it('overlaps rejected previews and drops the older image down and right',()=>{
    const doc=at(206.1),older=style(doc,'[data-quality-rejected="rejected-blur"]'),newer=style(doc,'[data-quality-rejected="rejected-ui"]');
    expect(Number.parseFloat(older.left)).toBeGreaterThan(Number.parseFloat(newer.left));
    expect(Number.parseFloat(older.top)).toBeGreaterThan(Number.parseFloat(newer.top));
    expect(Number(older.opacity)).toBeGreaterThan(0);
  });
  it('files five original cards into eight slots before the three manual additions',()=>{
    const before=at(208),filled=at(212.3);
    expect(before.querySelectorAll('[data-quality-slot]')).toHaveLength(8);
    expect(before.querySelectorAll('[data-quality-original]')).toHaveLength(5);
    for(const card of before.querySelectorAll<HTMLElement>('[data-quality-manual]'))expect(card.style.opacity).toBe('0');
    for(const card of filled.querySelectorAll<HTMLElement>('[data-quality-manual]'))expect(card.style.opacity).toBe('1');
    const overlap=at(212.733333);expect(Number(style(overlap,'[data-quality-gallery]').opacity)).toBeGreaterThan(0);
    expect(style(overlap,'[data-quality-meter]').transform).toContain('translateX(-');
  });
  it('keeps both indicator groups during the change and changes the count on its frame',()=>{
    const doc=at(214.2);
    expect(doc.querySelector('[data-usage-value]')!.textContent).toBe('78,000');
    expect(style(doc,'[data-usage-value]').color).toBe('rgb(59, 159, 121)');
    expect(Number(style(doc,'[data-usage-indicator="heavy"]').opacity)).toBeGreaterThan(0);
    expect(Number(style(doc,'[data-usage-indicator="light"]').opacity)).toBeGreaterThan(0);
    expect(parseFloat(style(doc,'[data-usage-indicator="heavy"]').top)).toBeGreaterThan(parseFloat(style(doc,'[data-usage-indicator="light"]').top));
  });
  it('uses isolated inset footage and ends before the next green-screen tutorial',()=>{
    const last=at(6705/30);
    expect(last.querySelectorAll('[data-quality-archive-card] video')).toHaveLength(4);
    expect(last.querySelector('[data-quality-main-video] video')!.getAttribute('src')).toBe('material-quality/main-late.mp4');
    expect(last.querySelector('[data-material-quality-scene]')!.lastElementChild!.textContent).toBe('这些是老演员了');
    const index=segments.findIndex(s=>s.id==='08-Material-Quality');
    expect(segments[index]).toEqual({id:'08-Material-Quality',endFrame:6706});
    expect(segments[index].endFrame-segments[index-1].endFrame).toBe(616);
    const prior=at(206.1).body.innerHTML;at(223.5);expect(at(206.1).body.innerHTML).toBe(prior);
  });
});
