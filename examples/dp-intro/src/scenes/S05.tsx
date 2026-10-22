import {useCurrentFrame} from 'remotion';
import {C,Card,MONO,Page,cueFrame,tween} from '../shared';
export default function Bases(){
  const f=useCurrentFrame();
  const zero=cueFrame(4,'第零级');
  const empty=cueFrame(4,'原地不动');
  const zeroValue=cueFrame(4,'dp[0]');
  const one=cueFrame(4,'第一级');
  const oneValue=cueFrame(4,'dp[1]');
  return <Page scene={4} title="计算，总得有一个起点" subtitle="初始条件 · 先把最小的情况想清楚">
    {[0,1].map(i=><Card key={i} style={{position:'absolute',left:100+i*890,top:290,width:830,height:570,padding:42,boxSizing:'border-box',opacity:tween(f,i?one:zero,(i?one:zero)+15)}}>
      <div style={{fontSize:38,color:C.muted}}>第 {i} 级</div>
      <svg width="746" height="270" viewBox="0 0 746 270" style={{marginTop:12}}>
        <path d={i?'M150 215 H360 V110 H650':'M100 215 H650'} fill="none" stroke="#a8b8ca" strokeWidth="5"/>
        {i===1&&<path d="M200 175 Q340 -20 500 70" fill="none" stroke={C.blue} strokeWidth="7" pathLength="1" strokeDasharray="1" strokeDashoffset={1-tween(f,one+15,one+45)}/>}
        <circle cx={i?500:330} cy={i?75:180} r="25" fill={C.blue}/>
        <text x="373" y="264" textAnchor="middle" fontSize="32" fill={C.muted}>{i?'只能走一级':'站在原地，空走法也算一种'}</text>
      </svg>
      <div style={{fontFamily:MONO,fontSize:88,fontWeight:800,color:C.green,marginTop:35,textAlign:'center',opacity:tween(f,i?oneValue:zeroValue,(i?oneValue:zeroValue)+12)}}>dp[{i}] = 1</div>
    </Card>)}
  </Page>;
}
