import {during,mix} from './motion';

export type ConstraintSwitchesProps={time:number;startAt?:number;heading?:string;labels?:readonly string[];offLabel?:string};

export const ConstraintSwitches=({time,startAt=0,heading='极简主义先行',labels=['额外的 Skill','非必须的约束'],offLabel='先不加'}:ConstraintSwitchesProps)=>{
  const t=time-startAt;
  return <div data-constraint-switches style={{position:'absolute',left:359,top:180}}>
    <div style={{fontSize:28,fontWeight:800,color:'#292c33',opacity:during(t,2.1,2.6)}}>{heading}</div>
    {labels.map((label,i)=>{
      const start=4.1+i*2.2,enter=during(t,start,start+.4),off=during(t,start+1,start+1.5);
      return <div key={i} data-constraint-switch={i} data-switch-off={off} style={{position:'absolute',left:0,top:54+i*49,width:310,height:36,opacity:enter,transform:`translateY(${mix(7,0,enter)}px)`}}>
        <span style={{position:'relative',display:'inline-block',fontSize:20,fontWeight:700,color:off>.5?'#a3a4aa':'#30333a'}}>{label}<span data-switch-strike style={{position:'absolute',left:0,right:-34,top:'54%',height:1.5,background:'#dc7457',transformOrigin:'left',transform:`scaleX(${off})`}}/></span>
        <div style={{position:'absolute',left:174,top:0,width:64,height:34,borderRadius:20,background:off>.5?'#dadade':'#30343e',boxShadow:'inset 0 0 0 1px #77777713'}}><div data-switch-thumb style={{position:'absolute',left:mix(34,3,off),top:3,width:28,height:28,borderRadius:'50%',background:'#fff',boxShadow:'0 2px 4px #20232b26'}}/></div>
        <span style={{position:'absolute',left:254,top:10,fontSize:11,fontWeight:700,color:'#d47759',opacity:off}}>{offLabel}</span>
      </div>;
    })}
  </div>;
};
