/** @vitest-environment jsdom */
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {BranchingPaths,type BranchRoute,type BranchingPathsProps,type PathCard} from '../src';

const cards:readonly PathCard[]=[
  {id:'a',x:355,y:154.5,selected:false,content:<span>方案 A</span>},
  {id:'b',x:355,y:314.5,selected:true,content:<span>方案 B</span>},
];
const routes:readonly BranchRoute[]=[
  {id:'upper',path:'M100 260 Q400 100 700 260',cardIds:['a'],enterAt:0},
  {id:'lower',path:'M100 260 Q400 420 700 260',cardIds:['b'],enterAt:.35},
];
const at=(time:number,props:Partial<BranchingPathsProps>={})=>new DOMParser().parseFromString(renderToStaticMarkup(<BranchingPaths time={time} cards={cards} {...props}/>),'text/html');
const dot=(scene:Document)=>['cx','cy'].map(attribute=>Number(scene.querySelector('[data-route-dot]')!.getAttribute(attribute)));
const card=(scene:Document,id:string)=>scene.querySelector<HTMLElement>(`[data-path-card="${id}"]`)!;

describe('configurable multi-route storytelling',()=>{
  it('keeps the original route structure and legacy selected-card markers by default',()=>{
    const scene=at(7);
    expect(scene.querySelectorAll('[data-branch-route]')).toHaveLength(3);
    expect(scene.querySelector('[data-selected-route]')!.getAttribute('d')).toBe('M124 294 C205 388 287 348 400 294 S580 206 678 294');
    expect(dot(scene)).toEqual([678,294]);
    expect(Number(card(scene,'a').style.opacity)).toBeCloseTo(.2,10);expect(card(scene,'b').style.opacity).toBe('1');
  });
  it('removes disabled or empty narrative stages instead of leaving blank boxes',()=>{
    for(const hidden of [false,''] as const){
      const scene=at(7,{stamp:hidden,routeLabel:hidden,resultLabel:hidden});
      expect(scene.querySelector('[data-answer-stamp], [data-answer-strike], [data-route-label], [data-route-result]')).toBeNull();
      expect(scene.querySelector('[data-selected-route]')).not.toBeNull();expect(scene.querySelector('[data-route-dot]')).not.toBeNull();
    }
  });
  it('derives endpoints from custom paths and binds the highlighted route, light and cards together',()=>{
    const props={routes,selectedRoute:'upper',stamp:false as const,timing:{selectAt:1.5,travelDuration:2}};
    expect(dot(at(1.5,props))).toEqual([100,260]);
    const middle=at(2.5,props),[x,y]=dot(middle);
    expect(x).toBeCloseTo(400,2);expect(y).toBeCloseTo(180,2);
    expect(middle.querySelector('[data-selected-route]')!.getAttribute('d')).toBe(routes[0].path);
    expect(card(middle,'a').dataset.pathSelected).toBe('true');expect(card(middle,'b').dataset.pathSelected).toBe('false');
    expect(Number(card(middle,'a').style.opacity)).toBe(1);expect(Number(card(middle,'b').style.opacity)).toBeLessThan(.3);
    const end=at(5,props);
    expect(dot(end)).toEqual([700,260]);
    const endpoints=Array.from(end.querySelectorAll<HTMLElement>('[data-route-endpoint]'));
    expect(endpoints.map(node=>[parseFloat(node.style.left)+29,parseFloat(node.style.top)+29])).toEqual([[100,260],[700,260]]);
    expect(end.querySelector<HTMLElement>('[data-route-result]')!.style.opacity).toBe('1');
  });
  it('switches route ownership and suppresses selection without dimming unselected cards',()=>{
    const lower=at(2.5,{routes,selectedRoute:'lower',timing:{selectAt:1.5,travelDuration:2}});
    expect(dot(lower)[1]).toBeCloseTo(340,2);expect(card(lower,'b').style.opacity).toBe('1');
    for(const props of [{routes},{routes,selectedRoute:false as const},{selectedRoute:false as const},{routes:[]}]){
      const scene=at(8,props);
      expect(scene.querySelector('[data-selected-route], [data-route-tracer], [data-route-label], [data-route-result]')).toBeNull();
      for(const id of ['a','b']){expect(card(scene,id).style.opacity).toBe('1');expect(card(scene,id).dataset.pathSelected).toBe('false');}
    }
    expect(at(8,{routes:[]}).querySelectorAll('[data-branch-route]')).toHaveLength(0);
    expect(at(3,{routes:[]}).querySelector('[data-answer-stamp]')).toBeNull();
  });
  it('repositions the original geometry and its endpoints without leaving the tracer on the old path',()=>{
    const props={from:{x:200,y:100},to:{x:200,y:400}};
    expect(dot(at(4.1,props))).toEqual([200,100]);expect(dot(at(7,props))).toEqual([200,400]);
    const scene=at(7,props);
    expect(scene.querySelector('[data-branch-route]')!.getAttribute('d')).toMatch(/^M200 100 Q/);
    const end=Array.from(scene.querySelectorAll<HTMLElement>('[data-route-endpoint]'))[1];
    expect([parseFloat(end.style.left)+29,parseFloat(end.style.top)+29]).toEqual([200,400]);
  });
  it('allows per-route drawing and zero-duration travel while leaving results until selection is finished',()=>{
    const drawing=routes.map((route,index)=>({...route,enterAt:1+index,duration:index===0?0:.5}));
    expect(at(.99,{routes:drawing}).querySelector('[data-branch-route]')!.getAttribute('stroke-dashoffset')).toBe('1');
    expect(at(1,{routes:drawing}).querySelector('[data-branch-route]')!.getAttribute('stroke-dashoffset')).toBe('0');
    expect(Number(at(2.25,{routes:drawing}).querySelectorAll('[data-branch-route]')[1].getAttribute('stroke-dashoffset'))).toBeCloseTo(.5,8);
    const instant={routes,selectedRoute:'upper',timing:{selectAt:2,travelDuration:0}};
    expect(dot(at(2,instant))).toEqual([700,260]);
    expect(at(2.5,instant).querySelector<HTMLElement>('[data-route-result]')!.style.opacity).toBe('0');
    expect(at(4,instant).querySelector<HTMLElement>('[data-route-result]')!.style.opacity).toBe('1');
  });
  it('moves the stamp phase, selection and annotations independently on the caller clock',()=>{
    const props={startAt:10,timing:{stampAt:.5,selectAt:3,travelDuration:1,resultAt:5},positions:{stamp:{x:20,y:30},routeLabel:{x:300,y:50},resultLabel:{x:600,y:400}}};
    expect(at(10.4,props).querySelector<HTMLElement>('[data-answer-stamp]')!.style.opacity).toBe('0');
    const stamped=at(10.8,props).querySelector<HTMLElement>('[data-answer-stamp]')!;
    expect(Number(stamped.style.opacity)).toBeCloseTo(1,8);expect([stamped.style.left,stamped.style.top]).toEqual(['20px','30px']);
    expect(at(11.4,props).querySelector<HTMLElement>('[data-answer-strike]')!.style.transform).toBe('scaleX(1)');
    const done=at(16,props);
    expect(done.querySelector<HTMLElement>('[data-answer-stamp]')!.style.opacity).toBe('0');
    expect(done.querySelector<HTMLElement>('[data-route-label]')!.style.left).toBe('300px');
    expect(done.querySelector<HTMLElement>('[data-route-result]')!.style.top).toBe('400px');
    expect(dot(done)).toEqual([678,294]);
  });
  it('rejects disconnected, invalid or mismatched paths and missing route/card references clearly',()=>{
    for(const path of ['','M0 0L0 0','M0 0L10 0M20 0L30 0','not a path'])expect(()=>at(0,{routes:[{id:'bad',path}]})).toThrow('路线「bad」无效');
    expect(()=>at(0,{routes:[routes[0],routes[0]]})).toThrow('路线 id 不能重复');
    expect(()=>at(0,{routes,selectedRoute:'missing'})).toThrow('所选路线「missing」不存在');
    expect(()=>at(0,{routes:[{...routes[0],cardIds:['missing']}]})).toThrow('不存在的卡片');
    expect(()=>at(0,{routes,from:{x:0,y:0}})).toThrow('起终点必须');
    expect(()=>at(0,{from:{x:NaN,y:100}})).toThrow('有限');
    expect(()=>at(0,{from:{x:100,y:100},to:{x:100,y:100}})).toThrow('不能重合');
    expect(()=>at(0,{routes,cards:[cards[0],cards[0]]})).toThrow('卡片 id 不能重复');
  });
  it('supports backward seeks and repeat renders on a custom selected route',()=>{
    const props={routes,selectedRoute:'lower',stamp:false as const,timing:{selectAt:1.5,travelDuration:2}};
    const before=at(2.5,props);at(10,props);at(.1,props);const after=at(2.5,props);
    expect(dot(after)).toEqual(dot(before));expect(card(after,'b').getAttribute('style')).toBe(card(before,'b').getAttribute('style'));
  });
});
