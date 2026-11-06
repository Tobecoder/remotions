import type {ReactNode} from 'react';
import {clamp,mix} from './motion';

export type SpotlightRect={x:number;y:number;width:number;height:number};
export type CardSpotlightProps={progress:number;from:SpotlightRect;to:SpotlightRect;fromRadius?:number;toRadius?:number;dimColor?:string;dimOpacity?:number;content:ReactNode|((expanded:number)=>ReactNode)};
const zeroRect:SpotlightRect={x:0,y:0,width:0,height:0};
const finite=(value:number,fallback:number)=>Number.isFinite(value)?value:fallback;
const safeRect=(rect:SpotlightRect,fallback:SpotlightRect=zeroRect):SpotlightRect=>({x:finite(rect.x,fallback.x),y:finite(rect.y,fallback.y),width:Math.max(0,finite(rect.width,fallback.width)),height:Math.max(0,finite(rect.height,fallback.height))});

/** Caller-controlled geometry; narration, pauses and captions belong to the video. */
export const CardSpotlight=({progress,from,to,fromRadius=10,toRadius=10,dimColor='#f5f6ef',dimOpacity=.88,content}:CardSpotlightProps)=>{
  const expanded=clamp(progress),start=safeRect(from),end=safeRect(to,start);
  const x=mix(start.x,end.x,expanded),y=mix(start.y,end.y,expanded),width=mix(start.width,end.width,expanded),height=mix(start.height,end.height,expanded);
  return <div data-card-spotlight style={{position:'absolute',inset:0,isolation:'isolate'}}>
    <div data-spotlight-dimmer style={{position:'absolute',inset:0,background:dimColor,opacity:clamp(dimOpacity)*expanded}}/>
    <div data-spotlight-panel style={{position:'absolute',left:x,top:y,width,height,borderRadius:mix(Math.max(0,finite(fromRadius,10)),Math.max(0,finite(toRadius,10)),expanded),overflow:'hidden',boxShadow:`0 ${5*expanded}px ${20*expanded}px #242b3320`}}>{typeof content==='function'?content(expanded):content}</div>
  </div>;
};
