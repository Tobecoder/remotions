/** @vitest-environment jsdom */
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {ExplodedLayers} from '../src/reference-opening/ExplodedLayers';

const at=(time:number,tiltProgress=1)=>new DOMParser().parseFromString(renderToStaticMarkup(<ExplodedLayers time={time} tiltProgress={tiltProgress} screen={<span>成片</span>} layers={[
  {id:'animation',label:'动画',enterAt:1,duration:1,content:<span data-card-content="animation">动画卡片</span>},
  {id:'script',label:'脚本',enterAt:0,duration:.2,content:<span data-card-content="script">脚本卡片</span>},
]} />),'text/html');

const layer=(document:Document,id:string)=>{
  const card=document.querySelector(`[data-card-content="${id}"]`)!.closest<HTMLElement>('[data-perspective-panel]')!;
  const label=document.querySelector<SVGGElement>(`[data-layer-label="${id}"]`)!;
  const matrix=card.style.transform.match(/matrix\(([^)]+)\)/)![1].split(',').map(Number);
  const anchor=label.querySelectorAll('circle')[1];
  return {card,label,matrix,anchor};
};

describe('exploded card and annotation synchronization',()=>{
  it('keeps each annotation attached to the moving card edge throughout entry',()=>{
    for(const time of [1,1.125,1.25,1.5,1.75,2]){
      const {card,label,matrix,anchor}=layer(at(time),'animation');
      const [ax,ay,,,x,y]=matrix;
      expect(Number(anchor.getAttribute('cx'))).toBeCloseTo(x+ax*360+9,6);
      expect(Number(anchor.getAttribute('cy'))).toBeCloseTo(y+ay*360-1,6);
      expect(Number(label.getAttribute('opacity'))).toBe(Number(card.style.opacity));
    }
  });
  it('uses the base card tilt progress for its label rather than a separate entry timer',()=>{
    for(const tilt of [0,.25,.5,.85,1]){
      const {card,label}=layer(at(.5,tilt),'script');
      const annotationOpacity=Number(label.getAttribute('opacity'))*Number((label.parentElement as unknown as SVGElement).style.opacity||1);
      expect(annotationOpacity).toBeCloseTo(Number(card.style.opacity),6);
    }
  });
});
