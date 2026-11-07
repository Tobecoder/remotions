import type {HTMLAttributes,ReactNode} from 'react';
import {clamp,mix} from './motion';

export type ContentCollapsePose={x:number;y:number;scale:number};
export type ContentCollapseProps=Omit<HTMLAttributes<HTMLDivElement>,'children'> & {
  children:ReactNode;progress:number;to:ContentCollapsePose;from?:ContentCollapsePose;opacity?:number;
};
const finite=(value:number,fallback=0)=>Number.isFinite(value)?value:fallback;
const safePose=({x,y,scale}:ContentCollapsePose):ContentCollapsePose=>({x:finite(x),y:finite(y),scale:Math.max(0,finite(scale,1))});

/** Move and shrink arbitrary content. The caller owns timing, fading and any summary UI. */
export const ContentCollapse=({children,progress,to,from={x:0,y:0,scale:1},opacity=1,style,...attributes}:ContentCollapseProps)=>{
  const p=clamp(progress),start=safePose(from),end=safePose(to);
  return <div {...attributes} data-content-collapse style={{position:'absolute',inset:0,transformOrigin:'0 0',transform:`translate(${mix(start.x,end.x,p)}px,${mix(start.y,end.y,p)}px) scale(${mix(start.scale,end.scale,p)})`,opacity:clamp(opacity),...style}}>{children}</div>;
};
