import type {HTMLAttributes,ReactNode} from 'react';
import {clamp,during,mix} from './motion';

export type TokenBowlProps=Omit<HTMLAttributes<HTMLDivElement>,'children'> & {
 time:number;startAt?:number;count?:number;interval?:number;fallDuration?:number;
 x?:number;y?:number;width?:number;bowlColor?:string;rimColor?:string;tokenColor?:string;token?:ReactNode;
};
const finite=(value:number,fallback:number)=>Number.isFinite(value)?value:fallback;

/** Staggered falling items settle behind the bowl's front. No playback state or randomness. */
export const TokenBowl=({time,startAt=0,count=20,interval=.09,fallDuration=.55,x=0,y=0,width=280,bowlColor='#e4cba0',rimColor='#be9d6d',tokenColor='#fff6df',token,style,...attributes}:TokenBowlProps)=>{
 const total=Math.max(0,Math.min(60,Math.floor(finite(count,20)))),spacing=Math.max(.015,finite(interval,.09)),duration=Math.max(.05,finite(fallDuration,.55));
 const t=Math.round((finite(time,0)-finite(startAt,0))*1e9)/1e9,scale=Math.max(0,finite(width,280))/280;
 return <div {...attributes} data-token-bowl style={{position:'absolute',left:finite(x,0),top:finite(y,0),width:280,height:250,transformOrigin:'0 0',transform:`scale(${scale})`,...style}}>
  <svg data-bowl-back viewBox="0 0 280 250" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}><ellipse cx="140" cy="176" rx="115" ry="9" fill="#f7edda88" stroke={rimColor} strokeWidth="1.4"/></svg>
  {Array.from({length:total},(_,i)=>{
   const age=t-i*spacing;if(age<0)return null;
   const p=clamp(age/duration),settled=p===1,layer=Math.floor(i/5),topLayer=Math.floor((total-1)/5);
   const targetX=57+(i%5)*42,targetY=168+Math.min(3,topLayer-layer)*12;
   const fromX=[95,155,202,60,123][i%5],tx=mix(fromX,targetX,p),ty=mix(30,targetY,p*p);
   const bounce=settled?-Math.sin(clamp((age-duration)/.16)*Math.PI)*4:0;
   const rotation=mix([-30,24,-22,30,-16][i%5],[-8,4,-3,7,-5][i%5],p);
   return <div key={i} data-bowl-token={i} data-settled={settled||undefined} style={{position:'absolute',left:tx-9,top:ty+bounce-13.5,width:18,height:27,opacity:during(age,0,.04),transform:`rotate(${rotation}deg)`,filter:'drop-shadow(1px 2px 1px #b1955733)'}}>
    {token??<svg width="100%" height="100%" viewBox="0 0 20 30"><path d="M10 1C15 1 19 13 19 19C19 32 1 32 1 19C1 13 5 1 10 1Z" fill={tokenColor}/></svg>}
   </div>;
  })}
  <svg data-bowl-front viewBox="0 0 280 250" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}><path d="M25 176L47 235Q140 247 233 235L255 176Q140 194 25 176Z" fill={bowlColor} stroke={rimColor} strokeWidth="1.5"/><ellipse cx="140" cy="176" rx="115" ry="9" fill="none" stroke={rimColor} strokeWidth="1.5"/></svg>
 </div>;
};
