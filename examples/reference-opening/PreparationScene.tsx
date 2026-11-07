import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {AgentPipeline} from '../../packages/animations/src';
import {PreparationCards} from './compositions/PreparationCards';
import {during} from '../../packages/animations/src/reference-opening/motion';
import {PaperBackground,Subtitle} from './OpeningScene';
import {BeforeWorkScene} from './SecondPointScene';

const preparationStart=51.6;
const fullImage={width:'100%',height:'100%',objectFit:'contain' as const,display:'block'};

export const PreparationScene=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-preparation-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`,overflow:'hidden'}}>
      <PaperBackground time={time}/>
      <div data-preparation-title style={{position:'absolute',left:49,top:80,opacity:during(time,51.6,52.1)}}><div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#ca7157',marginBottom:9}}>开工之前</div><div style={{fontSize:25,fontWeight:800,color:'#292c32'}}>我会先准备这些素材</div></div>
      <PreparationCards time={time} startAt={preparationStart} cards={['脚本','配音','SRT','素材'].map((title,i)=>({id:String(i),title,description:i===3?'（截图 / 录屏 / 小动画）':undefined,artwork:<Img src={staticFile(`textures/preparation-${i}.jpg`)} style={fullImage}/>}))}/>
      <AgentPipeline time={time} startAt={55} output={<Img src={staticFile('textures/screen-0.jpg')} style={{...fullImage,objectFit:'cover'}}/>}/>
      <Subtitle time={time} text={time<55?'我制作讲解视频会先准备这些素材':time<56?'然后交给 Agent':'用 Remotion 来制作'}/>
    </div>
  </AbsoluteFill>;
};

/** Keep the accepted prefix; stop before the next section title enters. */
export const PreparationFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  return frame/fps<preparationStart?<BeforeWorkScene/>:<PreparationScene/>;
};
