import {during,mix} from './motion';

export type ComparisonPhase={startAt?:number;duration?:number};
export const comparisonNumber=(value:number|undefined,fallback:number)=>value!==undefined&&Number.isFinite(value)?value:fallback;
export const comparisonPhase=(phase:ComparisonPhase|undefined,start:number,end:number)=>{
  const startAt=comparisonNumber(phase?.startAt,start),duration=Math.max(0,comparisonNumber(phase?.duration,end-start));
  const endAt=phase?.duration===undefined?end+(startAt-start):startAt+duration;
  return {startAt,endAt,duration};
};
export const comparisonProgress=(time:number,phase:ReturnType<typeof comparisonPhase>)=>phase.duration===0?Number(time>=phase.startAt):during(time,phase.startAt,phase.endAt);
export const comparisonCompact=(time:number,phase:false|ComparisonPhase={})=>phase===false?0:comparisonProgress(time,comparisonPhase(phase,4.9,5.5));

/** Shared with the case's later zoom, so its source stays at the real thumbnail. */
export const getComparisonThumbnailRect=(side:'left'|'right',time:number,startAt=0,compact:false|ComparisonPhase={})=>{
  const p=comparisonCompact(time-startAt,compact);
  return {x:(side==='left'?mix(58,49,p):mix(418,420,p))+15,y:mix(139,175,p)+(mix(176,66,p)-42)/2,width:54,height:42};
};
