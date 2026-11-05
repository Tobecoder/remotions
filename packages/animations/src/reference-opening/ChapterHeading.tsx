import type {CSSProperties} from 'react';
import {clamp} from './motion';

export type HeadingContent={number:string;title:string;description:string};
export type ChapterHeadingProps={from:HeadingContent;to:HeadingContent;progress:number;x?:number;y?:number};
export const ChapterHeading = ({from,to,progress,x=46,y=124}: ChapterHeadingProps) => {
  const p=clamp(progress);
  const row=(field:keyof HeadingContent,top:number,height:number,style:CSSProperties)=><div style={{position:'absolute',left:0,right:0,top,height,overflow:'hidden',...style}}>
    <div style={{position:'absolute',inset:0,transform:`translateY(${-height*p}px)`}}>{from[field]}</div>
    <div style={{position:'absolute',inset:0,transform:`translateY(${height*(1-p)}px)`}}>{to[field]}</div>
  </div>;
  return <div data-chapter-heading style={{position:'absolute',left:x,top:y,width:275,height:145}}>
    {row('number',0,14,{color:'#cc7055',fontFamily:'monospace',fontSize:8,fontWeight:700,letterSpacing:2,lineHeight:'14px'})}
    {row('title',20,58,{fontSize:42,fontWeight:900,letterSpacing:-1.5,lineHeight:'56px',color:'#25272d'})}
    {row('description',98,24,{fontSize:14,fontWeight:600,color:'#8e8f94',lineHeight:'24px'})}
  </div>;
};
