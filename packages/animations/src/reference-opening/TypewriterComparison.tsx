import type {ReactNode} from 'react';
import {during,mix} from './motion';

export type TypewriterComparisonProps={time:number;startAt?:number;ownText:string;aiText:string;ownThumbnail?:ReactNode;aiThumbnail?:ReactNode};
const type=(text:string,progress:number)=>Array.from(text).slice(0,Math.floor(Array.from(text).length*progress)).join('');
export const TypewriterComparison=({time,startAt=0,ownText,aiText,ownThumbnail,aiThumbnail}:TypewriterComparisonProps)=>{
  const t=time-startAt,compact=during(t,4.9,5.5),own=type(ownText,during(t,.15,2.7)),ai=type(aiText,during(t,2.3,3.5));
  return <div data-writing-comparison style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:58,top:101,fontSize:21,fontWeight:800,color:'#292c33',opacity:1-compact}}>主要<span style={{color:'#ce6d4d'}}>自己写</span>，AI 辅助校验</div>
    {['我自己写','交给 AI 写'].map((title,i)=><div key={title} style={{position:'absolute',left:i?420:49,top:122,width:320,paddingBottom:8,borderBottom:`1px solid ${i?'#bec0ba':'#d59b89'}`,fontSize:17,fontWeight:800,color:i?'#6b706c':'#cb785b',opacity:compact}}>{title}</div>)}
    <div data-writing-own style={{position:'absolute',left:mix(58,49,compact),top:mix(139,175,compact),width:318,height:mix(176,66,compact),background:'#fff',borderRadius:9,boxShadow:'0 7px 15px #30343e17',overflow:'hidden',opacity:during(t,0,.3)}}>
      <div style={{padding:19,opacity:1-compact}}><div style={{fontFamily:'monospace',fontSize:8,color:'#93969a',marginBottom:10}}>我写的</div><div data-own-typed style={{whiteSpace:'pre-wrap',fontSize:14,fontWeight:700,lineHeight:'25px',color:'#262a31',textDecoration:t>1.8?'underline':'none',textDecorationColor:'#abb5e5',textUnderlineOffset:4}}>{own}</div></div>
      <div data-writing-check style={{position:'absolute',right:12,top:12,padding:'4px 7px',fontSize:9,fontWeight:700,color:'#5d72ad',background:'#edf1fb',borderRadius:4,opacity:during(t,1.7,2)*(1-compact)}}>AI 校验 · 2 处建议</div>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',gap:12,padding:'10px 15px',boxSizing:'border-box',opacity:compact}}><div style={{width:54,height:42,overflow:'hidden',background:'#f1f1e9',borderRadius:3}}>{ownThumbnail}</div><div style={{fontSize:15,fontWeight:700,color:'#34373d'}}>我的视频脚本<div style={{fontSize:8,fontWeight:400,color:'#aaa',marginTop:4}}>分享经验与体会</div></div></div>
    </div>
    <div data-writing-ai style={{position:'absolute',left:mix(418,420,compact),top:mix(139,175,compact),width:mix(268,320,compact),height:mix(176,66,compact),background:'#fff',borderRadius:9,boxShadow:'0 7px 15px #30343e17',opacity:during(t,2.25,2.55)}}>
      <div style={{padding:19,opacity:(1-compact)*mix(1,.36,during(t,3.5,4.4))}}><div style={{fontFamily:'monospace',fontSize:8,color:'#93969a',marginBottom:10}}>AI 写的</div><div data-ai-typed style={{whiteSpace:'pre-wrap',fontSize:14,lineHeight:'25px',color:'#7d8287'}}>{ai}</div></div>
      <div style={{position:'absolute',right:9,top:-12,borderRadius:16,padding:'5px 10px',fontSize:12,fontWeight:700,color:'#fff',background:'#da7250',opacity:during(t,3.5,3.8)*(1-compact)}}>没有体感</div>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',gap:12,padding:'10px 15px',boxSizing:'border-box',opacity:compact}}><div style={{width:54,height:42,overflow:'hidden',background:'#161f34',borderRadius:3}}>{aiThumbnail}</div><div style={{fontSize:15,fontWeight:700,color:'#34373d'}}>『Vibe 知识大赏』<div style={{fontSize:8,fontWeight:400,color:'#aaa',marginTop:4}}>知识科普，可以让 AI 写</div></div></div>
    </div>
  </div>;
};
