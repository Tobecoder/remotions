import {useCurrentFrame} from 'remotion';
import {C,Card,MONO,Page,cueFrame,tween} from '../shared';
export default function State(){
  const f=useCurrentFrame();
  const define=cueFrame(3,'记作');
  const formula=cueFrame(3,'关系写成公式');
  const show=tween(f,formula,formula+22);
  return <Page scene={3} title="先定义状态，再写递推关系" subtitle="一个格子，只记录一个明确的问题的答案">
    <Card style={{position:'absolute',left:100,top:290,width:1720,height:210,display:'flex',alignItems:'center',padding:'0 70px',gap:70,boxSizing:'border-box'}}>
      <strong style={{fontSize:110,fontFamily:MONO,color:C.green,opacity:tween(f,define,define+14)}}>dp[i]</strong>
      <span style={{fontSize:48,lineHeight:1.5}}>到达<strong style={{color:C.green}}>第 i 级</strong>楼梯的<br/>不同走法数量</span>
    </Card>
    <div style={{opacity:show}}>
      <div style={{position:'absolute',left:110,top:550,fontSize:33,color:C.muted}}>把刚才的 3 + 2，写成一般关系</div>
      {[{x:100,w:450,text:'dp[i-1]',label:'从前一级过来',color:C.blue},{x:690,w:450,text:'dp[i-2]',label:'从前两级过来',color:C.orange},{x:1330,w:490,text:'dp[i]',label:'到达当前级的走法',color:C.green}].map(v=><Card key={v.text} style={{position:'absolute',left:v.x,top:622,width:v.w,height:210,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:22,borderColor:v.color}}><strong style={{fontFamily:MONO,fontSize:75,color:v.color}}>{v.text}</strong><span style={{fontSize:30,color:C.muted}}>{v.label}</span></Card>)}
      <span style={{position:'absolute',left:585,top:675,fontSize:90}}>+</span><span style={{position:'absolute',left:1200,top:675,fontSize:90}}>=</span>
    </div>
  </Page>;
}
