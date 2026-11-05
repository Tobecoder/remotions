import type {ReactNode} from 'react';
import {clamp, during, mix} from './motion';

export type FanCard = {id:string;content:ReactNode;caption:string};
export type FanCardDeckProps = {cards:readonly FanCard[];progress:number;x?:number;y?:number;cardWidth?:number;cardHeight?:number;spread?:number;angle?:number};

export const FanCardDeck = ({cards,progress,x=287,y=126,cardWidth=84,cardHeight=132,spread=65,angle=9}:FanCardDeckProps) => {
  const p=clamp(progress),middle=(cards.length-1)/2;
  return <div data-fan-deck style={{position:'absolute',left:x,top:y,opacity:during(p,0,.55)}}>
    {cards.map((card,i)=>{
      const distance=i-middle;
      const local=during(p,i*.025,.76+i*.025);
      return <div key={card.id} data-fan-card={card.id} style={{position:'absolute',width:cardWidth,height:cardHeight,left:mix(middle*spread,i*spread,local),top:mix(30,Math.abs(distance)**1.5*10,local),padding:6,boxSizing:'border-box',borderRadius:4,background:'#fff',boxShadow:'0 8px 12px #292c3015',transformOrigin:'50% 85%',transform:`translateY(${mix(16,0,local)}px) rotate(${distance*angle*local}deg)`,opacity:local}}>
        <div style={{height:cardHeight-30,overflow:'hidden',borderRadius:1}}>{card.content}</div>
        <div style={{marginTop:7,fontFamily:'monospace',fontSize:5.5,whiteSpace:'nowrap',textAlign:'center',fontWeight:700,color:'#303136'}}>{card.caption}</div>
      </div>;
    })}
  </div>;
};
