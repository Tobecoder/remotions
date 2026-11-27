import {Img,OffthreadVideo,Sequence,staticFile} from 'remotion';
import {CardEntrance} from '../../../packages/animations/src';
import {clamp,during} from '../../../packages/animations/src/reference-opening/motion';
import {MaterialQuality} from './MaterialQuality';
import {ThreeStepFlow} from './ThreeStepFlow';

const imageStyle={display:'block',width:'100%',height:'100%',objectFit:'cover' as const};
const still=(name:string)=><Img src={staticFile(`green-screen/${name}.jpg`)} style={imageStyle}/>;
const popScale=(frame:number)=>{
 const points=[[0,0],[1,.03],[2,.3],[3,.73],[4,1.02],[5,1.03],[7,1.015],[10,1]];
 if(frame<0)return 0;
 for(let i=1;i<points.length;i++)if(frame<=points[i][0])return points[i-1][1]+(points[i][1]-points[i-1][1])*(frame-points[i-1][0])/(points[i][0]-points[i-1][0]);
 return 1;
};
/** Same flow and clip clocks across chapter cuts; only this case's inset media vary. */
export const GreenScreenFlow=({time,endFrame=7333,mediaDir='green-screen',frozen=false}:{time:number;endFrame?:number;mediaDir?:string;frozen?:boolean})=><ThreeStepFlow time={time} startAt={6787/30} steps={[
 {id:'image',label:'AI 生成绿幕图片',content:still('green-still')},
 {id:'motion',label:'视频模型生成动画',content:frozen?<Img src={staticFile('animation-sources/green-motion-last.png')} style={imageStyle}/>:<Sequence from={6918} durationInFrames={endFrame-6918} layout="none"><OffthreadVideo muted src={staticFile(`${mediaDir}/green-motion.mp4`)} style={imageStyle}/></Sequence>},
 {id:'alpha',label:'抠成透明底',content:frozen?<Img src={staticFile('animation-sources/transparent-motion-last.png')} style={imageStyle}/>:<Sequence from={7077} durationInFrames={endFrame-7077} layout="none"><OffthreadVideo muted src={staticFile(`${mediaDir}/transparent-motion.mp4`)} style={imageStyle}/></Sequence>},
]}/>;
export const GreenScreenMaterials=({time}:{time:number})=>{
 const frame=time*30;
 return <div data-green-screen-materials style={{position:'absolute',inset:0}}>
  {frame<6715&&<div data-green-outgoing style={{position:'absolute',inset:0,opacity:(1-during(frame,6706,6715))**2}}><MaterialQuality time={time} archiveEndFrame={6715} archiveMediaDir="green-screen"/></div>}
  {frame<6797&&<div data-stock-gallery style={{position:'absolute',inset:0,opacity:1-during(frame,6784,6797)}}>
   <div style={{position:'absolute',left:0,right:0,top:109,textAlign:'center',fontSize:23,fontWeight:800,color:'#292b34',opacity:during(frame,6710,6719)}}>平时攒的图片和动画素材</div>
   {[0,1,2,3,4].map(i=>{
    const start=[6714,6717,6721,6724,6727][i],p=during(frame,start,start+4),scale=popScale(frame-start);
    return <CardEntrance key={i} data-stock-card={i} progress={p} x={66+i*138} y={193} width={117} height={117} offset={{x:0,y:0}} borderRadius={14} boxShadow="0 7px 12px #30343e18" style={{transform:`scale(${scale})`,boxSizing:'border-box'}}>
     {still(`stock-${i}`)}
     {i===3&&<div style={{position:'absolute',inset:0,border:'1.4px solid #c65a4b',borderRadius:14,opacity:during(frame,6781,6787)}}/>}
    </CardEntrance>;
   })}
  </div>}
  {frame>=6787&&<GreenScreenFlow time={time}/>}
  {frame>=7260&&<div data-agent-alpha style={{position:'absolute',inset:0}}>
   <CardEntrance progress={1-(1-clamp((frame-7260+1)/8))**3} x={46} y={148} width={200} height={58} offset={{x:0,y:6}} borderRadius={9} background="#ffffffd9" boxShadow="0 3px 6px #30343e11" style={{border:'1.2px solid #bf5441',boxSizing:'border-box',padding:'10px 11px',color:'#292b34'}}>
    <div style={{fontSize:15,fontWeight:800}}><span style={{color:'#bd513d',marginRight:5}}>A</span>丢给 Agent 处理</div><div style={{fontSize:10,color:'#929498',marginTop:4}}>一句话，导出带 Alpha 的视频</div>
   </CardEntrance>
   <div style={{position:'absolute',left:299,top:137,width:454.2,height:252.5,borderRadius:10,overflow:'hidden',opacity:during(frame,7260,7270)}}><Sequence from={7260} durationInFrames={73} layout="none"><OffthreadVideo muted src={staticFile('green-screen/agent-alpha.mp4')} style={imageStyle}/></Sequence></div>
  </div>}
 </div>;
};
