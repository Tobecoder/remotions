import type {ReactNode} from 'react';
import {during,mix} from './motion';

export type TetheredMotionProps={time:number;startAt?:number;running:ReactNode;caught:ReactNode;label?:string};

export const TetheredMotion=({time,startAt=0,running,caught,label='跑偏了！'}:TetheredMotionProps)=>{
  const t=time-startAt,move=during(t,0,1.4),catchProgress=during(t,1.15,1.55);
  const x=mix(60,520,move),bob=-(Math.sin(Math.max(0,t)*18)**2)*8*(1-catchProgress);
  const rope=`M62 306 Q${(62+x-36)/2} ${mix(302,342,catchProgress)} ${x-36} ${mix(285,320,catchProgress)}`;
  return <div data-tethered-motion style={{position:'absolute',inset:0}}>
    <svg width="800" height="450" style={{position:'absolute',inset:0,overflow:'visible'}}><path d="M54 252H750" stroke="#a5a9a4" strokeWidth=".8" strokeDasharray="6 7"/>
      <g data-tether-rope opacity={during(t,.95,1.3)}><path d={rope} fill="none" stroke="#8f6342" strokeWidth="6"/><path d={rope} fill="none" stroke="#d7ac7b" strokeWidth="3.5"/><path d={rope} fill="none" stroke="#966b4b" strokeWidth="2" strokeDasharray="1 3"/></g>
    </svg>
    <div data-tether-actor style={{position:'absolute',left:x-74,top:205+bob,width:148,height:146}}>
      {catchProgress<.5?running:caught}
    </div>
    <div style={{position:'absolute',left:578,top:126,borderRadius:18,padding:'6px 12px',fontSize:13,fontWeight:700,color:'#d16c50',background:'#ffffffeb',boxShadow:'0 3px 7px #30343e14',opacity:during(t,1.35,1.7)}}>{label}</div>
  </div>;
};
