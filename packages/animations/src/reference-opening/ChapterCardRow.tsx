import type {ReactNode} from 'react';
import {clamp,mix} from './motion';

export type ChapterCard={id:string;title:string;description:string;content:ReactNode};
export type ChapterCardRowProps={cards:readonly ChapterCard[];progress:number;};

/** Collect chapter thumbnails into a centered overview. Content fills the illustration area. */
export const ChapterCardRow=({cards,progress}:ChapterCardRowProps)=>{
  const p=clamp(progress),count=cards.length;
  const smallWidth=Math.min(153,660/Math.max(1,count)-16),largeWidth=Math.min(196,660/Math.max(1,count)-24);
  const width=mix(smallWidth,largeWidth,p),height=mix(92,160,p),gap=mix(17,24,p);
  const rowWidth=count*width+Math.max(0,count-1)*gap;
  const x=mix(155,(800-rowWidth)/2,p),y=mix(310,193,p);
  return <div data-chapter-row style={{position:'absolute',inset:0}}>
    {cards.map((card,i)=><div key={card.id} data-chapter-card={card.id} style={{position:'absolute',left:x+i*(width+gap),top:y,width,height,borderRadius:10,background:'#ffffffbd',boxShadow:'0 8px 16px #2c303012'}}>
      <div style={{position:'absolute',inset:`${mix(3,8,p)}px 7px ${mix(28,48,p)}px`,overflow:'hidden'}}>{card.content}</div>
      <div style={{position:'absolute',left:7,right:7,bottom:mix(17,28,p),textAlign:'center',fontSize:mix(8,13,p),fontWeight:700,color:'#303238'}}><span style={{color:'#c77055',fontFamily:'monospace',fontSize:mix(5,8,p),marginRight:4}}>{String(i+1).padStart(2,'0')}</span>{card.title}</div>
      <div style={{position:'absolute',left:7,right:7,bottom:mix(7,12,p),textAlign:'center',fontSize:mix(5,8,p),color:'#74767b'}}>{card.description}</div>
    </div>)}
  </div>;
};
