import {useId} from 'react';
import {during,mix} from './motion';

export type TargetReticleMove={startAt?:number;duration?:number;to?:{x:number;y:number;scale?:number}};
export type TargetReticleProps={time:number;startAt?:number;color?:string;shotLabel?:string;aimLabel?:string;move?:false|TargetReticleMove};
const finite=(value:number|undefined,fallback:number)=>value!==undefined&&Number.isFinite(value)?value:fallback;

export const TargetReticle=({time,startAt=0,color='#dc704d',shotLabel='先开枪',aimLabel='再瞄准',move:moveOptions={}}:TargetReticleProps)=>{
  const t=time-startAt,enter=during(t,0,.4),aim=during(t,.9,1.6);
  const config:TargetReticleMove=moveOptions===false?{}:moveOptions;
  const moveStart=finite(config.startAt,1.8),duration=Math.max(0,finite(config.duration,3.4-1.8));
  const move=moveOptions===false?0:duration===0?Number(t>=moveStart):during(t,moveStart,moveStart+duration);
  const labelOut=moveOptions===false?0:duration===0?move:during(t,moveStart,moveStart+Math.min(.4,duration));
  const x=mix(400,finite(config.to?.x,199),move),y=mix(277,finite(config.to?.y,277),move);
  const scale=mix(1,Math.max(0,finite(config.to?.scale,.78)),move),labels=during(t,.8,1.2)*(1-labelOut);
  const impact=t-.6;
  const recoil=impact>0&&impact<.28?Math.sin(impact*75)*Math.exp(-impact*13)*(1-during(impact,.2,.28)):0;
  const id=`target-${useId().replace(/:/g,'')}`;
  return <div data-target-reticle style={{position:'absolute',inset:0,opacity:enter}}>
    <svg width="800" height="450" style={{position:'absolute',inset:0,overflow:'visible'}}>
      <defs><filter id={id} x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity=".15"/></filter></defs>
      <path d={`M-10 385L${x+47*scale} ${y-34*scale}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1-during(t,.1,.6)} stroke={color} strokeWidth="1.2" opacity={1-during(t,.85,1.5)}/>
      <g data-target-face transform={`translate(${x} ${y}) scale(${scale*(.92+.08*enter)})`}>
        <g data-target-impact transform={`translate(${recoil*8} ${recoil*-4}) rotate(${recoil*.8})`}>
        <circle r="103" fill="#fff" filter={`url(#${id})`}/>
        {[100,80,60,40,20].map((r,i)=><circle key={r} r={r} fill={i%2?'#fafafa':'#ededf0'} stroke="#333840" strokeWidth=".8"/>)}
        <circle r="16" fill={color}/>
        {[1,2,3,4].map((n,i)=><text key={n} x={91-i*20} y="3" fontFamily="monospace" fontSize="8" fill="#45474d">{n}</text>)}
        <circle data-target-shot cx="47" cy="-34" r="5.5" fill="#262930" opacity={during(t,.35,.65)}/>
        <g data-target-crosshair transform={`translate(${mix(47,0,aim)} ${mix(-34,0,aim)})`} opacity={during(t,.8,1.1)} stroke={color} fill="none"><circle r="25" strokeWidth="1.2"/><path d="M-31 0H31M0-31V31" strokeWidth="1.1"/></g>
        <g opacity={labels}><rect x="66" y="-70" width="56" height="23" rx="11.5" fill={color}/><text x="94" y="-55" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="700">{shotLabel}</text><rect x="70" y="73" width="56" height="21" rx="10" fill="#fff"/><text x="98" y="87" fontSize="9" fill={color} textAnchor="middle" fontWeight="700">{aimLabel}</text></g>
        </g>
      </g>
    </svg>
  </div>;
};
