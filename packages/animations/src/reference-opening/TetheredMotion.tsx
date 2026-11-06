import type {ReactNode} from 'react';
import {during,mix} from './motion';

export type TetheredMotionProps={time:number;startAt?:number;running:ReactNode;caught:ReactNode;label?:string};

export const TetheredMotion=({time,startAt=0,running,caught,label='跑偏了！'}:TetheredMotionProps)=>{
  const t=time-startAt,move=during(t,0,1.4),catchProgress=during(t,1.15,1.55);
  const pull=during(t,1.4,1.72),taut=during(t,1.15,1.4),settleTime=t-1.72;
  const settle=settleTime>0&&settleTime<.5?Math.sin(settleTime*24)*Math.exp(-settleTime*10)*4*(1-during(settleTime,.35,.5)):0;
  const pullDistance=72;
  const x=mix(60,520+pullDistance,move)-pullDistance*pull+settle,bob=-(Math.sin(Math.max(0,t)*18)**2)*8*(1-catchProgress);
  const lean=-6*Math.sin(Math.PI*during(t,1.35,1.72)),angle=lean*Math.PI/180;
  // Keep the rope attached to the same point as the actor leans around its waist.
  const ropeX=x-36*Math.cos(angle),ropeY=320+bob-36*Math.sin(angle);
  const rope=`M62 306 Q${(62+ropeX)/2} ${(306+ropeY)/2+32*(1-taut)} ${ropeX} ${ropeY}`;
  return <div data-tethered-motion style={{position:'absolute',inset:0}}>
    <svg width="800" height="450" style={{position:'absolute',inset:0,overflow:'visible'}}><path d="M54 252H750" stroke="#a5a9a4" strokeWidth=".8" strokeDasharray="6 7"/>
      <g data-tether-rope data-taut={taut} opacity={during(t,.95,1.3)}><path d={rope} fill="none" stroke="#8f6342" strokeWidth="6"/><path d={rope} fill="none" stroke="#d7ac7b" strokeWidth="3.5"/><path d={rope} fill="none" stroke="#966b4b" strokeWidth="2" strokeDasharray="1 3"/></g>
    </svg>
    <div data-tether-actor style={{position:'absolute',left:x-74,top:205+bob,width:148,height:146,transform:`rotate(${lean}deg)`,transformOrigin:'74px 115px'}}>
      {catchProgress<.5?running:caught}
    </div>
    <div style={{position:'absolute',left:578,top:126,borderRadius:18,padding:'6px 12px',fontSize:13,fontWeight:700,color:'#d16c50',background:'#ffffffeb',boxShadow:'0 3px 7px #30343e14',opacity:during(t,1.35,1.7)}}>{label}</div>
  </div>;
};
