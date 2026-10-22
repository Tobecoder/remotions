import {useCurrentFrame} from 'remotion';
import {C,Card,MONO,Page,cueFrame,tween} from '../shared';
import facts from '../../assets/lesson-data.json';
export default function Code(){
  const f=useCurrentFrame();
  const begin=cueFrame(6,'对应到代码');
  const init=cueFrame(6,'填好初始值');
  const loop=cueFrame(6,'用一个循环');
  const row=f<init?0:f<loop?2:4;
  const i=f<loop?2:Math.min(4,2+Math.floor((f-loop)/45));
  return <Page scene={6} title="把刚才的过程，写进一个循环" subtitle="已经算出的答案，保存在数组里，后面直接复用">
    {f<begin && <div style={{position:'absolute',left:100,top:330,width:1080}}>
      {[{text:'解决小问题',detail:'先算出第 2 级的走法',cue:'先解决小问题',color:C.blue},{text:'存下答案',detail:'把 2 写进 dp[2]',cue:'存下答案',color:C.orange},{text:'复用旧答案',detail:'继续算出第 3、4 级',cue:'再用这些答案',color:C.green}].map((step,index)=><Card key={step.text} style={{height:145,marginBottom:25,display:'flex',alignItems:'center',padding:'0 35px',gap:30,opacity:tween(f,cueFrame(6,step.cue),cueFrame(6,step.cue)+12)}}><span style={{fontSize:40,color:step.color,fontFamily:MONO}}>0{index+1}</span><strong style={{fontSize:44,color:step.color}}>{step.text}</strong><span style={{fontSize:29,color:C.muted,marginLeft:'auto'}}>{step.detail}</span></Card>)}
    </div>}
    <Card style={{position:'absolute',left:100,top:285,width:1080,height:555,padding:'42px 35px',boxSizing:'border-box',opacity:tween(f,begin,begin+15)}}>
      {facts.code.map((line,index)=><div key={index} style={{display:'flex',alignItems:'center',height:65,borderRadius:12,background:row===index?'#e7eefc':'transparent',fontSize:34,fontFamily:MONO,whiteSpace:'pre'}}><span style={{color:'#a4afbf',width:65,textAlign:'center',fontSize:26}}>{index+1}</span><span style={{color:row===index?C.blue:C.ink}}>{line}</span></div>)}
    </Card>
    <div style={{position:'absolute',left:1250,top:340,width:550}}>
      <div style={{fontSize:40,fontWeight:700,marginBottom:35}}>读两个旧答案</div>
      <div style={{display:'flex',gap:20}}>{[i-1,i-2].map((v,index)=><Card key={v} style={{width:245,height:170,textAlign:'center',paddingTop:23}}><div style={{fontFamily:MONO,fontSize:32,color:index?C.orange:C.blue}}>dp[{v}]</div><div style={{fontFamily:MONO,fontSize:72,fontWeight:800,color:index?C.orange:C.blue}}>{[1,1,2,3,5][v]}</div></Card>)}</div>
      <div style={{fontSize:46,margin:'24px 0',textAlign:'center',color:C.muted}}>↓ 相加后写入 ↓</div>
      <Card style={{height:150,display:'flex',alignItems:'center',justifyContent:'center',gap:28,borderColor:C.green}}><span style={{fontFamily:MONO,fontSize:44}}>dp[{i}]</span><strong style={{fontSize:78,color:C.green}}>{[2,3,5][i-2]}</strong></Card>
    </div>
  </Page>;
}
