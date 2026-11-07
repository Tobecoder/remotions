/** @vitest-environment jsdom */
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {TargetReticle,type TargetReticleProps} from '../src';

const at=(time:number,props:Omit<TargetReticleProps,'time'>={})=>new DOMParser().parseFromString(renderToStaticMarkup(<TargetReticle time={time} {...props}/>),'text/html');
const pose=(scene:Document)=>scene.querySelector('[data-target-face]')!.getAttribute('transform')!.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)!.map(Number);
const labels=(scene:Document)=>Number(scene.querySelector('[data-target-impact] > g:last-child')!.getAttribute('opacity'));
const expectPose=(scene:Document,expected:number[])=>pose(scene).forEach((value,index)=>expect(value).toBeCloseTo(expected[index],10));

describe('target reticle with optional caller-directed movement',()=>{
  it('keeps the original centered start, leftward destination and label fade by default',()=>{
    expectPose(at(.4),[400,277,1]);
    expectPose(at(1.8),[400,277,1]);
    expectPose(at(2.6),[299.5,277,.89]);
    expectPose(at(3.4),[199,277,.78]);
    expectPose(at(20),[199,277,.78]);
    expect(labels(at(1.8))).toBe(1);expect(labels(at(2))).toBeCloseTo(.5,10);expect(labels(at(2.2))).toBe(0);
  });
  it('can stay centered while retaining the shot, recoil, reticle animation and visible labels',()=>{
    for(const time of [0,.3,.6,.65,.88,.9,1.1,1.6,4,9]){
      const fixed=at(time,{move:false}),original=at(time);
      for(const selector of ['[data-target-shot]','[data-target-impact]','[data-target-crosshair]']){
        for(const attribute of ['transform','opacity'])expect(fixed.querySelector(selector)!.getAttribute(attribute)).toBe(original.querySelector(selector)!.getAttribute(attribute));
      }
    }
    expectPose(at(9,{move:false}),[400,277,1]);expect(labels(at(9,{move:false}))).toBe(1);
  });
  it('moves to any requested center and scale at a time relative to the component start, then holds',()=>{
    const options={startAt:10,move:{startAt:3,duration:2,to:{x:640,y:180,scale:.6}}};
    expectPose(at(12,options),[400,277,1]);
    expectPose(at(13,options),[400,277,1]);
    expectPose(at(14,options),[520,228.5,.8]);
    expectPose(at(15,options),[640,180,.6]);
    expectPose(at(30,options),[640,180,.6]);
    expect(labels(at(13,options))).toBe(1);expect(labels(at(13.2,options))).toBeCloseTo(.5,10);expect(labels(at(13.4,options))).toBe(0);
    const early=at(.5,{move:{startAt:0,duration:1,to:{x:600,y:100,scale:.5}}}),[x,y,scale]=pose(early);
    expect(early.querySelector('svg > path')!.getAttribute('d')).toBe(`M-10 385L${x+47*scale} ${y-34*scale}`);
  });
  it('supports immediate placement and prevents non-finite or negative movement geometry',()=>{
    const instant={move:{startAt:2,duration:0,to:{x:600,y:200,scale:.5}}};
    expectPose(at(1.99,instant),[400,277,1]);expectPose(at(2,instant),[600,200,.5]);
    expect(labels(at(2,instant))).toBe(0);
    for(const duration of [NaN,Infinity,-1,0]){
      const scene=at(10,{move:{startAt:NaN,duration,to:{x:Infinity,y:NaN,scale:-1}}});
      expect(scene.body.innerHTML).not.toMatch(/NaN|Infinity/);expectPose(scene,[199,277,0]);
    }
    expectPose(at(10,{move:{to:{x:600,y:200,scale:Infinity}}}),[600,200,.78]);
  });
  it('supports backward seeks without changing text, colors or the caller-selected destination',()=>{
    const props={color:'#409eff',shotLabel:'先试',aimLabel:'再校正',move:{startAt:2.5,duration:.8,to:{x:520,y:340,scale:.9}}};
    const before=at(2.8,props);at(20,props);at(.5,props);const after=at(2.8,props);
    expect(pose(after)).toEqual(pose(before));expect(labels(after)).toBe(labels(before));
    expect(after.body.textContent).toContain('先试');expect(after.body.textContent).toContain('再校正');
    expect(after.querySelector('[data-target-crosshair]')!.getAttribute('stroke')).toBe('#409eff');
    expectPose(at(20,props),[520,340,.9]);
  });
});
