import type {ReactNode} from 'react';
import {CardEntrance,ContentCollapse} from '../../../packages/animations/src';
import {during} from '../../../packages/animations/src/reference-opening/motion';

export type PreparationCard={id:string;title:string;description?:string;artwork:ReactNode};
export type PreparationCardsProps={time:number;startAt?:number;cards:readonly PreparationCard[]};

/** Case-owned four-card sequence using the independent entry and collapse actions. */
export const PreparationCards=({time,startAt=0,cards}:PreparationCardsProps)=>{
  const t=time-startAt,collect=during(t,3.35,3.95);
  return <div data-preparation-cards style={{position:'absolute',inset:0,pointerEvents:'none'}}>
    {cards.map((card,i)=>{
      const enter=during(t,.15+i*.25,.55+i*.25),x=70+i*178,rotation=[-4,-1,0,4][i%4];
      // The four cards settle before collection; both actions share the card's center.
      return <ContentCollapse key={card.id} data-preparation-card-motion={card.id} progress={collect} from={{x,y:175,scale:1}} to={{x:251,y:168,scale:.2}} opacity={1-during(t,3.65,3.95)} style={{width:132,height:166,transformOrigin:'66px 83px'}}>
        <CardEntrance data-preparation-card={card.id} progress={enter} x={0} y={0} width={132} height={166} offset={{x:0,y:36}} fromScale={.92} rotation={rotation*(1-collect)} background="#ffffffee" borderRadius={12} boxShadow="0 8px 15px #30343e1c, inset 0 0 0 1px #e7e9e4" style={{boxSizing:'border-box',padding:'9px 9px 12px',border:'3px solid #fdfefc',overflow:'visible',transformOrigin:'66px 83px'}}>
          <div style={{height:111,display:'flex',alignItems:'center',justifyContent:'center'}}>{card.artwork}</div>
          <div style={{marginTop:5,textAlign:'center',fontSize:14,fontWeight:800,color:'#292d35'}}>{card.title}</div>
          {card.description&&<div style={{textAlign:'center',fontSize:6,marginTop:3,color:'#60646b'}}>{card.description}</div>}
        </CardEntrance>
      </ContentCollapse>;
    })}
  </div>;
};
