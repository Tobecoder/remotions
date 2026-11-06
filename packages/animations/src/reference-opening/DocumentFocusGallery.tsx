import type {ReactNode} from 'react';
import {during,mix} from './motion';

export type FocusDocument={id:string;content:ReactNode};
export type DocumentFocusGalleryProps={time:number;startAt?:number;documents:readonly FocusDocument[];focusContent:ReactNode;caption?:ReactNode;badge?:string};

export const DocumentFocusGallery=({time,startAt=0,documents,focusContent,caption,badge='别拿老方法，用新模型'}:DocumentFocusGalleryProps)=>{
  const t=time-startAt,entryDuration=.3,entryInterval=.4,firstEntry=.1;
  const cardsReady=firstEntry+Math.max(0,documents.length-1)*entryInterval+entryDuration;
  const focusStart=Math.max(2.3,cardsReady+.3),focus=during(t,focusStart,focusStart+.7);
  const positions=[[49,100,240,155,-3],[293,100,240,155,1],[537,100,220,155,2],[209,260,182,141,2],[433,260,155,140,-1]];
  return <div data-document-gallery style={{position:'absolute',inset:0,isolation:'isolate'}}>
    <div data-document-background style={{position:'absolute',inset:0,filter:`blur(${focus*3}px)`,opacity:mix(1,.35,focus)}}>
      {documents.map((document,i)=>{const [x,y,width,height,rotation]=positions[i%positions.length],entry=firstEntry+i*entryInterval,p=during(t,entry,entry+entryDuration);return <div key={document.id} data-focus-document={document.id} style={{position:'absolute',left:x,top:y,width,height,background:'#fff',borderRadius:5,boxShadow:'0 5px 12px #34363816',overflow:'hidden',opacity:p,transform:`translateY(${mix(12,0,p)}px) rotate(${rotation}deg)`}}>{document.content}</div>;})}
      <div data-document-caption style={{position:'absolute',left:604,top:273,width:155,opacity:during(t,cardsReady,cardsReady+.25)}}>{caption}</div>
    </div>
    <div data-document-focus style={{position:'absolute',left:105,top:168,width:600,height:183,boxSizing:'border-box',background:'#fff',borderRadius:8,boxShadow:'0 10px 22px #30343e23',opacity:focus,transform:`translateY(${mix(24,0,focus)}px) scale(${mix(.96,1,focus)})`}}>{focusContent}<div style={{position:'absolute',right:-4,top:-18,padding:'6px 11px',borderRadius:18,background:'#d36d4d',color:'#fff',fontSize:12,fontWeight:700,opacity:during(focus,.6,1)}}>{badge}</div></div>
  </div>;
};
