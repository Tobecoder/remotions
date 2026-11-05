import type {CSSProperties, ReactNode} from 'react';
import {clamp} from './motion';

export type HeadingContent={number:string;title:string;description:string};
export type IntroHeadingContent={eyebrow:string;title:ReactNode;description:string};
export type ChapterHeadingProps={from:HeadingContent;to:HeadingContent;progress:number;x?:number;y?:number;intro?:IntroHeadingContent;introProgress?:number};
export const ChapterHeading = ({from,to,progress,x=46,y=124,intro,introProgress=1}: ChapterHeadingProps) => {
  const p=clamp(progress);
  const handoff=intro?clamp(introProgress):1;
  const row=(field:keyof HeadingContent,top:number,height:number,style:CSSProperties)=><div style={{position:'absolute',left:0,right:0,top,height,overflow:'hidden',...style}}>
    <div style={{position:'absolute',inset:0,transform:`translateY(${-height*p}px)`}}>{from[field]}</div>
    <div style={{position:'absolute',inset:0,transform:`translateY(${height*(1-p)}px)`}}>{to[field]}</div>
  </div>;
  return <>
    {intro?<div data-title-layer="intro" style={{position:'absolute',left:x+2,top:y+8,width:270,height:145,overflow:'hidden',opacity:1-handoff,pointerEvents:'none'}}>
      <div data-title-motion="intro" style={{transform:`translate3d(0,${-12*handoff}px,0)`,willChange:'transform'}}>
        <div style={{fontFamily:'monospace',fontSize:8,fontWeight:700,letterSpacing:2,color:'#ca6c4f',marginBottom:3}}>{intro.eyebrow}</div>
        <div style={{fontSize:35,fontWeight:900,lineHeight:'42px',letterSpacing:-.65,color:'#27282d'}}>{intro.title}</div>
        <div style={{marginTop:14,fontSize:13,fontWeight:600,color:'#929297'}}>{intro.description}</div>
      </div>
    </div>:null}
    <div data-title-layer="chapter" style={{position:'absolute',inset:0,opacity:handoff,transform:intro?`translate3d(0,${14*(1-handoff)}px,0)`:undefined,willChange:intro?'transform, opacity':undefined}}>
    <div data-chapter-heading style={{position:'absolute',left:x,top:y,width:275,height:145}}>
    {row('number',0,14,{color:'#cc7055',fontFamily:'monospace',fontSize:8,fontWeight:700,letterSpacing:2,lineHeight:'14px'})}
    {row('title',20,58,{fontSize:42,fontWeight:900,letterSpacing:-1.5,lineHeight:'56px',color:'#25272d'})}
    {row('description',98,24,{fontSize:14,fontWeight:600,color:'#8e8f94',lineHeight:'24px'})}
    </div>
    </div>
  </>;
};
