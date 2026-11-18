import type {ReactNode} from 'react';
import {ContentCollapse} from '../../../packages/animations/src';
import type {ContentCollapsePose} from '../../../packages/animations/src';
import {clamp,during} from '../../../packages/animations/src/reference-opening/motion';

export type SectionCollapseProps={
  children:ReactNode;
  progress:number;
  label:string;
  number?:string;
  target?:{x:number;y:number;width:number;height:number};
  transition?:{contentTarget:ContentCollapsePose;contentOpacity:number;bookmarkOpacity:number};
};

/** Case-owned summary entry; the reusable motion lives in ContentCollapse. */
export const SectionCollapse=({children,progress,label,number='1',target={x:49,y:47,width:150,height:37},transition}:SectionCollapseProps)=>{
  const p=clamp(progress);
  const contentTarget=transition?.contentTarget??{x:target.x,y:target.y,scale:.06};
  const contentOpacity=transition?.contentOpacity??1-during(p,.65,1);
  const bookmarkOpacity=transition?.bookmarkOpacity??during(p,.4,1);
  return <>
    <ContentCollapse data-section-collapse-scene progress={p} to={contentTarget} opacity={contentOpacity}>{children}</ContentCollapse>
    <div data-section-bookmark style={{position:'absolute',left:target.x,top:target.y,width:target.width,height:target.height,boxSizing:'border-box',display:'flex',alignItems:'center',gap:7,padding:'0 9px',borderRadius:9,background:'#fffffff0',boxShadow:'0 5px 12px #30343e14',opacity:bookmarkOpacity}}>
      <span style={{width:19,height:19,flexShrink:0,borderRadius:'50%',background:'#d96a48',color:'#fff',fontSize:11,lineHeight:'19px',textAlign:'center',fontFamily:'monospace'}}>{number}</span><span style={{fontSize:12,fontWeight:700,color:'#282b31'}}>{label}</span>
    </div>
  </>;
};
