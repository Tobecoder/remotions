import type {ReactNode} from 'react';
import {CardEntrance} from '../../../packages/animations/src';
import {during,mix} from '../../../packages/animations/src/reference-opening/motion';

export const modelComparisonClipOffset=19/30;

const models=[
  {name:'Claude',color:'#af583b',at:1.58,x:54,width:59},
  {name:'Codex',color:'#323741',at:2.67,x:119,width:56},
  {name:'DeepSeek',color:'#3d53a5',at:3.6,x:181,width:77},
] as const;

/** The script-to-result layout. The caller supplies the independently rendered excerpt. */
export const ModelComparisonPanel=({time,children}:{time:number;children:ReactNode})=>{
  const enter=during(time,modelComparisonClipOffset,.79);
  const connector=during(time,.65,.83);
  return <div data-model-comparison style={{position:'absolute',inset:0}}>
    <svg width={57} height={7} viewBox="0 0 57 7" style={{position:'absolute',left:385,top:192}} aria-hidden>
      <path d={`M2 3.5H${mix(2,49,connector)}`} stroke="#bd735e" strokeDasharray="1.2 3.2" strokeLinecap="round" opacity={connector}/>
    </svg>
    <CardEntrance data-model-comparison-window progress={enter} x={444} y={124} width={320} height={180} offset={{x:0,y:0}} background="#252730" borderRadius={9} boxShadow="0 7px 15px #24263120" style={{padding:6,boxSizing:'border-box'}}>
      <div style={{width:'100%',height:'100%',overflow:'hidden',borderRadius:4}}>
        {children}
      </div>
    </CardEntrance>
    <div style={{position:'absolute',left:444,top:318,fontSize:9,letterSpacing:1.2,color:'#858289',opacity:during(time,1.03,1.25)}}>做出来的动画</div>
    {models.map(({name,color,at,x,width})=>{
      const opacity=during(time,at,at+.17);
      return <div key={name} data-comparison-model={name} style={{
        position:'absolute',left:x,top:283,width,height:24,boxSizing:'border-box',
        display:'grid',placeItems:'center',border:`1px solid ${color}38`,borderRadius:14,
        background:'#fffdf9',color,fontSize:12,fontWeight:700,opacity,
      }}>{name}</div>;
    })}
  </div>;
};
