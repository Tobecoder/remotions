import type {ReactNode} from 'react';
import {during} from '../../../packages/animations/src/reference-opening/motion';
import {CardEntrance,FocusLayer} from '../../../packages/animations/src';

export type FocusDocument={id:string;content:ReactNode};
export type DocumentFocusGalleryProps={time:number;startAt?:number;documents:readonly FocusDocument[];focusContent:ReactNode;caption?:ReactNode;badge?:string};

export const DocumentFocusGallery=({time,startAt=0,documents,focusContent,caption,badge='别拿老方法，用新模型'}:DocumentFocusGalleryProps)=>{
  const t=time-startAt,entryDuration=.3,entryInterval=.4,firstEntry=.1;
  const cardsReady=firstEntry+Math.max(0,documents.length-1)*entryInterval+entryDuration;
  const focusStart=Math.max(2.3,cardsReady+.3),focus=during(t,focusStart,focusStart+.7);
  const positions=[[49,100,240,155,-3],[293,100,240,155,1],[537,100,220,155,2],[209,260,182,141,2],[433,260,155,140,-1]];
  return <FocusLayer data-document-gallery progress={focus} rect={{x:105,y:168,width:600,height:183}} background={<>
      {documents.map((document,i)=>{const [x,y,width,height,rotation]=positions[i%positions.length],entry=firstEntry+i*entryInterval,p=during(t,entry,entry+entryDuration);return <CardEntrance key={document.id} data-focus-document={document.id} progress={p} x={x} y={y} width={width} height={height} rotation={rotation}>{document.content}</CardEntrance>;})}
      <div data-document-caption style={{position:'absolute',left:604,top:273,width:155,opacity:during(t,cardsReady,cardsReady+.25)}}>{caption}</div>
    </>} foreground={<>{focusContent}<div data-gallery-badge style={{position:'absolute',right:-4,top:-18,padding:'6px 11px',borderRadius:18,background:'#d36d4d',color:'#fff',fontSize:12,fontWeight:700,opacity:during(focus,.6,1)}}>{badge}</div></>}/>;
};
