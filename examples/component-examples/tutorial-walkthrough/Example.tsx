import type {ReactNode} from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {TutorialWalkthrough,editorTutorialSteps,type TutorialMethod,type TutorialStep} from '../../reference-opening/compositions/TutorialWalkthrough';
import {during} from '../../../packages/animations/src/reference-opening/motion';

export type TutorialWalkthroughExampleProps={previousMethod?:TutorialMethod;activeMethod?:TutorialMethod;steps?:readonly TutorialStep[];content?:(time:number)=>ReactNode};
const DemoEditor=({time}:{time:number})=>{
 const key=during(time,6.2,6.7),hsl=during(time,14,17),exporting=during(time,18.1,18.4),cropping=during(time,2.6,3)*(1-during(time,3.2,3.8));
 return <div style={{height:'100%',background:'#242424',color:'#b9bbbf',padding:8,boxSizing:'border-box',fontSize:6}}>
  <div style={{height:13,borderBottom:'1px solid #444'}}>动画素材 · 处理预览<span style={{float:'right',color:'#50bbad'}}>画面　抠像　调整</span></div>
  <div style={{position:'absolute',left:15,top:24,width:326,height:181,background:'#050505',display:'grid',placeItems:'center',overflow:'hidden'}}>
   <div style={{width:232,height:174,background:`rgba(15,174,18,${1-key})`,display:'grid',placeItems:'center',clipPath:`inset(${cropping*30}% ${cropping*30}%)`}}>
    <div style={{position:'absolute',width:100,height:7,borderRadius:'50%',background:hsl>.5?'#252525':'#20a125',bottom:14,opacity:1-.6*during(time,9.8,10.5),filter:'blur(3px)'}}/>
    <div style={{width:108,height:108,borderRadius:'38% 45% 35% 35%',background:'linear-gradient(140deg,#ad94f3,#4a49c6)',boxShadow:'inset -7px -10px 12px #33349c66',color:'#fff8ea',fontWeight:800,fontSize:45,display:'grid',placeItems:'center',transform:`translateY(${Math.sin(time*2.3)*3}px) rotate(${Math.sin(time*1.5)*3}deg)`}}>›_</div>
   </div>
  </div>
  <div style={{position:'absolute',left:354,top:29,right:10}}>
   <div style={{fontWeight:800,color:'#ddd',marginBottom:15}}>{hsl>0?'HSL 调整':'色度抠像'}</div>
   <div style={{display:'flex',gap:5,marginBottom:16}}>{['#d34160','#de9952','#e3dc55','#41b43f','#4bbfca','#4c69b9'].map(c=><span key={c} style={{width:9,height:9,borderRadius:'50%',border:`2px solid ${c}`,boxSizing:'border-box'}}/>)}</div>
   {['强度','饱和度','亮度'].map((label,i)=><div key={label} style={{marginBottom:14}}>{label}<div style={{display:'inline-block',marginLeft:8,verticalAlign:'middle',width:70,height:2,background:'#555',position:'relative'}}><span style={{position:'absolute',width:3,height:7,top:-2.5,background:'#ddd',left:i===0?50-20*during(time,9.5,11):35*(1-hsl)}}/></div></div>)}
  </div>
  <div style={{position:'absolute',bottom:6,left:14,right:12,color:'#6b9690'}}>00:00:{String(Math.floor(time)%60).padStart(2,'0')}<span style={{float:'right'}}>播放　□　全屏</span></div>
  {exporting>0&&<div style={{position:'absolute',inset:0,background:'#0008',opacity:exporting}}><div style={{position:'absolute',left:22,top:24,width:300,height:212,border:'1px solid #555',background:'#262626',borderRadius:6,padding:14,boxSizing:'border-box',color:'#ddd',fontSize:9}}><div style={{fontSize:11,fontWeight:800,marginBottom:20}}>导出素材</div><div style={{marginBottom:18}}>格式　MOV</div><div style={{padding:'8px 7px',border:'1px solid #b65c48',borderRadius:3}}>编码　HEVC (Alpha)</div><div style={{fontSize:7,color:'#999',marginTop:18}}>预览为程序示意，替换为你自己的操作录屏</div></div></div>}
 </div>;
};
export const TutorialWalkthroughExample=({previousMethod,activeMethod,steps=editorTutorialSteps,content}:TutorialWalkthroughExampleProps)=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
 return <AbsoluteFill style={{background:'#f5f6ef',fontFamily:'"Microsoft YaHei",sans-serif',overflow:'hidden'}}>
  <div style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
   <div style={{position:'absolute',left:46,top:53,color:'#292b34'}}><div style={{fontSize:10,color:'#96989c',marginBottom:5}}>从一种做法切换到另一种</div><div style={{fontSize:23,fontWeight:800}}>把操作讲清楚，保留完整步骤</div></div>
   <TutorialWalkthrough time={time} previousMethod={previousMethod} activeMethod={activeMethod} steps={steps} previousStage={<div style={{background:'#dadce2',height:'100%'}}/>}>{content?content(time):<DemoEditor time={time}/>}</TutorialWalkthrough>
  </div>
 </AbsoluteFill>;
};
