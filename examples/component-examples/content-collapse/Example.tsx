import type {ReactNode} from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {BranchingPaths} from '../../../packages/animations/src';
import {pathCardLayout} from '../../../packages/animations/src/reference-opening/continuation-motion';
import {during} from '../../../packages/animations/src/reference-opening/motion';
import {SectionCollapse} from '../../reference-opening/compositions/SectionCollapse';
import example from './example.json';

export type SectionCollapseCopy=typeof example.defaultProps.copy;
export type SectionCollapseExampleProps={label?:string;number?:string;copy?:Partial<SectionCollapseCopy>;content?:ReactNode|((time:number)=>ReactNode)};
const colors=['#405c81','#76a8b2','#c78661','#a99ac1','#cb9e66'];

const PathArtwork=({index}:{index:number})=><svg viewBox="0 0 160 90" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="160" height="90" fill={colors[index%colors.length]}/><circle cx={45+index%3*25} cy="35" r="24" fill="#ffffff44"/>
  <path d="M0 90L60 35L120 90Z" fill="#ffffff28"/><path d="M70 90L120 54L170 90Z" fill="#ffffff44"/>
  <text x="12" y="76" fontSize="13" fontFamily="sans-serif" fill="#fff">{['构思','素材','实验','结果'][index%4]}</text>
</svg>;

/** Keep the first point's original clock and collapse choreography; callers supply the scene. */
export const SectionCollapseExample=({label=example.defaultProps.label,number=example.defaultProps.number,copy,content}:SectionCollapseExampleProps)=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps,caseTime=time+14.9;
  const text={...example.defaultProps.copy,...copy};
  const scene=content===undefined?<>
    <div data-example-section-heading style={{position:'absolute',inset:0}}>
      <div style={{position:'absolute',left:49,top:105,color:'#ca7157',fontSize:9,fontWeight:700}}>{text.eyebrow}</div>
      <div style={{position:'absolute',left:49,top:116,fontSize:36,fontWeight:900,letterSpacing:-1,color:'#272a30'}}>{label}</div>
      <div style={{position:'absolute',left:49,top:169,fontSize:13,fontWeight:600,color:'#8f9296',opacity:during(caseTime,14.9,15.3)}}>{text.description}</div>
    </div>
    <BranchingPaths time={caseTime} startAt={14.9} cards={pathCardLayout.map((layout,index)=>({...layout,id:`path-${index}`,content:<PathArtwork index={index}/>}))} fromLabel={text.fromLabel} toLabel={text.toLabel} stamp={text.stamp} routeLabel={text.routeLabel} resultLabel={text.resultLabel}/>
  </>:typeof content==='function'?content(time):content;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-component-example="section-collapse" style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <SectionCollapse progress={during(caseTime,23.65,24.4)} label={label} number={number}>{scene}</SectionCollapse>
    </div>
  </AbsoluteFill>;
};
