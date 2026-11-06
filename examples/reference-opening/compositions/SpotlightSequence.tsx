import type {ReactNode} from 'react';
import {CardSpotlight,type CardSpotlightProps,type SpotlightRect} from '../../../packages/animations/src';
import {during,mix} from '../../../packages/animations/src/reference-opening/motion';

export type SpotlightSequenceProps=Omit<CardSpotlightProps,'progress'|'to'> & {time:number;startAt?:number;to?:SpotlightRect;badge?:ReactNode};

/** Timing and caption treatment for this video's spotlight shots. */
export const SpotlightSequence=({time,startAt=0,from,to={x:232,y:138,width:336,height:189},badge,...presentation}:SpotlightSequenceProps)=>{
  const t=time-startAt,expanded=during(t,0,.4)*(1-during(t,3,3.5));
  const x=mix(from.x,to.x,expanded),y=mix(from.y,to.y,expanded),height=mix(from.height,to.height,expanded);
  return <div data-spotlight-sequence style={{position:'absolute',inset:0,isolation:'isolate'}}>
    <CardSpotlight {...presentation} progress={expanded} from={from} to={to}/>
    {badge&&<div data-spotlight-badge style={{position:'absolute',left:x,top:y+height+8,padding:'6px 12px',borderRadius:18,background:'#da7250',fontSize:13,fontWeight:700,color:'#fff',opacity:during(t,1.9,2.2)*(1-during(t,3,3.5))}}>{badge}</div>}
  </div>;
};
