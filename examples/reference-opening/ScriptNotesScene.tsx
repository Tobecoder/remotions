import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {PaperBackground,Subtitle} from './OpeningScene';
import {ScriptFilm} from './ScriptScene';
import {ScriptMaterialNotes} from './compositions/ScriptMaterialNotes';

export const scriptNotesSubtitles:readonly [number,string][]=[
  [96,'还是重点聊两个大家比较关心的问题'],[97,'脚本里要不要备注对应的素材'],[100,'要不要写每一段的动画要求'],
  [103,'像我上期的视频有大量的截图录屏'],[105,'我几乎没怎么标注'],[107,'但那是因为 Opus 5.5 模型本身足够强'],
  [111.5,'所以我的建议是最好在脚本对应的段落'],[115.5,'标注一下可用的素材'],[120,'不过手动标注太繁琐了'],
  [122,'让 Agent 帮忙匹配你来做确认和修改'],[126.5,'接下来要不要规划分段的脚本'],
];
const names=['path-3','path-6','path-8','screen-0','path-4','path-5','document-0','path-2','screen-1','path-10','path-1','document-1','path-7','skill-0','screen-2','path-0','document-3','document-4','skill-2','path-9','screen-3'];
export const ScriptNotesScene=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  let subtitle=scriptNotesSubtitles[0][1];for(const [at,text] of scriptNotesSubtitles)if(time>=at)subtitle=text;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-script-notes-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <PaperBackground time={time}/>
      <ScriptMaterialNotes time={time-96} assets={names.map(name=><Img key={name} src={staticFile(`textures/${name}.jpg`)} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>)}/>
      <Subtitle time={time} text={subtitle}/>
    </div>
  </AbsoluteFill>;
};
export const ScriptNotesFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  return frame/fps<96?<ScriptFilm/>:<ScriptNotesScene/>;
};
