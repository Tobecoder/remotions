import type {ReactNode} from 'react';
import {CardEntrance} from '../../../packages/animations/src';
import {clamp,during} from '../../../packages/animations/src/reference-opening/motion';

export type TutorialMethod={title:string;description:string};
export type TutorialStep={at:number;label:string};
export const editorTutorialSteps:readonly TutorialStep[]=[
 {at:76/30,label:'蒙版切掉水印'},
 {at:139/30,label:'色度抠像'},
 {at:291/30,label:'强度调低，留住影子'},
 {at:405/30,label:'HSL：绿色饱和度拉到最低'},
 {at:551/30,label:'导出：HEVC (Alpha)'},
];
export type TutorialWalkthroughProps={time:number;startAt?:number;children:ReactNode;previousStage?:ReactNode;previousMethod?:TutorialMethod;activeMethod?:TutorialMethod;steps?:readonly TutorialStep[]};

/** Complete case-owned method handoff, continuous demo window and numbered cues. */
export const TutorialWalkthrough=({time,startAt=0,children,previousStage,steps=editorTutorialSteps,previousMethod={title:'丢给 Agent 处理',description:'一句话，导出带 Alpha 的视频'},activeMethod={title:'剪辑软件里自己抠',description:'蒙版 → 色度抠像 → HSL → 导出'}}:TutorialWalkthroughProps)=>{
 const t=time-startAt,frame=t*30,enter=frame<0?0:1-(1-clamp((frame+1)/8))**3;
 let current=-1;for(let i=0;i<steps.length;i++)if(t>=steps[i].at-1e-8)current=i;
 return <div data-tutorial-walkthrough style={{position:'absolute',inset:0,color:'#292b34'}}>
  <CardEntrance data-tutorial-method="previous" progress={1} x={46} y={148} width={200} height={58} offset={{x:0,y:0}} borderRadius={9} background="#ffffffd9" boxShadow="0 3px 6px #30343e11" style={{boxSizing:'border-box',padding:'10px 11px',opacity:1-.55*during(frame,0,3)}}>
   <div style={{fontSize:15,fontWeight:800}}><span style={{color:'#bd513d',marginRight:5}}>A</span>{previousMethod.title}</div><div style={{fontSize:10,color:'#929498',marginTop:4}}>{previousMethod.description}</div>
   <div data-tutorial-previous-border style={{position:'absolute',inset:0,border:'1.2px solid #bf5441',borderRadius:9,opacity:1-during(frame,0,2)}}/>
  </CardEntrance>
  <CardEntrance data-tutorial-method="active" progress={frame<2?0:1-(1-clamp((frame-1)/6))**3} x={46} y={215} width={200} height={58} offset={{x:0,y:6}} borderRadius={9} background="#ffffffd9" boxShadow="0 3px 6px #30343e11" style={{border:'1.2px solid #bf5441',boxSizing:'border-box',padding:'10px 11px'}}>
   <div style={{fontSize:15,fontWeight:800}}><span style={{color:'#bd513d',marginRight:5}}>B</span>{activeMethod.title}</div><div style={{fontSize:10,color:'#929498',marginTop:4}}>{activeMethod.description}</div>
  </CardEntrance>
  {previousStage&&enter<1&&<div data-tutorial-previous-stage style={{position:'absolute',left:299,top:137,width:454.2,height:252.5,borderRadius:10,overflow:'hidden',opacity:1-enter}}>{previousStage}</div>}
  <CardEntrance data-tutorial-stage progress={enter} x={274} y={119.5} width={496} height={235.5} offset={{x:0,y:0}} borderRadius={8} background="#222" boxShadow="0 5px 9px #30343e18">
   <div data-tutorial-content style={{position:'absolute',inset:0,opacity:during(frame,.5,2.5)}}>{children}</div>
  </CardEntrance>
  {current>=0&&<div data-tutorial-step={current} style={{position:'absolute',left:274,top:368,fontSize:14,fontWeight:800,lineHeight:'20px',whiteSpace:'nowrap'}}><span style={{color:'#bd513d',fontFamily:'monospace',fontSize:12,letterSpacing:1,marginRight:6}}>{current+1} / {steps.length}</span>{steps[current].label}</div>}
 </div>;
};
