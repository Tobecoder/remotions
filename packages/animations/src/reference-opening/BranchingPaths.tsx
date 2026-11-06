import type {ReactNode} from 'react';
import {clamp,during,mix} from './motion';

export type PathCard={id:string;content:ReactNode;x:number;y:number;width?:number;height?:number;rotation?:number;selected?:boolean;enterAt?:number};
export type BranchingPathsProps={time:number;startAt?:number;cards:readonly PathCard[];fromLabel?:string;toLabel?:string;stamp?:string;routeLabel?:string;resultLabel?:string;};

const cubic=(a:number,b:number,c:number,d:number,p:number)=>(1-p)**3*a+3*(1-p)**2*p*b+3*(1-p)*p*p*c+p**3*d;
const routePoint=(progress:number)=>{
  const p=clamp(progress)*2;
  return p<=1?{x:cubic(124,205,287,400,p),y:cubic(294,388,348,294,p)}:{x:cubic(400,513,580,678,p-1),y:cubic(294,240,206,294,p-1)};
};

/** Several routes converge on a result; cross out a single answer, then emphasize one route. */
export const BranchingPaths=({time,startAt=0,cards,fromLabel='想法',toLabel='成片',stamp='标准答案',routeLabel='我摸索的一条路',resultLabel='启发 · 灵感'}:BranchingPathsProps)=>{
  const t=time-startAt;
  const reveal=during(t,0,.65),highlight=during(t,4.1,4.9);
  const dim=during(t,4.1,4.7),stampIn=during(t,2.3,2.6),strike=during(t,2.85,3.15),stampOut=during(t,3.9,4.3);
  const paths=['M124 294 Q400 114 678 294','M124 294 Q400 244 678 294','M124 294 Q400 474 678 294'];
  // Alternate upper → lower → middle, keeping each stroke's original drawing speed.
  const routeStarts=[0,.7,.35];
  const point=routePoint((t-4.1)/1.9),traceOpacity=during(t,4.1,4.25),result=during(t,6.25,6.65);
  return <div data-branching-paths style={{position:'absolute',inset:0,isolation:'isolate'}}>
    <svg width="800" height="450" viewBox="0 0 800 450" style={{position:'absolute',inset:0,overflow:'visible',zIndex:0}}>
      {paths.map((path,i)=><path key={path} data-branch-route={i} d={path} pathLength="1" strokeDasharray="1" strokeDashoffset={1-during(t,routeStarts[i],routeStarts[i]+.65)} stroke="#575c60" strokeWidth=".9" fill="none" opacity={mix(.8,.22,dim)}/>)}
      <path data-selected-route d="M124 294 C205 388 287 348 400 294 S580 206 678 294" pathLength="1" strokeDasharray="1" strokeDashoffset={1-highlight} stroke="#d56848" strokeWidth="2" fill="none" opacity={highlight>0?1:0}/>
    </svg>
    {cards.map((card,i)=>{
      const p=during(t,card.enterAt??(.25+i*.12),(card.enterAt??(.25+i*.12))+.45);
      return <div key={card.id} data-path-card={card.id} data-path-selected={Boolean(card.selected)} style={{position:'absolute',left:card.x,top:card.y,width:card.width??90,height:card.height??51,opacity:p*(card.selected?1:mix(1,.2,dim)),transform:`translateY(${mix(10,0,p)}px) scale(${mix(.94,1,p)}) rotate(${card.rotation??0}deg)`,borderRadius:3,padding:2,boxSizing:'border-box',background:'#fff',boxShadow:'0 3px 6px #292c3017',zIndex:card.selected&&dim>0?2:1}}>
        <div style={{width:'100%',height:'100%',overflow:'hidden',borderRadius:2}}>{card.content}</div>
        <div data-path-outline style={{position:'absolute',inset:-4,border:'1.5px solid #d56848',borderRadius:6,opacity:card.selected?dim:0}}/>
      </div>;
    })}
    {[{label:fromLabel,x:124,dark:false},{label:toLabel,x:678,dark:true}].map(item=><div key={item.x} data-route-endpoint style={{position:'absolute',left:item.x-29,top:265,width:58,height:58,borderRadius:'50%',background:item.dark?'#2e323d':'#fff',color:item.dark?'#fff':'#303238',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,boxShadow:'0 4px 10px #2a2f3512',opacity:reveal,zIndex:3}}>{item.label}</div>)}
    <div data-answer-stamp style={{position:'absolute',left:303,top:277,width:194,height:62,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6,background:'#30343e',color:'#fff',fontSize:24,fontWeight:700,opacity:stampIn*(1-stampOut),transform:`translateY(${mix(9,0,stampIn)}px) scale(${mix(.94,1,stampIn)})`,boxShadow:'0 5px 10px #29303a22',zIndex:3}}>
      {stamp}<div data-answer-strike style={{position:'absolute',left:16,right:16,top:'50%',height:2,background:'#d97053',transformOrigin:'left',transform:`scaleX(${strike})`}}/>
    </div>
    <div data-route-label style={{position:'absolute',left:494,top:127,borderRadius:18,padding:'6px 10px',border:'1px solid #e1d8cc',background:'#fffffff0',fontSize:12,fontWeight:700,color:'#cc6b4b',boxShadow:'0 4px 9px #30343e10',opacity:dim,transform:`translateY(${mix(5,0,dim)}px)`,zIndex:3}}>{routeLabel}</div>
    <svg data-route-tracer width="800" height="450" viewBox="0 0 800 450" style={{position:'absolute',inset:0,overflow:'visible',opacity:traceOpacity,zIndex:4}} aria-hidden="true"><circle cx={point.x} cy={point.y} r="11" fill="#de704d" opacity=".14"/><circle data-route-dot cx={point.x} cy={point.y} r="6" fill="#df704b" stroke="#efae85" strokeWidth="2"/></svg>
    <div data-route-result style={{position:'absolute',left:628,top:348,padding:'5px 10px',borderRadius:18,background:'#da704e',color:'#fff',fontSize:12,fontWeight:700,boxShadow:'0 3px 7px #d16b4c44',opacity:result,transform:`translateY(${mix(5,0,result)}px)`,zIndex:3}}>{resultLabel}</div>
  </div>;
};
