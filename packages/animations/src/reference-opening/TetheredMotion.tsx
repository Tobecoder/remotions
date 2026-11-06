import type {ReactNode} from 'react';
import {during,mix} from './motion';
import {RunnerSprite} from './RunnerSprite';

export type TetheredMotionProps={time:number;startAt?:number;label?:string}&(
  {spriteSrc:string;running?:never;caught?:never}|{spriteSrc?:undefined;running:ReactNode;caught:ReactNode}
);

export const TetheredMotion=({time,startAt=0,running,caught,spriteSrc,label='跑偏了！'}:TetheredMotionProps)=>{
  const t=time-startAt,move=during(t,0,1.4),catchProgress=during(t,1.15,1.55);
  const pull=during(t,1.9,3),taut=during(t,1.15,1.4),settleTime=t-3;
  const settle=settleTime>0&&settleTime<.35?Math.sin(settleTime*20)*Math.exp(-settleTime*12)*2*(1-during(settleTime,.2,.35)):0;
  const pullDistance=72;
  const x=mix(60,520+pullDistance,move)-pullDistance*pull+settle,bob=-(Math.sin(Math.max(0,t)*18)**2)*8*(1-taut);
  const lean=-6*taut*(1-during(t,2.75,3)),angle=lean*Math.PI/180;
  // Keep the rope attached to the same point as the actor leans around its waist.
  const attachX=spriteSrc?-18:-36,attachY=spriteSrc?-31:0;
  const ropeX=x+attachX*Math.cos(angle)-attachY*Math.sin(angle),ropeY=320+bob+attachX*Math.sin(angle)+attachY*Math.cos(angle);
  // Tension reduces the sag without turning the rope into a rigid straight line.
  const sag=18+24*(1-taut)+10*pull+settle*.4;
  const rope=`M62 306 Q${(62+ropeX)/2} ${(306+ropeY)/2+sag} ${ropeX} ${ropeY}`;
  return <div data-tethered-motion style={{position:'absolute',inset:0}}>
    <svg width="800" height="450" style={{position:'absolute',inset:0,overflow:'visible'}}><path d="M54 252H750" stroke="#a5a9a4" strokeWidth=".8" strokeDasharray="6 7"/>
      <g data-tether-rope data-taut={taut} opacity={during(t,.95,1.3)}><path d={rope} fill="none" stroke="#8f6342" strokeWidth="6"/><path d={rope} fill="none" stroke="#d7ac7b" strokeWidth="3.5"/><path d={rope} fill="none" stroke="#966b4b" strokeWidth="2" strokeDasharray="1 3"/></g>
    </svg>
    <div data-tether-actor style={{position:'absolute',left:x-74,top:205+bob,width:148,height:146,transform:`rotate(${lean}deg)`,transformOrigin:'74px 115px'}}>
      {spriteSrc?<RunnerSprite src={spriteSrc} time={catchProgress<.5?t:t-1.35} pose={catchProgress<.5?'running':'caught'}/>:catchProgress<.5?running:caught}
    </div>
    <div style={{position:'absolute',left:578,top:126,borderRadius:18,padding:'6px 12px',fontSize:13,fontWeight:700,color:'#d16c50',background:'#ffffffeb',boxShadow:'0 3px 7px #30343e14',opacity:during(t,1.35,1.7)}}>{label}</div>
  </div>;
};
