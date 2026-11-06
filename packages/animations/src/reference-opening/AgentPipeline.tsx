import type {ReactNode} from 'react';
import {during,mix} from './motion';

export type AgentPipelineProps={time:number;startAt?:number;output:ReactNode;agentLabel?:string;toolLabel?:string};

export const AgentPipeline=({time,startAt=0,output,agentLabel='Agent',toolLabel='Remotion'}:AgentPipelineProps)=>{
  const t=time-startAt,enter=during(t,0,.45),result=during(t,.95,1.4);
  return <div data-agent-pipeline style={{position:'absolute',inset:0}}>
    <svg width="800" height="450" style={{position:'absolute',inset:0}}><path data-agent-connector d="M379 251H448" pathLength="1" stroke="#ae7963" strokeWidth="1.2" strokeDasharray="1 4" opacity={during(t,.85,1.15)}/></svg>
    <div data-agent-tile style={{position:'absolute',left:253,top:205,width:126,height:92,borderRadius:16,background:'linear-gradient(135deg,#363943,#171a22)',boxShadow:'0 8px 18px #282d352b, inset 0 1px 1px #ffffff18',opacity:enter,transform:`scale(${mix(.72,1,enter)})`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:'monospace',fontWeight:800,fontSize:37,lineHeight:'43px',color:'#fff'}}>&gt;<span style={{color:'#ddd'}}>_</span><span style={{color:'#cf7454',fontWeight:400}}>|</span></div>
      <div style={{fontSize:13,fontWeight:700,color:'#fff',marginTop:5}}>{agentLabel}</div>
    </div>
    <div data-agent-tool style={{position:'absolute',left:380,top:215,fontSize:13,fontWeight:800,color:'#292d33',opacity:during(t,.8,1.15)}}>{toolLabel}</div>
    <div data-agent-output style={{position:'absolute',left:448,top:182,width:250,height:140,boxSizing:'border-box',background:'#fff',border:'4px solid #2b2c35',borderRadius:8,boxShadow:'0 5px 10px #34363814',overflow:'hidden',opacity:result,transform:`translateX(${mix(-25,0,result)}px) scale(${mix(.92,1,result)})`,transformOrigin:'0 50%'}}>{output}</div>
  </div>;
};
