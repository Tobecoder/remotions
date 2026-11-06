import type {ReactNode} from 'react';
import {during,mix} from './motion';

export type SpotlightRect={x:number;y:number;width:number;height:number};
export type CardSpotlightProps={time:number;startAt?:number;from:SpotlightRect;fromRadius?:number;content:ReactNode|((expanded:number)=>ReactNode);badge?:string};
export const CardSpotlight=({time,startAt=0,from,fromRadius=10,content,badge}:CardSpotlightProps)=>{
  const t=time-startAt,expanded=during(t,0,.4)*(1-during(t,3,3.5));
  const x=mix(from.x,232,expanded),y=mix(from.y,138,expanded),width=mix(from.width,336,expanded),height=mix(from.height,189,expanded);
  return <div data-card-spotlight style={{position:'absolute',inset:0,isolation:'isolate'}}>
    <div data-spotlight-dimmer style={{position:'absolute',inset:0,background:'#f5f6ef',opacity:.88*expanded}}/>
    <div data-spotlight-panel style={{position:'absolute',left:x,top:y,width,height,borderRadius:mix(fromRadius,10,expanded),overflow:'hidden',boxShadow:`0 ${5*expanded}px ${20*expanded}px #242b3320`}}>{typeof content==='function'?content(expanded):content}</div>
    {badge&&<div data-spotlight-badge style={{position:'absolute',left:x,top:y+height+8,padding:'6px 12px',borderRadius:18,background:'#da7250',fontSize:13,fontWeight:700,color:'#fff',opacity:during(t,1.9,2.2)*(1-during(t,3,3.5))}}>{badge}</div>}
  </div>;
};
