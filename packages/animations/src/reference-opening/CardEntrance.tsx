import type {HTMLAttributes,ReactNode} from 'react';
import {clamp,mix} from './motion';

export type CardEntranceProps=Omit<HTMLAttributes<HTMLDivElement>,'children'> & {
  children:ReactNode;progress:number;x:number;y:number;width:number;height:number;
  rotation?:number;offset?:{x:number;y:number};background?:string;borderRadius?:number;boxShadow?:string;
};
const finite=(value:number,fallback=0)=>Number.isFinite(value)?value:fallback;

/** One independent card. Its caller owns card count, layout and entry order. */
export const CardEntrance=({children,progress,x,y,width,height,rotation=0,offset={x:0,y:12},background='#fff',borderRadius=5,boxShadow='0 5px 12px #34363816',style,...attributes}:CardEntranceProps)=>{
  const p=clamp(progress),dx=mix(finite(offset.x),0,p),dy=mix(finite(offset.y,12),0,p);
  const translation=dx===0?`translateY(${dy}px)`:`translate(${dx}px,${dy}px)`;
  return <div {...attributes} data-card-entrance style={{position:'absolute',left:finite(x),top:finite(y),width:Math.max(0,finite(width)),height:Math.max(0,finite(height)),background,borderRadius:Math.max(0,finite(borderRadius,5)),boxShadow,overflow:'hidden',opacity:p,transform:`${translation} rotate(${finite(rotation)}deg)`,...style}}>{children}</div>;
};
