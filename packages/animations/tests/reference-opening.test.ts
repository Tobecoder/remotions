import {describe,expect,it} from 'vitest';
import {during,frontPose,mixPose,openingState,tiltedPose} from '../src/reference-opening/motion';

describe('reference opening choreography',()=>{
  it('separates the monitor tilt, chapter switch and thumbnail transition',()=>{
    expect(openingState(0)).toEqual({tilt:0,chapter:0,thumbnail:0,fan:0});
    expect(openingState(4).tilt).toBe(1);
    expect(openingState(4).chapter).toBe(0);
    expect(openingState(7).thumbnail).toBe(0);
    expect(openingState(9.5)).toEqual({tilt:1,chapter:1,thumbnail:1,fan:1});
  });
  it('keeps projection orientation and nonzero visible area through the tilt',()=>{
    for(let frame=0;frame<=300;frame++){
      const pose=mixPose(frontPose,tiltedPose,openingState(frame/30).tilt);
      expect(pose.ax*pose.by-pose.ay*pose.bx).toBeGreaterThan(.1);
    }
  });
  it('never reverses a transition, including arbitrary frame seeking',()=>{
    for(let frame=0;frame<300;frame++){
      const current=openingState(frame/30),next=openingState((frame+1)/30);
      for(const key of ['tilt','chapter','thumbnail','fan'] as const)expect(next[key]).toBeGreaterThanOrEqual(current[key]);
    }
    expect(during(8.8,8.5,9.1)).toBeCloseTo(.5);
  });
});
