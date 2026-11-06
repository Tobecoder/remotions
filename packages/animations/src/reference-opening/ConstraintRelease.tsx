import type {ReactNode} from 'react';
import {during,mix} from './motion';

export type ConstraintReleaseProps={time:number;startAt?:number;content:ReactNode;tags?:readonly string[];badge?:string};

export const ConstraintRelease=({time,startAt=0,content,tags=['必须一步一步 …','禁止使用 …','严格按照模板 …','每一帧都要 …','不允许 …','只能用 …'],badge='惊喜'}:ConstraintReleaseProps)=>{
  const t=time-startAt,enter=during(t,0,.5),reveal=during(t,2.3,2.8),expand=during(t,3.3,3.8);
  const positions=[[170,192,-3],[508,182,4],[173,257,-3],[506,267,2],[173,339,3],[502,349,-2]];
  return <div data-constraint-release style={{position:'absolute',inset:0,isolation:'isolate'}}>
    <div data-release-screen style={{position:'absolute',left:mix(260,222,expand),top:mix(190,170,expand),width:mix(280,356,expand),height:mix(160,202,expand),boxSizing:'border-box',border:'6px solid #24262e',borderRadius:9,background:'#101116',overflow:'hidden',boxShadow:expand>0?'0 10px 25px #dc856644':'0 7px 15px #30343e1c',opacity:enter}}><div style={{width:'100%',height:'100%',opacity:reveal}}>{content}</div></div>
    {tags.map((label,i)=>{
      const [x,y,rotation]=positions[i%positions.length],p=during(t,.05+i*.1,.35+i*.1),drop=during(t,1.4+i*.09,2.1+i*.09);
      return <div key={i} data-release-tag={i} style={{position:'absolute',left:x,top:y,padding:'8px 11px',borderRadius:4,background:'#fff9e9',color:'#53514b',fontSize:12,fontWeight:600,whiteSpace:'nowrap',boxShadow:'0 4px 8px #2d303014',opacity:p*(1-during(drop,.55,1)),transform:`translateY(${drop*drop*220}px) rotate(${rotation+drop*(i%2?35:-35)}deg)`}}>{label}</div>;
    })}
    <div data-release-badge style={{position:'absolute',left:588,top:126,borderRadius:18,padding:'7px 13px',color:'#fff',background:'#dc704d',fontSize:16,fontWeight:700,opacity:expand,transform:`translateY(${mix(7,0,expand)}px)`}}>{badge}</div>
  </div>;
};
