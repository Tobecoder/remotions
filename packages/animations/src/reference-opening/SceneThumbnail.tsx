import type {ReactNode} from 'react';
import {clamp, mix} from './motion';

export type SceneThumbnailProps = {children:ReactNode;progress:number;target?:{x:number;y:number;scale:number};card?:{x:number;y:number;width:number;height:number};caption?:string;number?:string};

/** The scene remains the same tree while its entire coordinate space shrinks into a card. */
export const SceneThumbnail = ({children,progress,target={x:120,y:298,scale:.23},card={x:155,y:310,width:153,height:92},caption='从脚本到成片',number='01'}:SceneThumbnailProps) => {
  const p=clamp(progress);
  return <>
    <div data-chapter-thumbnail style={{position:'absolute',left:card.x,top:card.y,width:card.width,height:card.height,borderRadius:10,background:'#ffffffbd',boxShadow:'0 8px 16px #2c303012',opacity:p}}/>
    <div style={{position:'absolute',inset:0,transformOrigin:'0 0',transform:`translate(${target.x*p}px,${target.y*p}px) scale(${mix(1,target.scale,p)})`}}>{children}</div>
    <div style={{position:'absolute',left:card.x,top:card.y+card.height-20,width:card.width,textAlign:'center',fontSize:6,color:'#5e6065',opacity:p}}><span style={{color:'#c77055',fontFamily:'monospace',fontSize:5,marginRight:4}}>{number}</span>{caption}</div>
  </>;
};
