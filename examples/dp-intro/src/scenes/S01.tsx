import {useCurrentFrame} from 'remotion';
import {Card,C,Page,Staircase,cueFrame,tween,walker} from '../shared';

export default function Intro(){
  const f=useCurrentFrame();
  const start=cueFrame(0,'每次只能');
  const a=tween(f,start+4,start+27);
  const b=tween(f,start+40,start+66);
  const mark=b>0?walker(1,3,b):walker(0,1,a);
  return <Page scene={0} title="动态规划，从一道小题开始" subtitle="每次走 1 级或 2 级 · 到达第 4 级，共有几种走法？">
    <Staircase mark={mark} highlight={[4]} paths={[{from:0,to:1,color:C.blue,progress:a},{from:1,to:3,color:C.orange,progress:b}]}/>
    <Card style={{position:'absolute',left:1340,top:325,width:440,padding:45,boxSizing:'border-box'}}>
      <div style={{fontSize:30,color:C.muted,marginBottom:32}}>只有两种动作</div>
      <div style={{fontSize:54,fontWeight:800,color:C.blue,marginBottom:32}}>走 1 级 <span style={{float:'right'}}>↗</span></div>
      <div style={{fontSize:54,fontWeight:800,color:C.orange}}>走 2 级 <span style={{float:'right'}}>⤴</span></div>
      <div style={{marginTop:40,paddingTop:32,borderTop:`1px solid ${C.line}`,fontSize:42,fontWeight:700}}>走法数 = <span style={{color:C.green}}>?</span></div>
    </Card>
  </Page>;
}
