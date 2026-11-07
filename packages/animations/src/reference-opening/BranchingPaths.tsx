import {useMemo,type ReactNode} from 'react';
import {clamp,during,mix} from './motion';
import {branchPoint,finiteBranchValue,resolveBranchingGeometry,type BranchPoint,type BranchRoute,type BranchingPathsTiming,type BranchingPathsPositions} from './branching-geometry';
export type {BranchPoint,BranchRoute,BranchingPathsTiming,BranchingPathsPositions} from './branching-geometry';

export type PathCard={id:string;content:ReactNode;x:number;y:number;width?:number;height?:number;rotation?:number;selected?:boolean;enterAt?:number};
export type BranchingPathsProps={time:number;startAt?:number;cards:readonly PathCard[];fromLabel?:string;toLabel?:string;stamp?:string|false;routeLabel?:string|false;resultLabel?:string|false;from?:BranchPoint;to?:BranchPoint;routes?:readonly BranchRoute[];selectedRoute?:string|false;timing?:BranchingPathsTiming;positions?:BranchingPathsPositions};

/** Several routes converge on a result; cross out a single answer, then emphasize one route. */
export const BranchingPaths=({time,startAt=0,cards,fromLabel='想法',toLabel='成片',stamp='标准答案',routeLabel='我摸索的一条路',resultLabel='启发 · 灵感',from,to,routes,selectedRoute,timing,positions}:BranchingPathsProps)=>{
  const t=time-startAt;
  const layout=useMemo(()=>resolveBranchingGeometry({routes,selectedRoute,from,to,cards}),[routes,selectedRoute,from?.x,from?.y,to?.x,to?.y,cards]);
  const selectAt=finiteBranchValue(timing?.selectAt,4.1),selectShift=selectAt-4.1,stampShift=finiteBranchValue(timing?.stampAt,2.3)-2.3;
  const reveal=during(t,0,.65),highlight=layout.selected?during(t,selectAt,4.9+selectShift):0;
  const dim=layout.selected?during(t,selectAt,4.7+selectShift):0,stampIn=during(t,2.3+stampShift,2.6+stampShift),strike=during(t,2.85+stampShift,3.15+stampShift),stampOut=during(t,3.9+stampShift,4.3+stampShift);
  const duration=Math.max(0,finiteBranchValue(timing?.travelDuration,1.9)),travelEnd=timing?.travelDuration===undefined?6+selectShift:selectAt+duration;
  const travel=duration===0?Number(t>=selectAt):clamp((t-selectAt)/duration),easedTravel=duration===0?travel:during(t,selectAt,travelEnd);
  // A gentle speed arc: faster through the middle, softer on the final approach.
  const point=layout.selected?.pointAt(mix(travel,easedTravel,.5))??layout.from,traceOpacity=during(t,selectAt,4.25+selectShift);
  const resultAt=finiteBranchValue(timing?.resultAt,Math.max(4.9+selectShift,travelEnd)+.25),result=during(t,resultAt,resultAt+.4);
  const stampPosition=branchPoint(positions?.stamp??layout.mapPoint({x:303,y:277}),'盖章位置'),routePosition=branchPoint(positions?.routeLabel??layout.mapPoint({x:494,y:127}),'路线标签位置'),resultPosition=branchPoint(positions?.resultLabel??layout.mapPoint({x:628,y:348}),'结果标签位置');
  return <div data-branching-paths style={{position:'absolute',inset:0,isolation:'isolate'}}>
    <svg width="800" height="450" viewBox="0 0 800 450" style={{position:'absolute',inset:0,overflow:'visible',zIndex:0}}>
      {layout.routes.map((route,i)=>{
        const start=finiteBranchValue(route.enterAt,i*.35),drawDuration=Math.max(0,finiteBranchValue(route.duration,.65)),draw=drawDuration===0?Number(t>=start):during(t,start,start+drawDuration);
        return <path key={route.id} data-branch-route={i} d={route.path} pathLength="1" strokeDasharray="1" strokeDashoffset={1-draw} stroke="#575c60" strokeWidth=".9" fill="none" opacity={mix(.8,.22,dim)}/>;
      })}
      {layout.selected&&<path data-selected-route d={layout.selected.path} pathLength="1" strokeDasharray="1" strokeDashoffset={1-highlight} stroke="#d56848" strokeWidth="2" fill="none" opacity={highlight>0?1:0}/>}
    </svg>
    {cards.map((card,i)=>{
      const p=during(t,card.enterAt??(.25+i*.12),(card.enterAt??(.25+i*.12))+.45);
      const selected=layout.selected?.cardIds.has(card.id)??false;
      return <div key={card.id} data-path-card={card.id} data-path-selected={selected} style={{position:'absolute',left:card.x,top:card.y,width:card.width??90,height:card.height??51,opacity:p*(selected?1:mix(1,.2,dim)),transform:`translateY(${mix(10,0,p)}px) scale(${mix(.94,1,p)}) rotate(${card.rotation??0}deg)`,borderRadius:3,padding:2,boxSizing:'border-box',background:'#fff',boxShadow:'0 3px 6px #292c3017',zIndex:selected&&dim>0?2:1}}>
        <div style={{width:'100%',height:'100%',overflow:'hidden',borderRadius:2}}>{card.content}</div>
        <div data-path-outline style={{position:'absolute',inset:-4,border:'1.5px solid #d56848',borderRadius:6,opacity:selected?dim:0}}/>
      </div>;
    })}
    {[{label:fromLabel,point:layout.from,dark:false},{label:toLabel,point:layout.to,dark:true}].map((item,index)=><div key={index} data-route-endpoint style={{position:'absolute',left:item.point.x-29,top:item.point.y-29,width:58,height:58,borderRadius:'50%',background:item.dark?'#2e323d':'#fff',color:item.dark?'#fff':'#303238',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,boxShadow:'0 4px 10px #2a2f3512',opacity:reveal,zIndex:3}}>{item.label}</div>)}
    {layout.routes.length>0&&stamp!==false&&stamp!==''&&<div data-answer-stamp style={{position:'absolute',left:stampPosition.x,top:stampPosition.y,width:194,height:62,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6,background:'#30343e',color:'#fff',fontSize:24,fontWeight:700,opacity:stampIn*(1-stampOut),transform:`translateY(${mix(9,0,stampIn)}px) scale(${mix(.94,1,stampIn)})`,boxShadow:'0 5px 10px #29303a22',zIndex:3}}>
      {stamp}<div data-answer-strike style={{position:'absolute',left:16,right:16,top:'50%',height:2,background:'#d97053',transformOrigin:'left',transform:`scaleX(${strike})`}}/>
    </div>}
    {layout.selected&&routeLabel!==false&&routeLabel!==''&&<div data-route-label style={{position:'absolute',left:routePosition.x,top:routePosition.y,borderRadius:18,padding:'6px 10px',border:'1px solid #e1d8cc',background:'#fffffff0',fontSize:12,fontWeight:700,color:'#cc6b4b',boxShadow:'0 4px 9px #30343e10',opacity:dim,transform:`translateY(${mix(5,0,dim)}px)`,zIndex:3}}>{routeLabel}</div>}
    {layout.selected&&<svg data-route-tracer width="800" height="450" viewBox="0 0 800 450" style={{position:'absolute',inset:0,overflow:'visible',opacity:traceOpacity,zIndex:4}} aria-hidden="true"><circle cx={point.x} cy={point.y} r="11" fill="#de704d" opacity=".14"/><circle data-route-dot cx={point.x} cy={point.y} r="6" fill="#df704b" stroke="#efae85" strokeWidth="2"/></svg>}
    {layout.selected&&resultLabel!==false&&resultLabel!==''&&<div data-route-result style={{position:'absolute',left:resultPosition.x,top:resultPosition.y,padding:'5px 10px',borderRadius:18,background:'#da704e',color:'#fff',fontSize:12,fontWeight:700,boxShadow:'0 3px 7px #d16b4c44',opacity:result,transform:`translateY(${mix(5,0,result)}px)`,zIndex:3}}>{resultLabel}</div>}
  </div>;
};
