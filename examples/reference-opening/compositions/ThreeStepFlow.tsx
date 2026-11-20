import type {ReactNode} from 'react';
import {CardEntrance,ContentCollapse} from '../../../packages/animations/src';
import {clamp,during,mix} from '../../../packages/animations/src/reference-opening/motion';

export type FlowStep={id:string;label:string;content:ReactNode};
export type ThreeStepFlowCopy={eyebrow:string;title:string;question:string;explanation:string;badge:string;summary:string};
export const defaultFlowCopy:ThreeStepFlowCopy={eyebrow:'例如 Codex 的拟人小玩偶',title:'三步做出透明底小动画',question:'为什么用绿幕？',explanation:'视频模型大多不能直接出透明底',badge:'绿幕方便抠图',summary:'绿幕 → 透明底，两种方法'};
export type ThreeStepFlowProps={time:number;startAt?:number;steps:readonly [FlowStep,FlowStep,FlowStep];copy?:Partial<ThreeStepFlowCopy>};

// Measured corner poses preserve the delayed vertical movement and faster middle shrink.
const collapseAt=(frame:number)=>{
 const points=[[364,0],[366,.03],[369,.11],[372,.29],[375,.62],[378,.86],[381,.985],[384,1]] as const;
 if(frame<=points[0][0])return 0;
 for(let i=1;i<points.length;i++)if(frame<=points[i][0])return mix(points[i-1][1],points[i][1],(frame-points[i-1][0])/(points[i][0]-points[i-1][0]));
 return 1;
};

/** Case-owned complete three-step reveal and corner summary; uses shared independent actions. */
export const ThreeStepFlow=({time,startAt=0,steps,copy:overrides}:ThreeStepFlowProps)=>{
 const frame=(time-startAt)*30,copy={...defaultFlowCopy,...overrides},collapse=collapseAt(frame),badge=during(frame,315,324);
 const entryFrames=[71,131,290];
 return <div data-three-step-flow style={{position:'absolute',inset:0,color:'#292b34'}}>
  <div data-flow-heading style={{position:'absolute',left:48,top:80,opacity:during(frame,0,11)*(1-during(frame,365,379))}}>
   <div style={{fontSize:9,fontWeight:800,color:'#bf5541',letterSpacing:1.8,marginBottom:3}}>{copy.eyebrow}</div>
   <div style={{fontSize:23,fontWeight:800,lineHeight:'30px'}}>{copy.title}</div>
  </div>
  <ContentCollapse data-flow-collapse progress={collapse} to={{x:74,y:-5,scale:.36}}>
   {[0,1].map(i=><div key={i} data-flow-connector={i} style={{position:'absolute',left:240+i*264,top:232,width:52,borderTop:'1.6px dotted #b85b4f',opacity:during(frame,entryFrames[i+1]+3,entryFrames[i+1]+12)}}/>)}
   {steps.map((step,i)=>{
    const p=frame<entryFrames[i]?0:1-(1-clamp((frame-entryFrames[i]+1)/11))**(i===2?2:3);
    return <div key={step.id} data-flow-step={step.id}>
     <CardEntrance data-flow-card={i} progress={p} x={35+i*264} y={158} width={202} height={152} offset={{x:0,y:24}} borderRadius={10} background="#fff" boxShadow="0 4px 10px #30343e18" style={{padding:3,boxSizing:'border-box'}}>
      <div style={{width:'100%',height:'100%',borderRadius:7,overflow:'hidden'}}>{step.content}</div>
     </CardEntrance>
     <div data-flow-label={i} style={{position:'absolute',left:35+i*264,top:322+mix(24,0,p),width:202,textAlign:'center',fontSize:14,fontWeight:800,lineHeight:'20px',opacity:p,whiteSpace:'nowrap'}}><span style={{color:'#bd513d',marginRight:4}}>{i+1}</span>{step.label}</div>
    </div>;
   })}
  </ContentCollapse>
  <div data-flow-explanation style={{position:'absolute',left:0,right:0,top:340,display:'flex',justifyContent:'center',alignItems:'center',opacity:during(frame,195,205)*(1-during(frame,358,365))}}>
   <span style={{fontSize:14,fontWeight:800,marginRight:14}}>{copy.question}</span><span style={{fontSize:11,color:'#8b8f92'}}>{copy.explanation}</span>
   <span style={{width:80*badge,marginLeft:12*badge,flexShrink:0}}><span data-flow-badge style={{display:'inline-block',fontSize:12,fontWeight:800,color:'white',padding:'5px 8px',background:'#39a16c',borderRadius:20,boxShadow:'0 3px 6px #2ca65b44',whiteSpace:'nowrap',opacity:badge}}>{copy.badge}</span></span>
  </div>
  <div data-flow-summary style={{position:'absolute',left:47,top:127,fontSize:9,fontWeight:800,letterSpacing:1.8,color:'#929498',opacity:during(frame,375,384)}}>{copy.summary}</div>
 </div>;
};
