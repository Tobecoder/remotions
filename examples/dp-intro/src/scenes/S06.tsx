import {useCurrentFrame} from 'remotion';
import {C,DpTable,MONO,Page,cueFrame,tween} from '../shared';
export const calculationState=(frame:number)=>{
  const starts=[cueFrame(5,'第二级'),cueFrame(5,'第三级'),cueFrame(5,'第四级')];
  const ends=[cueFrame(5,'等于二',0,2),cueFrame(5,'等于三',0,2),cueFrame(5,'等于五',0,2)];
  const values:(number|null)[]=[1,1,...ends.map((end,i)=>frame>=end?[2,3,5][i]:null)];
  const active=frame<starts[1]?2:frame<starts[2]?3:4;
  return {starts,ends,values,active};
};
export default function BottomUp(){
  const f=useCurrentFrame();
  const {starts,ends,values,active}=calculationState(f);
  const written=f>=ends[active-2];
  const pair=active===2?[1,1]:active===3?[2,1]:[3,2];
  const start=starts[active-2];
  return <Page scene={5} title="从左往右，一个格子一个格子算" subtitle="读取已知答案 → 相加 → 写入新格子">
    <div data-layout-check="calculation" style={{position:'absolute',top:315,left:300,width:1320,textAlign:'center',fontSize:100,fontWeight:800,fontFamily:MONO,opacity:tween(f,starts[0],starts[0]+12)}}><span style={{color:C.blue}}>{pair[0]}</span> + <span style={{color:C.orange}}>{pair[1]}</span> = <span style={{color:written?C.green:'#bdc7d4'}}>{written?[2,3,5][active-2]:'?'}</span></div>
    <svg width="1320" height="120" style={{position:'absolute',left:300,top:465}}><path d={`M${(active-1)*246+115} 100 Q${(active-.5)*246} -35 ${active*246+115} 100`} fill="none" stroke={C.blue} strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-tween(f,start,start+18)}/><path d={`M${(active-2)*246+115} 100 Q${(active-1)*246} -70 ${active*246+115} 100`} fill="none" stroke={C.orange} strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-tween(f,start+8,start+25)}/></svg>
    <DpTable values={values} active={active} inputs={[active-1,active-2]} style={{position:'absolute',top:585,left:313}}/>
  </Page>;
}
