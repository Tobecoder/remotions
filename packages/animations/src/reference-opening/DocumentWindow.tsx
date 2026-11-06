import type {HTMLAttributes,ReactNode} from 'react';
import {clamp,mix} from './motion';

export type DocumentWindowProps=Omit<HTMLAttributes<HTMLDivElement>,'title'|'children'> & {
  children:ReactNode;title?:ReactNode;overlay?:ReactNode;x?:number;y?:number;width?:number;height?:number;
  enterProgress?:number;scrollProgress?:number;scrollDistance?:number;
};

/** Caller-controlled document presentation, independent of headings and annotations. */
export const DocumentWindow=({children,title='文档',overlay,x=316,y=105,width=445,height=272,enterProgress=1,scrollProgress=0,scrollDistance=0,style,...attributes}:DocumentWindowProps)=>{
  const enter=clamp(enterProgress),scroll=clamp(scrollProgress),distance=Math.max(0,Number.isFinite(scrollDistance)?scrollDistance:0);
  return <div {...attributes} data-document-window style={{position:'absolute',left:Number.isFinite(x)?x:316,top:Number.isFinite(y)?y:105,width:Math.max(40,Number.isFinite(width)?width:445),height:Math.max(40,Number.isFinite(height)?height:272),background:'#fff',borderRadius:10,overflow:'hidden',boxShadow:'0 8px 17px #33363c1d',opacity:enter,transform:`translateX(${mix(24,0,enter)}px)`,...style}}>
    <div style={{height:25,borderBottom:'1px solid #eeeeec',display:'flex',alignItems:'center',gap:4,padding:'0 9px',boxSizing:'border-box'}}>{['#ee8e7f','#e9c675','#9cb49b'].map(color=><span key={color} style={{width:5,height:5,borderRadius:'50%',background:color}}/>)}<span style={{marginLeft:6,color:'#8c8f93',fontFamily:'monospace',fontSize:7}}>{title}</span></div>
    <div data-document-scroll-viewport style={{position:'absolute',left:9,right:9,top:30,bottom:9,overflow:'hidden'}}><div data-document-scroll-content data-scroll-progress={scroll} style={{position:'relative',width:'100%',height:`calc(100% + ${distance}px)`,transform:`translateY(${-distance*scroll}px)`}}>{children}</div></div>
    {overlay}
  </div>;
};
