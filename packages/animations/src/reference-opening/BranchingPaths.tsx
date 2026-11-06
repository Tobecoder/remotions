import type {ReactNode} from 'react';
import {during,mix} from './motion';

export type PathCard={id:string;content:ReactNode;x:number;y:number;width?:number;height?:number;rotation?:number;selected?:boolean;enterAt?:number};
export type BranchingPathsProps={time:number;startAt?:number;cards:readonly PathCard[];fromLabel?:string;toLabel?:string;stamp?:string;routeLabel?:string;};

/** Several routes converge on a result; cross out a single answer, then emphasize one route. */
export const BranchingPaths=({time,startAt=0,cards,fromLabel='想法',toLabel='成片',stamp='标准答案',routeLabel='我摸索的一条路'}:BranchingPathsProps)=>{
  const t=time-startAt;
  const reveal=during(t,0,.65),highlight=during(t,4.1,4.9);
  const dim=during(t,4.1,4.7),stampIn=during(t,2.3,2.6),strike=during(t,2.85,3.15),stampOut=during(t,3.9,4.3);
  const paths=['M124 294 Q400 114 678 294','M124 294 Q400 244 678 294','M124 294 Q400 474 678 294'];
  return <div data-branching-paths style={{position:'absolute',inset:0}}>
    <svg width="800" height="450" viewBox="0 0 800 450" style={{position:'absolute',inset:0,overflow:'visible'}}>
      {paths.map((path,i)=><path key={path} data-branch-route={i} d={path} pathLength="1" strokeDasharray="1" strokeDashoffset={1-reveal} stroke="#575c60" strokeWidth=".9" fill="none" opacity={mix(.8,.22,dim)}/>)}
      <path data-selected-route d="M124 294 C205 388 287 348 400 294 S580 206 678 294" pathLength="1" strokeDasharray="1" strokeDashoffset={1-highlight} stroke="#d56848" strokeWidth="2" fill="none" opacity={highlight>0?1:0}/>
    </svg>
    {cards.map((card,i)=>{
      const p=during(t,card.enterAt??(.25+i*.12),(card.enterAt??(.25+i*.12))+.45);
      return <div key={card.id} data-path-card={card.id} data-path-selected={Boolean(card.selected)} style={{position:'absolute',left:card.x,top:card.y,width:card.width??90,height:card.height??51,opacity:p*(card.selected?1:mix(1,.2,dim)),transform:`translateY(${mix(10,0,p)}px) scale(${mix(.94,1,p)}) rotate(${card.rotation??0}deg)`,borderRadius:3,padding:2,boxSizing:'border-box',background:'#fff',boxShadow:'0 3px 6px #292c3017'}}>
        <div style={{width:'100%',height:'100%',overflow:'hidden',borderRadius:2}}>{card.content}</div>
        <div data-path-outline style={{position:'absolute',inset:-4,border:'1.5px solid #d56848',borderRadius:6,opacity:card.selected?dim:0}}/>
      </div>;
    })}
    {[{label:fromLabel,x:124,dark:false},{label:toLabel,x:678,dark:true}].map(item=><div key={item.x} data-route-endpoint style={{position:'absolute',left:item.x-29,top:265,width:58,height:58,borderRadius:'50%',background:item.dark?'#2e323d':'#fff',color:item.dark?'#fff':'#303238',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,boxShadow:'0 4px 10px #2a2f3512',opacity:reveal}}>{item.label}</div>)}
    <div data-answer-stamp style={{position:'absolute',left:303,top:277,width:194,height:62,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6,background:'#30343e',color:'#fff',fontSize:24,fontWeight:700,opacity:stampIn*(1-stampOut),transform:`translateY(${mix(9,0,stampIn)}px) scale(${mix(.94,1,stampIn)})`,boxShadow:'0 5px 10px #29303a22'}}>
      {stamp}<div data-answer-strike style={{position:'absolute',left:16,right:16,top:'50%',height:2,background:'#d97053',transformOrigin:'left',transform:`scaleX(${strike})`}}/>
    </div>
    <div data-route-label style={{position:'absolute',left:494,top:127,borderRadius:18,padding:'6px 10px',border:'1px solid #e1d8cc',background:'#fffffff0',fontSize:12,fontWeight:700,color:'#cc6b4b',boxShadow:'0 4px 9px #30343e10',opacity:dim,transform:`translateY(${mix(5,0,dim)}px)`}}>{routeLabel}</div>
  </div>;
};
