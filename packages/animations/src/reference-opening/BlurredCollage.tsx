import {useId, type ReactNode} from 'react';
import {during} from './motion';

export type CollageCard = {
  id: string;
  content: ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
};
export type BlurredCollageProps = {
  /** Seconds, calculated from the composition frame. Coordinates use an 800 × 450 stage. */
  time: number;
  startAt?: number;
  cards: readonly CollageCard[];
  /** Stationary paper/image slot. Omit to use the built-in static paper grain. */
  paper?: ReactNode;
  backgroundColor?: string;
  /** Design pixels per second; negative x and positive y drift down and left. */
  drift?: {x: number; y: number};
  blur?: number;
  opacity?: number;
  fadeStart?: number;
  fadeEnd?: number;
};

/** A stationary paper base underneath a drifting, fading collage. No internal clock or CSS animation. */
export const BlurredCollage = ({time,startAt=0,cards,paper,backgroundColor='#f5f6ef',drift={x:-16,y:8},blur=3,opacity=.33,fadeStart=3,fadeEnd=4.25}:BlurredCollageProps) => {
  const grainId=`paper-${useId().replace(/:/g,'')}`;
  const localTime=Math.max(0,time-startAt);
  const alpha=(1-during(localTime,fadeStart,fadeEnd))*opacity;
  return <div data-blurred-collage style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
    <div data-collage-paper style={{position:'absolute',inset:0,background:backgroundColor}}>
      {paper??<svg width="100%" height="100%" style={{position:'absolute',inset:0,opacity:.12}} aria-hidden="true"><defs><filter id={grainId}><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch" seed="7"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="100%" height="100%" filter={`url(#${grainId})`}/></svg>}
    </div>
    <div data-collage-drift style={{position:'absolute',inset:0,filter:`blur(${blur}px) saturate(.35)`,opacity:alpha,transform:`translate(${localTime*drift.x}px,${localTime*drift.y}px)`}}>
      {cards.map(card=><div key={card.id} data-collage-card={card.id} style={{position:'absolute',left:card.x,top:card.y,width:card.width,height:card.height,transform:`rotate(${card.rotation??0}deg)`,background:'#fff',boxShadow:'0 7px 9px #34393417',overflow:'hidden'}}>{card.content}</div>)}
    </div>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 42%,transparent 35%,#c9ccbd0d 100%)'}}/>
  </div>;
};
