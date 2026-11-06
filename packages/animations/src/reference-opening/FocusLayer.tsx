import type {CSSProperties,HTMLAttributes,ReactNode} from 'react';
import {clamp,mix} from './motion';

export type FocusLayerProps=Omit<HTMLAttributes<HTMLDivElement>,'children'|'background'> & {
  progress:number;background:ReactNode;foreground:ReactNode;rect:{x:number;y:number;width:number;height:number};
  blur?:number;backgroundOpacity?:number;offset?:{x:number;y:number};fromScale?:number;panelStyle?:CSSProperties;
};
const finite=(value:number,fallback=0)=>Number.isFinite(value)?value:fallback;

/** Focus arbitrary foreground content over an arbitrary background, with no gallery or timeline. */
export const FocusLayer=({progress,background,foreground,rect,blur=3,backgroundOpacity=.35,offset={x:0,y:24},fromScale=.96,panelStyle,style,...attributes}:FocusLayerProps)=>{
  const p=clamp(progress),dx=mix(finite(offset.x),0,p),dy=mix(finite(offset.y,24),0,p);
  const translation=dx===0?`translateY(${dy}px)`:`translate(${dx}px,${dy}px)`;
  return <div {...attributes} data-focus-layer style={{position:'absolute',inset:0,isolation:'isolate',...style}}>
    <div data-focus-background style={{position:'absolute',inset:0,filter:`blur(${p*Math.max(0,finite(blur,3))}px)`,opacity:mix(1,clamp(backgroundOpacity),p)}}>{background}</div>
    <div data-focus-foreground style={{position:'absolute',left:finite(rect.x),top:finite(rect.y),width:Math.max(0,finite(rect.width)),height:Math.max(0,finite(rect.height)),boxSizing:'border-box',background:'#fff',borderRadius:8,boxShadow:'0 10px 22px #30343e23',opacity:p,transform:`${translation} scale(${mix(Math.max(0,finite(fromScale,.96)),1,p)})`,...panelStyle}}>{foreground}</div>
  </div>;
};
