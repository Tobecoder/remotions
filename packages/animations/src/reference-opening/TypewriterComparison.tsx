import type {ReactNode} from 'react';
import {during,mix} from './motion';
import {comparisonCompact,comparisonNumber,comparisonPhase,comparisonProgress,type ComparisonPhase} from './comparison-motion';
export {getComparisonThumbnailRect} from './comparison-motion';
export type {ComparisonPhase} from './comparison-motion';

export type TypewriterSide={text:string;label?:ReactNode;columnTitle?:ReactNode;thumbnail?:ReactNode;compactTitle?:ReactNode;compactDescription?:ReactNode;typing?:ComparisonPhase};
export type TypewriterCheck=ComparisonPhase & {label:ReactNode;underlineAt?:number|false};
export type TypewriterDim=ComparisonPhase & {opacity?:number;badge?:ReactNode};
export type TypewriterComparisonProps={time:number;startAt?:number;left:TypewriterSide;right:TypewriterSide;heading?:ReactNode;check?:false|TypewriterCheck;dim?:false|TypewriterDim;compact?:false|ComparisonPhase};
const type=(text:string,progress:number)=>Array.from(text).slice(0,Math.floor(Array.from(text).length*progress)).join('');
const hasContent=(value:ReactNode)=>value!==undefined&&value!==null&&typeof value!=='boolean'&&value!=='';
const compactTitle=(side:TypewriterSide)=>side.compactTitle!==undefined?side.compactTitle:side.columnTitle!==undefined?side.columnTitle:side.label;
export const TypewriterComparison=({time,startAt=0,left,right,heading,check=false,dim=false,compact:compactPhase={}}:TypewriterComparisonProps)=>{
  const t=time-startAt,compact=comparisonCompact(t,compactPhase),leftTyping=comparisonPhase(left.typing,.15,2.7),rightTyping=comparisonPhase(right.typing,2.3,3.5);
  const own=type(left.text,comparisonProgress(t,leftTyping)),ai=type(right.text,comparisonProgress(t,rightTyping));
  const checkPhase=comparisonPhase(check||undefined,1.7,2),dimPhase=comparisonPhase(dim||undefined,3.5,4.4);
  const underline=check!==false&&check.underlineAt!==false&&t>comparisonNumber(check.underlineAt,1.8);
  const dimProgress=dim===false?0:comparisonProgress(t,dimPhase),dimOpacity=Math.max(0,Math.min(1,comparisonNumber(dim===false?undefined:dim.opacity,.36)));
  const badgePhase=comparisonPhase({startAt:dimPhase.startAt,duration:Math.min(.3,dimPhase.duration)},3.5,3.8);
  return <div data-writing-comparison style={{position:'absolute',inset:0}}>
    {hasContent(heading)&&<div style={{position:'absolute',left:58,top:101,fontSize:21,fontWeight:800,color:'#292c33',opacity:1-compact}}>{heading}</div>}
    {[left,right].map((side,i)=>hasContent(side.columnTitle)&&<div key={i} style={{position:'absolute',left:i?420:49,top:122,width:320,paddingBottom:8,borderBottom:`1px solid ${i?'#bec0ba':'#d59b89'}`,fontSize:17,fontWeight:800,color:i?'#6b706c':'#cb785b',opacity:compact}}>{side.columnTitle}</div>)}
    <div data-writing-own style={{position:'absolute',left:mix(58,49,compact),top:mix(139,175,compact),width:318,height:mix(176,66,compact),background:'#fff',borderRadius:9,boxShadow:'0 7px 15px #30343e17',overflow:'hidden',opacity:during(t,leftTyping.startAt-.15,leftTyping.startAt+.15)}}>
      <div style={{padding:19,opacity:1-compact}}>{hasContent(left.label)&&<div style={{fontFamily:'monospace',fontSize:8,color:'#93969a',marginBottom:10}}>{left.label}</div>}<div data-own-typed style={{whiteSpace:'pre-wrap',fontSize:14,fontWeight:700,lineHeight:'25px',color:'#262a31',textDecoration:underline?'underline':'none',textDecorationColor:'#abb5e5',textUnderlineOffset:4}}>{own}</div></div>
      {check!==false&&hasContent(check.label)&&<div data-writing-check style={{position:'absolute',right:12,top:12,padding:'4px 7px',fontSize:9,fontWeight:700,color:'#5d72ad',background:'#edf1fb',borderRadius:4,opacity:comparisonProgress(t,checkPhase)*(1-compact)}}>{check.label}</div>}
      {compactPhase!==false&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',gap:12,padding:'10px 15px',boxSizing:'border-box',opacity:compact}}><div style={{width:54,height:42,overflow:'hidden',background:'#f1f1e9',borderRadius:3}}>{left.thumbnail}</div><div style={{fontSize:15,fontWeight:700,color:'#34373d'}}>{compactTitle(left)}{left.compactDescription!==undefined&&<div style={{fontSize:8,fontWeight:400,color:'#aaa',marginTop:4}}>{left.compactDescription}</div>}</div></div>}
    </div>
    <div data-writing-ai style={{position:'absolute',left:mix(418,420,compact),top:mix(139,175,compact),width:mix(268,320,compact),height:mix(176,66,compact),background:'#fff',borderRadius:9,boxShadow:'0 7px 15px #30343e17',opacity:during(t,rightTyping.startAt-.05,rightTyping.startAt+.25)}}>
      <div style={{padding:19,opacity:(1-compact)*mix(1,dimOpacity,dimProgress)}}>{hasContent(right.label)&&<div style={{fontFamily:'monospace',fontSize:8,color:'#93969a',marginBottom:10}}>{right.label}</div>}<div data-ai-typed style={{whiteSpace:'pre-wrap',fontSize:14,lineHeight:'25px',color:'#7d8287'}}>{ai}</div></div>
      {dim!==false&&hasContent(dim.badge)&&<div style={{position:'absolute',right:9,top:-12,borderRadius:16,padding:'5px 10px',fontSize:12,fontWeight:700,color:'#fff',background:'#da7250',opacity:comparisonProgress(t,badgePhase)*(1-compact)}}>{dim.badge}</div>}
      {compactPhase!==false&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',gap:12,padding:'10px 15px',boxSizing:'border-box',opacity:compact}}><div data-writing-ai-thumbnail style={{width:54,height:42,flexShrink:0,overflow:'hidden',background:'#161f34',borderRadius:3}}>{right.thumbnail}</div><div style={{fontSize:15,fontWeight:700,color:'#34373d'}}>{compactTitle(right)}{right.compactDescription!==undefined&&<div style={{fontSize:8,fontWeight:400,color:'#aaa',marginTop:4}}>{right.compactDescription}</div>}</div></div>}
    </div>
  </div>;
};
