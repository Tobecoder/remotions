import {useId} from 'react';
import {clamp} from './motion';

export type RisingCurveProps={progress:number;label?:string;title?:string;color?:string};

/** A conceptual growth curve, not a chart of measured data. */
export const RisingCurve=({progress,label='模型能力',title='越来越聪明',color='#dc7452'}:RisingCurveProps)=>{
  const p=clamp(progress),id=`growth-${useId().replace(/:/g,'')}`;
  const x=62*(1-p)**3+3*130*(1-p)**2*p+3*238*(1-p)*p*p+306*p**3;
  const y=391*(1-p)**3+3*374*(1-p)**2*p+3*319*(1-p)*p*p+259*p**3;
  const path=`M62 391 C${62+68*p} ${391-17*p} ${62+136*p+40*p*p} ${391-34*p-38*p*p} ${x} ${y}`;
  return <div data-rising-curve style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:58,top:186,fontSize:10,color:'#929498',letterSpacing:1}}>{label}</div><div style={{position:'absolute',left:58,top:205,fontSize:20,fontWeight:800,color:'#30333a'}}>{title}</div>
    <svg width="800" height="450"><defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop stopColor={color} stopOpacity=".3"/><stop offset="1" stopColor={color} stopOpacity=".02"/></linearGradient></defs><path d="M62 391H350" fill="none" stroke="#a2a59f" strokeWidth=".7"/><path d={`${path} L${x} 391Z`} fill={`url(#${id})`}/><path data-growth-line d={path} fill="none" stroke={color} strokeWidth="2.5"/><circle data-growth-tip cx={x} cy={y} r="4.5" fill={color} opacity={p>0?1:0}/></svg>
  </div>;
};
