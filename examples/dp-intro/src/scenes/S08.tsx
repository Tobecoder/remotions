import {useCurrentFrame} from 'remotion';
import {C,Card,Page,cueFrame,tween} from '../shared';
export default function Recap(){
  const f=useCurrentFrame();
  const questions=[{title:'状态',line:'这个格子表示什么？',hint:'dp[i]：到达第 i 级的走法数',cue:'这个格子'},{title:'关系',line:'答案可以从哪里来？',hint:'最后走 1 级，或最后走 2 级',cue:'更小的问题'},{title:'起点',line:'最小的情况是什么？',hint:'dp[0] = 1，dp[1] = 1',cue:'最开始'}];
  const practice=cueFrame(7,'轮到你');
  const practicing=f>=practice;
  return <Page scene={7} title={practicing?'轮到你：五级楼梯呢？':'初学动态规划，先问三个问题'} subtitle={practicing?'每次仍然走 1 级或 2 级 · 暂停视频，沿着表格继续算':'本题用加法连接前两个状态；其他题，要根据条件找到自己的关系'}>
    {!practicing?questions.map((q,i)=>{
      const start=cueFrame(7,q.cue);
      return <Card key={q.title} style={{position:'absolute',left:100+i*585,top:340,width:550,height:445,padding:40,boxSizing:'border-box',opacity:tween(f,start,start+15),transform:`translateY(${tween(f,start,start+18,20,0)}px)`}}><div style={{fontSize:74,fontWeight:800,color:[C.blue,C.orange,C.green][i],marginBottom:35}}>{q.title}</div><div style={{fontSize:39,fontWeight:700,lineHeight:1.5,marginBottom:26}}>{q.line}</div><div style={{fontSize:29,color:C.muted,lineHeight:1.65}}>{q.hint}</div></Card>;
    }):<>
      <div style={{position:'absolute',left:195,top:355,display:'flex',gap:18}}>{[1,1,2,3,5,null].map((n,i)=><Card key={i} style={{width:240,height:230,textAlign:'center',paddingTop:30,boxSizing:'border-box',borderColor:i===5?C.green:C.line}}><div style={{fontSize:28,color:C.muted,marginBottom:20}}>第 {i} 级</div><div style={{fontSize:90,fontWeight:800,color:i===5?C.green:C.ink}}>{n??'?'}</div></Card>)}</div>
      <div style={{position:'absolute',top:690,width:'100%',textAlign:'center',fontSize:40,color:C.muted}}>想一想：最后一步，分别从哪里来？</div>
    </>}
  </Page>;
}
