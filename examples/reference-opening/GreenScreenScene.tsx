import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {MaterialQualityFilm} from './MaterialQualityScene';
import {PaperBackground,Subtitle} from './OpeningScene';
import {GreenScreenMaterials} from './compositions/GreenScreenMaterials';

export const greenScreenSubtitles:readonly [number,string][]=[
 [6706,'我平时攒了一些图片和动画素材'],[6787,'比如这个Codex的拟人小玩偶'],[6858,'我会先让AI做成绿幕图片'],
 [6918,'再丢给视频模型生成动画'],[6982,'为什么用绿幕'],[7010,'因为大多视频模型无法直接生成'],
 [7077,'透明底的动画，绿幕方便抠图嘛'],[7151,'那怎么把绿幕动画变成透明底的'],[7226,'动画素材呢'],[7260,'你可以直接丢给Agent让它帮你处理'],
];
export const GreenScreenFilm=()=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
 if(frame<6706)return <MaterialQualityFilm/>;
 let subtitle=greenScreenSubtitles[0][1];
 for(const [at,text] of greenScreenSubtitles)if(frame>=at)subtitle=text;
 return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
  <div data-green-screen-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
   <PaperBackground time={time}/><GreenScreenMaterials time={time}/><Subtitle time={time} text={subtitle}/>
  </div>
 </AbsoluteFill>;
};
