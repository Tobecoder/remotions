import type {HTMLAttributes,ReactNode} from 'react';
import {clamp} from './motion';

export const progressRowLayout={width:696,height:82,trackLeft:156,trackWidth:432,spinnerOffset:50,spinnerSize:48};
export type ProgressRowProps=Omit<HTMLAttributes<HTMLDivElement>,'children'|'color'> & {
  label:ReactNode;progress:number;x?:number;y?:number;width?:number;color?:string;glow?:string;
  enterProgress?:number;status?:'none'|'complete'|'waiting';statusProgress?:number;
  time?:number;markerProgress?:number;badge?:ReactNode;
  caption?:ReactNode;annotation?:ReactNode;value?:ReactNode;children?:ReactNode;
};

/** A progress-controlled row with no built-in race, duration, counter or copy. */
export const ProgressRow=({label,progress,x=53,y=178,width=696,color='#409eff',glow,enterProgress=1,status='none',statusProgress=1,time=0,markerProgress,badge='✓',caption,annotation,value,children,style,...attributes}:ProgressRowProps)=>{
  const rowWidth=Math.max(1,Number.isFinite(width)?width:progressRowLayout.width),unit=rowWidth/progressRowLayout.width;
  const p=clamp(progress),enter=clamp(enterProgress),visible=clamp(statusProgress),trackLeft=progressRowLayout.trackLeft*unit,trackWidth=progressRowLayout.trackWidth*unit;
  const spinnerSize=progressRowLayout.spinnerSize*unit,marker=Math.min(trackWidth-spinnerSize/2,Math.max(spinnerSize/2,trackWidth*clamp(markerProgress??p)));
  const spinnerLeft=trackLeft+marker-spinnerSize/2,spin=Math.max(0,Number.isFinite(time)?time:0)*180;
  return <div {...attributes} data-progress-row style={{position:'absolute',left:Number.isFinite(x)?x:53,top:Number.isFinite(y)?y:178,width:rowWidth,height:82*unit,borderRadius:14*unit,background:'#fffffff0',boxShadow:`0 ${7*unit}px ${15*unit}px #333a3214`,opacity:enter,transform:`translateY(${(1-enter)*15*unit}px)`,...style}}>
    <div style={{position:'absolute',left:22*unit,top:19*unit,width:114*unit,fontSize:28*unit,lineHeight:`${34*unit}px`,whiteSpace:'nowrap',fontWeight:800,color:'#292d35'}}>{label}</div>
    <div style={{position:'absolute',left:trackLeft,top:29*unit,width:trackWidth,height:20*unit,borderRadius:12*unit,background:'#eceee8',overflow:'hidden'}}><div data-progress-fill style={{width:`${100*p}%`,height:'100%',background:color,borderRadius:12*unit,boxShadow:glow?`0 0 ${12*unit}px ${glow}`:undefined}}/></div>
    {status==='complete'?<div data-progress-status="complete" style={{position:'absolute',left:604*unit,top:10*unit,width:54*unit,height:54*unit,borderRadius:'50%',background:'linear-gradient(135deg,#ffe7a5,#f0c24d)',boxShadow:`0 0 0 ${3*unit}px #fff0b6,0 ${2*unit}px ${13*unit}px #dfb95570`,textAlign:'center',lineHeight:`${54*unit}px`,fontSize:32*unit,fontWeight:800,color:'#b87d16',opacity:visible}}>{badge}</div>:status==='waiting'?<svg data-progress-status="waiting" width={spinnerSize} height={spinnerSize} viewBox="0 0 48 48" style={{position:'absolute',left:spinnerLeft,top:13*unit,opacity:visible,transform:`rotate(${spin}deg)`}}><circle cx="24" cy="24" r="21" fill="#fff" stroke="#60626b" strokeWidth="2"/>{Array.from({length:8},(_,n)=><path key={n} d="M24 3V24" stroke="#60626b" strokeWidth="2" transform={`rotate(${n*45} 24 24)`}/>)}</svg>:null}
    {caption!==undefined&&<div data-progress-caption style={{position:'absolute',left:trackLeft,top:54*unit,fontSize:11*unit,lineHeight:`${14*unit}px`,color:'#7c8593'}}>{caption}</div>}
    {annotation!==undefined&&<div data-progress-annotation style={{position:'absolute',left:spinnerLeft+spinnerSize+20*unit,top:7*unit,fontSize:9*unit,lineHeight:`${12*unit}px`,color:'#63666b'}}>{annotation}</div>}
    {value!==undefined&&<div data-progress-value style={{position:'absolute',right:(status==='complete'?108:17)*unit,top:(status==='complete'?54:41)*unit,fontFamily:'monospace',fontSize:(status==='complete'?16:22)*unit,lineHeight:status==='complete'?`${20*unit}px`:undefined,fontWeight:800,color:'#cd6661'}}>{value}</div>}
    {children}
  </div>;
};
