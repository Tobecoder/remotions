import type {HTMLAttributes} from 'react';
import {clamp} from './motion';

export type HighlightBoxProps=Omit<HTMLAttributes<HTMLDivElement>,'color'|'children'> & {
  progress:number;x?:number;y?:number;width?:number;height?:number;color?:string;shadowColor?:string;radius?:number;strokeWidth?:number;
};

/** Draw a highlight over any content; progress and coordinates belong to its caller. */
export const HighlightBox=({progress,x=118,y=64,width=219,height=160,color='#d87552',shadowColor='#dd80531b',radius=6,strokeWidth=1.5,style,...attributes}:HighlightBoxProps)=>{
  const p=clamp(progress),finite=(value:number,fallback:number)=>Number.isFinite(value)?value:fallback;
  return <div {...attributes} data-highlight-box style={{position:'absolute',left:finite(x,118),top:finite(y,64),width:Math.max(0,finite(width,219)),height:Math.max(0,finite(height,160)),border:`${Math.max(0,finite(strokeWidth,1.5))}px solid ${color}`,borderRadius:Math.max(0,finite(radius,6)),boxShadow:`0 0 0 3px ${shadowColor}`,boxSizing:'border-box',opacity:p,transform:`scaleX(${p})`,transformOrigin:'0 0',...style}}/>;
};
