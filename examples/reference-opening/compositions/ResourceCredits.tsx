import type {ReactNode} from 'react';
import {CardEntrance,TokenBowl} from '../../../packages/animations/src';
import {clamp,during} from '../../../packages/animations/src/reference-opening/motion';

export type ResourceCreditsCopy={eyebrow:string;title:string;platform:string;description:string;dailyLabel:string;dailyValue:string;costLabel:string;costValue:string;changedLabel:string};
export const defaultResourceCopy:ResourceCreditsCopy={eyebrow:'把可用资源收集起来',title:'积累资源，做点小作品',platform:'示例平台',description:'一段历史额度示意',dailyLabel:'每天领取',dailyValue:'10 积分',costLabel:'一条 10 秒视频',costValue:'只花 2 积分',changedLabel:'额度规则已经变化'};
export type ResourceCreditsProps={time:number;startAt?:number;copy?:Partial<ResourceCreditsCopy>;icon?:ReactNode;count?:number};
export const ResourceCredits=({time,startAt=0,copy:overrides,icon,count=20}:ResourceCreditsProps)=>{
 const f=Math.round((time-startAt)*30),c={...defaultResourceCopy,...overrides},strike=during(f,263,270);
 return <div data-resource-credits style={{position:'absolute',inset:0,color:'#292b34'}}>
  <div style={{position:'absolute',left:47,top:108,opacity:during(f,9,17)}}><div style={{fontSize:16,fontWeight:800,color:'#95979d',marginBottom:5}}>{c.eyebrow}</div><div style={{fontSize:29,fontWeight:800}}>{c.title}</div></div>
  <div data-resource-bowl style={{position:'absolute',inset:0,opacity:during(f,36,45)}}><TokenBowl time={time} startAt={startAt+1.4} count={count} x={76} y={153} width={280}/></div>
  <CardEntrance data-resource-card progress={during(f,99,109)} x={434} y={107} width={286} height={188+26*strike} offset={{x:0,y:8}} borderRadius={15} background="#ffffffed" boxShadow="0 8px 13px #30343e1b" style={{boxSizing:'border-box',lineHeight:'18px'}}>
   <div data-resource-header style={{position:'absolute',left:24,right:17,top:18,display:'flex',alignItems:'center',gap:14,height:40}}><div style={{width:23,height:23,flexShrink:0}}>{icon??<div style={{height:'100%',borderRadius:6,background:'#4c60dd',color:'white',display:'grid',placeItems:'center',fontSize:14}}>✦</div>}</div><div><div style={{fontSize:21,fontWeight:800,lineHeight:'25px'}}>{c.platform}</div><div style={{fontSize:10,lineHeight:'15px',color:'#95979b',marginTop:3}}>{c.description}</div></div></div>
   <div style={{position:'absolute',left:17,right:17,top:68,height:1,background:'#c8c8c3',opacity:during(f,159,165)}}/>
   <div style={{position:'absolute',left:17,right:17,top:121,height:1,background:'#e7e7e2',opacity:during(f,198,204)}}/>
   {[[c.dailyLabel,c.dailyValue,159],[c.costLabel,c.costValue,198]].map(([label,value,at],i)=><div key={i} data-resource-row={i} style={{position:'absolute',left:17,right:17,top:80+i*52,display:'flex',justifyContent:'space-between',alignItems:'center',height:38,opacity:during(f,Number(at),Number(at)+6)}}><span style={{fontSize:12,lineHeight:'18px'}}>{label}</span><span style={{fontSize:21,lineHeight:'28px',fontWeight:800,position:'relative',transform:'translateY(-3px)',color:strike===1?'#96999b':undefined}}>{value}<span data-resource-strike={i} style={{position:'absolute',left:-2,right:-2,top:'53%',height:1.5,background:'#d36b50',transformOrigin:'0 0',transform:`scaleX(${strike})`}}/></span></div>)}
   <div data-resource-changed style={{position:'absolute',left:17,top:173,fontSize:12,lineHeight:'18px',color:'#b95360',fontWeight:700,padding:'3px 8px',background:'white',border:'1px solid #ead9da',borderRadius:12,opacity:during(f,266,270),transformOrigin:'left center',transform:`scale(${.9+.1*clamp(strike)})`}}>{c.changedLabel}</div>
  </CardEntrance>
 </div>;
};
