import {Freeze,useCurrentFrame,useVideoConfig} from 'remotion';
import {during} from '../../packages/animations/src/reference-opening/motion';
import {ScriptNotesScene} from './ScriptNotesScene';
import {ScriptModelComparisonFilm,ScriptPlanningLayers} from './ScriptPlanningScene';
import {ScriptPitfalls} from './compositions/ScriptPitfalls';

const comparisonEnd=139.5;
const subtitles=[
  [139.5,'但整条视频下来其实有踩坑'],
  [141.72,'比如检查电脑环境配置'],
  [144,'还有初始化 Remotion 项目'],
  [146.22,'这两个环节的提示词'],
  [147.62,'我明明放在脚本里了'],
  [149.48,'结果 Opus 直接给我略过'],
  [151.24,'视频里只展示了几个要点'],
] as const;

export const ScriptPitfallsFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),time=frame/fps;
  if(time<comparisonEnd)return <ScriptModelComparisonFilm/>;

  const lastComparisonFrame=Math.round(comparisonEnd*fps)-1;
  const lastComparisonTime=lastComparisonFrame/fps;
  const outgoing=1-during(time,139.5,139.98);
  let subtitle:string=subtitles[0][1];
  for(const [at,text] of subtitles)if(time>=at)subtitle=text;
  return <ScriptNotesScene questionHeadingOpacity={0} subtitle={subtitle}>
    {outgoing>0&&<div data-pitfall-outgoing style={{position:'absolute',inset:0,opacity:outgoing}}>
      <Freeze frame={lastComparisonFrame}>
        <ScriptPlanningLayers time={lastComparisonTime} compareAt={lastComparisonTime-134}/>
      </Freeze>
    </div>}
    <ScriptPitfalls time={time}/>
  </ScriptNotesScene>;
};
