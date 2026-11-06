import type {ReactNode} from 'react';
import {during,mix} from './motion';

export type PreparationCard={id:string;title:string;description?:string;artwork:ReactNode};
export type PreparationCardsProps={time:number;startAt?:number;cards:readonly PreparationCard[]};

/** Four materials enter in order, hold, then collect at the Agent's position. */
export const PreparationCards=({time,startAt=0,cards}:PreparationCardsProps)=>{
  const t=time-startAt,collect=during(t,3.35,3.95);
  return <div data-preparation-cards style={{position:'absolute',inset:0,pointerEvents:'none'}}>
    {cards.map((card,i)=>{
      const enter=during(t,.15+i*.25,.55+i*.25),x=70+i*178,rotation=[-4,-1,0,4][i%4];
      return <div key={card.id} data-preparation-card={card.id} style={{position:'absolute',left:mix(x,251,collect),top:mix(175+36*(1-enter),168,collect),width:132,height:166,boxSizing:'border-box',padding:'9px 9px 12px',background:'#ffffffee',border:'3px solid #fdfefc',borderRadius:12,boxShadow:'0 8px 15px #30343e1c, inset 0 0 0 1px #e7e9e4',opacity:enter*(1-during(t,3.65,3.95)),transform:`scale(${mix(.92,1,enter)*mix(1,.2,collect)}) rotate(${rotation*(1-collect)}deg)`,transformOrigin:'66px 83px'}}>
        <div style={{height:111,display:'flex',alignItems:'center',justifyContent:'center'}}>{card.artwork}</div>
        <div style={{marginTop:5,textAlign:'center',fontSize:14,fontWeight:800,color:'#292d35'}}>{card.title}</div>
        {card.description&&<div style={{textAlign:'center',fontSize:6,marginTop:3,color:'#60646b'}}>{card.description}</div>}
      </div>;
    })}
  </div>;
};
