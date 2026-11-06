import type {ReactNode} from 'react';
import {clamp,during,mix} from './motion';

export type SectionCollapseProps={children:ReactNode;progress:number;label:string;number?:string;target?:{x:number;y:number;width:number;height:number};};

/** Shrink a finished explanation into its summary entry; keep the background and subtitles outside. */
export const SectionCollapse=({children,progress,label,number='1',target={x:49,y:47,width:150,height:37}}:SectionCollapseProps)=>{
  const p=clamp(progress);
  return <>
    <div data-section-collapse-scene style={{position:'absolute',inset:0,transformOrigin:'0 0',transform:`translate(${target.x*p}px,${target.y*p}px) scale(${mix(1,.06,p)})`,opacity:1-during(p,.65,1)}}>{children}</div>
    <div data-section-bookmark style={{position:'absolute',left:target.x,top:target.y,width:target.width,height:target.height,boxSizing:'border-box',display:'flex',alignItems:'center',gap:7,padding:'0 9px',borderRadius:9,background:'#fffffff0',boxShadow:'0 5px 12px #30343e14',opacity:during(p,.4,1)}}>
      <span style={{width:19,height:19,flexShrink:0,borderRadius:'50%',background:'#d96a48',color:'#fff',fontSize:11,lineHeight:'19px',textAlign:'center',fontFamily:'monospace'}}>{number}</span><span style={{fontSize:12,fontWeight:700,color:'#282b31'}}>{label}</span>
    </div>
  </>;
};
