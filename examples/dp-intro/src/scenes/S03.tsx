import {useCurrentFrame} from 'remotion';
import {C,Card,Page,Staircase,cueFrame,tween,walker} from '../shared';
export default function LastStep(){
  const f=useCurrentFrame();
  const blue=cueFrame(2,'从第三级');
  const orange=cueFrame(2,'从第二级');
  const result=cueFrame(2,'加上到第二级');
  const b=tween(f,blue,blue+28),o=tween(f,orange,orange+32);
  return <Page scene={2} title="只看最后一步，就能分成两类" subtitle="从第 3 级走 1 步，或从第 2 级走 2 步 · 不重不漏">
    <Staircase style={{left:35,top:235,width:1160}} mark={f>=orange?walker(2,4,o):walker(3,4,b)} highlight={f>=orange?[2,4]:[3,4]} paths={[{from:3,to:4,color:C.blue,progress:b},{from:2,to:4,color:C.orange,progress:o}]}/>
    <Card style={{position:'absolute',left:1250,top:290,width:550,padding:30,boxSizing:'border-box',opacity:tween(f,blue,blue+12)}}>
      <div style={{fontSize:38,fontWeight:800,color:C.blue}}>从第 3 级，走 1 级</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:22}}><span style={{fontSize:31,color:C.muted}}>111 · 12 · 21</span><strong style={{fontSize:72,color:C.blue}}>3 种</strong></div>
    </Card>
    <Card style={{position:'absolute',left:1250,top:535,width:550,padding:30,boxSizing:'border-box',opacity:tween(f,orange,orange+12)}}>
      <div style={{fontSize:38,fontWeight:800,color:C.orange}}>从第 2 级，走 2 级</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:22}}><span style={{fontSize:31,color:C.muted}}>11 · 2</span><strong style={{fontSize:72,color:C.orange}}>2 种</strong></div>
    </Card>
    <div data-layout-check="sum" style={{position:'absolute',left:1300,top:790,fontSize:70,fontWeight:800,opacity:tween(f,result,result+15)}}><span style={{color:C.blue}}>3</span> + <span style={{color:C.orange}}>2</span> = <span style={{color:C.green}}>5</span></div>
  </Page>;
}
