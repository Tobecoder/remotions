import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {UsageComparison} from '../../reference-opening/compositions/UsageComparison';

export type UsageMeterExampleProps={label?:string;peakValue?:number;finalValue?:number};
export const UsageMeterExample=(props:UsageMeterExampleProps)=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
  return <AbsoluteFill style={{background:'#f5f6ef',fontFamily:'"Microsoft YaHei",sans-serif'}}>
    <div style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <UsageComparison {...props} time={frame/fps} content={<div style={{position:'absolute',left:140,top:70,width:115,height:115,borderRadius:22,background:'linear-gradient(135deg,#a9b2ed,#6554c6)',boxShadow:'0 9px 12px #34395722',display:'grid',placeItems:'center',whiteSpace:'nowrap',fontSize:36,fontWeight:800,color:'#fff'}}>›_</div>}/>
    </div>
  </AbsoluteFill>;
};
