import type {ReactNode} from 'react';
import {during} from './motion';

/** Content-only motion: the surrounding perspective and entry geometry stay untouched. */
export const PanelScroll=({time,children,distance=36}:{time:number;children:ReactNode;distance?:number})=>{
  const safeDistance=Math.max(0,Number.isFinite(distance)?distance:0),offset=safeDistance*during(time,.3,3.8);
  return <div data-panel-scroll style={{position:'relative',width:'100%',height:'100%',overflow:'hidden'}}><div data-panel-scroll-content style={{position:'relative',width:'100%',height:`calc(100% + ${safeDistance}px)`,transform:`translateY(${-offset}px)`}}>{children}</div></div>;
};

export const LiveWaveform=({time,height=104}:{time:number;height?:number})=><svg data-live-waveform width="310" height={height} viewBox="0 0 310 104" preserveAspectRatio="none">
  <line x1="0" x2="310" y1="52" y2="52" stroke="#d7d7d4"/>
  {Array.from({length:155},(_,i)=>{const envelope=(Math.sin(i*.121+time*2)**2*.55+Math.sin(i*.043-time*.7)**8*.45)*Math.sin(Math.PI*i/154),h=4+envelope*91;return <rect data-wave-bar={i} key={i} x={i*2} y={52-h/2} width="1.2" height={h} fill="#35383b"/>;})}
  <line data-wave-playhead x1={310*during(time,0,5)} x2={310*during(time,0,5)} y1="7" y2="97" stroke="#d66c4d" strokeWidth="1.2"/>
</svg>;

export const LiveTimeline=({time}:{time:number})=>{
  const x=12+295*during(time,0,4);
  return <svg data-live-timeline width="320" height="116" viewBox="0 0 320 116"><path d="M12 93C90 93 95 35 160 35S250 93 307 93" fill="none" stroke="#9da3a5" strokeWidth=".8"/><line x1="12" x2="307" y1="94" y2="94" stroke="#686d70"/>{Array.from({length:9},(_,i)=><g key={i}><path d={`M${14+i*36},90l4 4-4 4-4-4Z`} fill={14+i*36<=x?'#e37651':'#3d4146'}/><line x1={14+i*36} x2={14+i*36} y1="94" y2={97+i%3*2} stroke="#51565c" strokeWidth=".7"/></g>)}<line data-timeline-playhead x1={x} x2={x} y1="15" y2="106" stroke="#d66c4d" strokeWidth="1.5"/><circle cx={x} cy="94" r="4" fill="#d66c4d"/></svg>;
};

export const LiveCaptionLines=({time,lines}:{time:number;lines:readonly string[]})=><div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,height:'100%'}}>{lines.map((text,i)=>{
  const progress=during(time,.2+i*.9,2+i*.9);
  return <div key={i} data-live-caption={i} style={{position:'relative',overflow:'hidden',fontSize:16,fontWeight:700,color:'#fff',padding:'7px 12px',borderRadius:3,background:'#303540'}}><div data-caption-highlight style={{position:'absolute',inset:0,background:'#ca6e50',transform:`scaleX(${progress})`,transformOrigin:'0 0'}}/><span style={{position:'relative'}}>{text}</span></div>;
})}</div>;
