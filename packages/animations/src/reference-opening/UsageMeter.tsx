import type {HTMLAttributes,ReactNode} from 'react';
import {clamp} from './motion';

export type UsageIndicator={id:string;x:number;y:number;width?:number;height?:number;segments?:number;progress?:number;color?:string;opacity?:number};
export type UsageMeterProps=Omit<HTMLAttributes<HTMLDivElement>,'children'|'color'> & {
  value:number;label?:ReactNode;color?:string;indicators?:readonly UsageIndicator[];
  x?:number;y?:number;width?:number;time?:number;blink?:boolean;children?:ReactNode;
};
const finite=(n:number,fallback:number)=>Number.isFinite(n)?n:fallback;

/** A number and segmented indicators; data, transitions and center artwork belong to the caller. */
export const UsageMeter=({value,label='用量',color='#c64d5b',indicators=[{id:'primary',x:280,y:80}],x=0,y=0,width=340,time=0,blink=true,children,style,...attributes}:UsageMeterProps)=>{
  const scale=Math.max(1,finite(width,340))/340;
  return <div {...attributes} data-usage-meter style={{position:'absolute',left:finite(x,0),top:finite(y,0),width:340*scale,height:200*scale,...style}}>
    <div style={{position:'absolute',width:340,height:200,transformOrigin:'0 0',transform:`scale(${scale})`}}>
      <div data-usage-label style={{position:'absolute',left:0,top:0,width:150,textAlign:'center',fontSize:9,letterSpacing:.6,color:'#8c8d93'}}>{label}</div>
      <div data-usage-value style={{position:'absolute',left:-10,top:17,width:170,textAlign:'center',fontSize:29,lineHeight:'35px',fontWeight:800,fontFamily:'monospace',color}}>{Math.round(finite(value,0)).toLocaleString('en-US')}</div>
      {children}
      {indicators.map(({id,x:ix,y:iy,width:iw=44,height=80,segments=5,progress=1,color:ink=color,opacity=1})=>{
        const count=Math.min(32,Math.max(1,Math.round(finite(segments,5))));
        const h=Math.max(1,finite(height,80)),w=Math.max(1,finite(iw,44));
        const gap=count===1?0:Math.min(2,h/(count*2)),barHeight=(h-gap*(count-1))/count,level=clamp(finite(progress,0));
        return <svg key={id} data-usage-indicator={id} width={w+6} height={h+6} viewBox={`0 0 ${w+6} ${h+6}`} style={{position:'absolute',left:finite(ix,280)-3,top:finite(iy,80)-3,opacity:clamp(finite(opacity,1)),overflow:'visible'}} aria-label={`${count} 格，${Math.round(level*100)}%`}>
          <rect width={w+6} height={h+6} rx="4" fill="#ffffffb8"/>
          {Array.from({length:count},(_,i)=>{
            const brightness=.45+.75*(.5+.5*Math.cos(2*Math.PI*(finite(time,0)/.65-i*.22)));
            return <rect key={i} data-usage-bar x="3" y={3+i*(barHeight+gap)} width={w} height={barHeight} rx="1" fill={ink} opacity={clamp(level*count-(count-1-i))} style={blink?{filter:`brightness(${brightness.toFixed(4)})`}:undefined}/>;
          })}
        </svg>;
      })}
    </div>
  </div>;
};
