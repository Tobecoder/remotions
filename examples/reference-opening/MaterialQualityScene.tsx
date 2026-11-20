import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {MaterialCollectionFilm} from './MaterialCollectionScene';
import {PaperBackground,Subtitle} from './OpeningScene';
import {MaterialQuality} from './compositions/MaterialQuality';

export const materialQualitySubtitles:readonly [number,string][]=[
  [6090,'所以技术上是可行的'],[6104,'但实际它整理出来的素材'],[6161,'未必都能符合你的要求'],
  [6210,'所以这一步 Agent 目前最多能'],[6265,'辅助你做基础的收集'],[6312,'最后还是需要你自己动手'],
  [6371,'而且真要尝试'],[6410,'我建议这步用轻量模型即可'],[6473,'没必要上强度，然后有人好奇'],
  [6546,'我视频里的这些小玩偶是怎么弄的'],[6614,'看过我视频的小伙伴都知道'],[6667,'这些是老演员了'],
];
export const MaterialQualityFilm=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  if(frame<6090)return <MaterialCollectionFilm/>;
  let subtitle=materialQualitySubtitles[0][1];
  for(const [at,text] of materialQualitySubtitles)if(frame>=at)subtitle=text;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-material-quality-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <PaperBackground time={time}/><MaterialQuality time={time}/><Subtitle time={time} text={subtitle}/>
    </div>
  </AbsoluteFill>;
};
