import {useId} from 'react';
import {clamp} from './motion';

export type AudioPulseBadgeProps={time:number;progress?:number;x?:number;y?:number;size?:number;color?:string};

/** Decorative sound icon, not an audio analyzer. All motion is frame-derived. */
export const AudioPulseBadge=({time,progress=1,x=470,y=184,size=96,color='#cf7055'}:AudioPulseBadgeProps)=>{
  const p=clamp(progress),id=`pulse-${useId().replace(/:/g,'')}`;
  return <div data-audio-pulse style={{position:'absolute',left:x,top:y,width:size,height:size,transform:`translate(-50%,-50%) scale(${.9+.1*p})`,opacity:p}}>
    <svg viewBox="-50 -50 100 100" width="100%" height="100%" style={{overflow:'visible'}} aria-label="音效脉冲图标" role="img">
      <defs><filter id={id} x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#282d38" floodOpacity=".13"/></filter></defs>
      {[0,1,2].map(i=>{const phase=((time*.4+i/3)%1+1)%1;return <circle key={i} data-pulse-ring={i} r={48+phase*48} fill="none" stroke={i===1?color:'#b4b7b1'} strokeWidth=".6" opacity={(1-phase)*.25}/>;})}
      <circle r="47" fill="#fff" filter={`url(#${id})`}/>
      {Array.from({length:9},(_,i)=>{const height=12+Math.sin(i*1.17+time*3.7)**2*17+(i===4?12:0);return <rect key={i} x={-28+i*6.5} y={-height/2} width="3.4" height={height} rx="1.7" fill={i===4?color:'#2e3035'}/>;})}
    </svg>
  </div>;
};
