import type {ReactNode} from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ThreeStepFlow,type ThreeStepFlowCopy} from '../../reference-opening/compositions/ThreeStepFlow';

export type ThreeStepFlowExampleProps={labels?:readonly [string,string,string];copy?:Partial<ThreeStepFlowCopy>;artwork?:readonly [ReactNode,ReactNode,ReactNode]};
const FlowArt=({time,phase}:{time:number;phase:number})=>{
 const moving=phase>0,bob=moving?Math.sin(time*2.8)*3:0,turn=moving?Math.sin(time*1.8)*4:0;
 return <svg width="100%" height="100%" viewBox="0 0 470 350" style={{display:'block'}}>
  <defs><pattern id={`checker-${phase}`} width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#fff"/><path d="M0 0h14v14H0ZM14 14h14v14H14Z" fill="#e4e5e9"/></pattern><linearGradient id={`toy-${phase}`} x2=".7" y2="1"><stop stopColor="#bc9ff2"/><stop offset="1" stopColor="#444cc7"/></linearGradient></defs>
  <rect width="470" height="350" fill={phase===2?`url(#checker-${phase})`:phase===0?'#16ed04':'#17a713'}/>
  <ellipse cx="235" cy="305" rx="100" ry="11" fill="#22233a" opacity=".15"/>
  <g transform={`translate(235 ${195+bob}) rotate(${turn})`}>
   <path d="M-85 48Q-120 50-118 12Q-135-15-106-40Q-109-80-70-85Q-50-126-12-106Q29-126 53-93Q93-101 104-61Q139-41 119-9Q143 16 114 43Q118 75 76 78L70 109Q52 127 37 106L33 78H-30L-36 109Q-55 127-71 106L-74 78Q-107 80-85 48Z" fill={`url(#toy-${phase})`}/>
   <path d="M-36-30L-12 0-36 31M16 30H53" fill="none" stroke="#fffaf0" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
 </svg>;
};
export const ThreeStepFlowExample=({labels=['AI 生成绿幕图片','视频模型生成动画','抠成透明底'],copy,artwork}:ThreeStepFlowExampleProps)=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
 return <AbsoluteFill style={{background:'#f5f6ef',fontFamily:'"Microsoft YaHei",sans-serif',overflow:'hidden'}}>
  <div style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
   <ThreeStepFlow time={time} copy={copy} steps={[
    {id:'image',label:labels[0],content:artwork?.[0]??<FlowArt time={time} phase={0}/>},
    {id:'motion',label:labels[1],content:artwork?.[1]??<FlowArt time={time} phase={1}/>},
    {id:'alpha',label:labels[2],content:artwork?.[2]??<FlowArt time={time} phase={2}/>},
   ]}/>
  </div>
 </AbsoluteFill>;
};
