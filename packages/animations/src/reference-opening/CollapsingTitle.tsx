import type {HTMLAttributes,ReactNode} from 'react';
import {clamp,mix} from './motion';

export type TitlePosition={x:number;y:number};
export type CollapsingTitleProps=Omit<HTMLAttributes<HTMLDivElement>,'title'|'children'> & {
  title:ReactNode;progress:number;lead?:ReactNode;description?:ReactNode;compactDescription?:ReactNode;
  from?:TitlePosition;to?:TitlePosition;fontSize?:number;compactFontSize?:number;
};

/** Keep one title visible while moving and scaling it into a compact label. Positions anchor the title itself. */
export const CollapsingTitle=({title,progress,lead,description,compactDescription,from={x:49,y:235},to={x:75,y:191},fontSize=30,compactFontSize=18,style,...attributes}:CollapsingTitleProps)=>{
  const p=clamp(progress),large=Math.max(1,Number.isFinite(fontSize)?fontSize:30),small=Math.max(1,Number.isFinite(compactFontSize)?compactFontSize:18),ratio=small/large,scale=mix(1,ratio,p),lineHeight=large*1.2;
  const coordinate=(value:number,fallback:number)=>Number.isFinite(value)?value:fallback;
  return <div {...attributes} data-collapsing-title style={{position:'absolute',left:mix(coordinate(from.x,49),coordinate(to.x,75),p),top:mix(coordinate(from.y,235),coordinate(to.y,191),p),width:275,height:lineHeight+40,transform:`scale(${scale})`,transformOrigin:'0 0',fontWeight:800,fontSize:large,lineHeight:`${lineHeight}px`,color:'#292c32',...style}}>
    {lead!==undefined&&<div data-collapsing-title-lead style={{position:'absolute',left:0,top:-lineHeight,opacity:1-p}}>{lead}</div>}
    <div data-collapsing-title-text>{title}</div>
    {description!==undefined&&<div data-collapsing-description="expanded" style={{position:'absolute',left:0,top:lineHeight+10,fontSize:12,fontWeight:500,lineHeight:'20px',color:'#999b9e',opacity:1-p}}>{description}</div>}
    {compactDescription!==undefined&&<div data-collapsing-description="compact" style={{position:'absolute',left:0,top:mix(lineHeight+10,lineHeight+9,p),fontSize:mix(12,8/ratio,p),fontWeight:400,lineHeight:'20px',color:'#94969a',opacity:p}}>{compactDescription}</div>}
  </div>;
};
