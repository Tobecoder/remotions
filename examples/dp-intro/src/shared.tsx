import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BasicCaptions} from '../../../packages/animations/src';
import timing from '../timing.json';

export {timing};
export const C = {paper:'#f6f5f0', ink:'#18243b', muted:'#748095', line:'#dce2e8', blue:'#3167e3', orange:'#dd8b35', green:'#248469', white:'#ffffff'};
export const FONT = '"Microsoft YaHei", "PingFang SC", Arial, sans-serif';
export const MONO = 'Consolas, "Cascadia Code", monospace';
const options = {extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const tween = (frame:number, from:number, to:number, a=0, b=1) => interpolate(frame,[from,Math.max(from+.001,to)],[a,b],{...options,easing:Easing.bezier(.22,1,.36,1)});
export const cueFrame = (scene:number, needle:string, occurrence=0, characterOffset=0) => {
  const cue = timing.cues.filter(c => c.scene===scene && c.text.includes(needle))[occurrence];
  if (!cue) throw new Error(`Missing narration anchor: ${scene}/${needle}`);
  const position = cue.spoken.indexOf(needle);
  const pos = position < 0 ? -1 : position + characterOffset;
  const mark = pos<0 ? undefined : timing.wordMarks.find(m=>m.cue===cue.id && m.characterPosition+m.characterCount>pos);
  return Math.round((mark?.audioSeconds ?? cue.start)*30)-timing.scenes[scene].startFrame;
};
export const Page = ({title, subtitle, children, scene}:{title:string;subtitle:string;children:ReactNode;scene:number}) => {
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{backgroundColor:C.paper,color:C.ink,fontFamily:FONT,overflow:'hidden'}}>
    <div data-layout-check="title" style={{position:'absolute',top:70,left:96,fontWeight:800,fontSize:84,letterSpacing:-2,opacity:tween(frame,0,12),transform:`translateY(${tween(frame,0,14,14,0)}px)`}}>{title}</div>
    <div data-layout-check="subtitle" style={{position:'absolute',top:187,left:100,fontSize:34,color:C.muted,opacity:tween(frame,8,22)}}>{subtitle}</div>
    <div style={{position:'absolute',right:100,top:91,fontSize:28,color:C.muted,fontFamily:MONO}}>{String(scene+1).padStart(2,'0')} / 08</div>
    {children}
  </AbsoluteFill>;
};
export const CaptionTrack = ({offsetFrame=0}:{offsetFrame?:number}) => {
  const captions=timing.cues.map(c=>({text:c.text,startMs:c.start*1000-offsetFrame/30*1000,endMs:c.end*1000-offsetFrame/30*1000,timestampMs:(c.start+c.end)*500-offsetFrame/30*1000,confidence:null}));
  return <div style={{position:'absolute',left:100,bottom:25,width:1720,height:130,borderTop:`1px solid ${C.line}`}}>
    <BasicCaptions captions={captions} width={1720} height={120} color={C.ink} secondaryColor={C.paper} backgroundColor="transparent" fontFamily={FONT} fontSize={46}/>
  </div>;
};
export const Card = ({children,style}:{children:ReactNode;style?:CSSProperties}) => <div style={{backgroundColor:C.white,border:`1px solid ${C.line}`,borderRadius:28,boxShadow:'0 8px 25px #18243b05',...style}}>{children}</div>;
export const point = (level:number) => ({x:140+level*220,y:680-level*105});
export const jumpPath = (from:number,to:number) => {
  const a=point(from),b=point(to);
  return `M ${a.x} ${a.y-35} Q ${(a.x+b.x)/2} ${Math.min(a.y,b.y)-125} ${b.x} ${b.y-35}`;
};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const walker = (from:number,to:number,progress:number) => {
  const a=point(from),b=point(to);
  return {x:mix(a.x,b.x,progress),y:mix(a.y,b.y,progress)-40-Math.sin(progress*Math.PI)*75};
};
export const Staircase = ({level=0,mark,paths=[],highlight=[],style}:{level?:number;mark?:{x:number;y:number};paths?:{from:number;to:number;color:string;progress?:number;dashed?:boolean}[];highlight?:number[];style?:CSSProperties}) => {
  const p=point(level);
  return <svg data-layout-check="stairs" width="1240" height="760" viewBox="0 0 1240 760" style={{position:'absolute',left:100,top:230,width:1160,height:650,overflow:'visible',fontFamily:FONT,...style}}>
    <line x1="80" y1="680" x2="250" y2="680" stroke={C.line} strokeWidth="3"/>
    {[1,2,3,4].map(i=>{
      const q=point(i);
      return <g key={i}>
        <path d={`M ${q.x-110} ${q.y} H ${q.x+110} V 740 H ${q.x-110} Z`} fill={highlight.includes(i)?'#e7eefc':'#e9edf0'} stroke={C.paper} strokeWidth="5"/>
        <line x1={q.x-110} y1={q.y} x2={q.x+110} y2={q.y} stroke={highlight.includes(i)?C.blue:'#a8b8ca'} strokeWidth="5"/>
        <text x={q.x} y={q.y+62} fill={highlight.includes(i)?C.blue:C.muted} fontSize="48" fontWeight="700" textAnchor="middle">{i}</text>
      </g>;
    })}
    <text x="140" y="730" fontSize="32" textAnchor="middle" fill={C.muted}>起点 0</text>
    {paths.map((path,i)=><path key={i} d={jumpPath(path.from,path.to)} fill="none" stroke={path.color} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray={path.dashed?'0.025 0.025':1} strokeDashoffset={path.dashed?0:1-(path.progress??1)}/>)}
    <g transform={`translate(${mark?.x??p.x} ${mark?.y??p.y-40})`}>
      <ellipse cx="0" cy="39" rx="21" ry="5" fill="#18243b12"/>
      <circle r="24" fill={C.blue} stroke="white" strokeWidth="6"/>
      <circle cx="-7" cy="-3" r="3" fill="white"/><circle cx="7" cy="-3" r="3" fill="white"/>
      <path d="M -6 7 Q 0 12 6 7" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </g>
  </svg>;
};

export const DpTable = ({values,active,inputs=[],style}:{values:(number|null)[];active?:number;inputs?:number[];style?:CSSProperties}) => <div data-layout-check="dp-table" style={{display:'flex',gap:16,...style}}>
  {values.map((v,i)=><div key={i} style={{width:230,textAlign:'center'}}>
    <div style={{fontSize:30,color:C.muted,fontFamily:MONO,marginBottom:16}}>dp[{i}]</div>
    <div data-dp-value={i} style={{height:160,display:'grid',placeItems:'center',borderRadius:24,fontSize:86,fontWeight:800,fontFamily:MONO,backgroundColor:active===i?'#e6f3ed':inputs.includes(i)?(i===inputs[0]?'#e7eefc':'#fcf0df'):'white',color:active===i?C.green:inputs.includes(i)?(i===inputs[0]?C.blue:C.orange):C.ink,border:`3px solid ${active===i?C.green:inputs.includes(i)?(i===inputs[0]?C.blue:C.orange):C.line}`}}>{v??<span style={{color:'#cad2dc'}}>?</span>}</div>
    <div style={{fontSize:26,color:C.muted,marginTop:15}}>第 {i} 级</div>
  </div>)}
</div>;
