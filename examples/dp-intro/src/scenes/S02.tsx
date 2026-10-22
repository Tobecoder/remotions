import {useCurrentFrame} from 'remotion';
import {NumberCounter} from '../../../../packages/animations/src';
import {C,Card,Page,cueFrame,tween} from '../shared';
const ways=[[1,1,1,1],[1,1,2],[1,2,1],[2,1,1],[2,2]];
export default function Enumerate(){
  const f=useCurrentFrame();
  const mixed=cueFrame(1,'把一次两步');
  const starts=[cueFrame(1,'四次一步'),mixed,mixed+28,mixed+56,cueFrame(1,'两次两步')];
  const count=starts.filter(v=>f>=v).length;
  return <Page scene={1} title="四级楼梯，确实有五种走法" subtitle="同样走了四级，先后顺序不同，也算不同走法">
    {ways.map((way,i)=><Card key={i} style={{position:'absolute',left:100,top:278+i*112,width:1130,height:96,display:'flex',alignItems:'center',gap:25,padding:'0 30px',boxSizing:'border-box',opacity:tween(f,starts[i],starts[i]+12),transform:`translateX(${tween(f,starts[i],starts[i]+18,30,0)}px)`}}>
      <div style={{fontSize:30,color:C.muted,width:50}}>0{i+1}</div>
      {way.map((step,j)=><div key={j} style={{display:'flex',alignItems:'center',gap:22}}><span style={{width:64,height:64,borderRadius:16,display:'grid',placeItems:'center',fontSize:42,fontWeight:800,color:step===1?C.blue:C.orange,background:step===1?'#e7eefc':'#fcf0df'}}>{step}</span>{j<way.length-1&&<span style={{fontSize:35,color:'#a5afbd'}}>→</span>}</div>)}
      <div style={{marginLeft:'auto',fontSize:40,color:C.green}}>✓</div>
    </Card>)}
    <Card style={{position:'absolute',left:1290,top:330,width:500,height:430,paddingTop:30}}>
      <NumberCounter width={500} height={280} from={count} to={count} label="" color={C.green} secondaryColor={C.muted} backgroundColor="transparent" progress={1}/>
      <div style={{textAlign:'center',fontSize:30,color:C.muted}}>已找到的合法走法</div>
    </Card>
  </Page>;
}
