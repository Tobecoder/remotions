import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {PaperBackground,Subtitle} from './OpeningScene';
import {ScriptClosingFilm} from './ScriptClosingScene';
import {MaterialCollection} from './compositions/MaterialCollection';

export const materialCollectionSubtitles:readonly [number,string][]=[
  [180,'讲解类视频通常会涉及大量的截图'],
  [5518/30,'录屏等素材'],
  [5550/30,'那这些能不能让 Agent 来帮忙准备呢'],
  [5634/30,'如果素材在本地文件夹或者 Agent'],
  [5694/30,'可以访问的网页上'],
  [5739/30,'就可以协助查找和整理'],
  [5797/30,'但是如果散落在各种软件里面'],
  [5866/30,'具体就得看 Agent 有没有相应的操作权限'],
  [5950/30,'往往需要借助 MCP 插件或者 Computer Use'],
  [6047/30,'所以技术上是可行的'],
];

export const MaterialCollectionFilm=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  if(time<180)return <ScriptClosingFilm/>;
  let subtitle=materialCollectionSubtitles[0][1];
  for(const [at,text] of materialCollectionSubtitles)if(time>=at)subtitle=text;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-material-collection-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <PaperBackground time={time}/>
      <MaterialCollection time={time}/>
      {frame>=5423&&<Subtitle time={time} text={subtitle}/>}
    </div>
  </AbsoluteFill>;
};
