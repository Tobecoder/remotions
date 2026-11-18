import {OffthreadVideo,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {ScriptNotesFilm,ScriptNotesScene} from './ScriptNotesScene';
import {ScriptPlanningExcerpt} from './compositions/ScriptPlanningExcerpt';
import {ModelComparisonPanel,modelComparisonClipOffset} from './compositions/ModelComparisonPanel';
import {during} from '../../packages/animations/src/reference-opening/motion';

export const ScriptPlanningScene=({compareAt}:{compareAt?:number}={})=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),time=frame/fps-129;
  let subtitle=time<3?'我是几乎不写的只在个别地方做了备注':'呃例如对比三个模型能力那段';
  if(compareAt!==undefined&&compareAt>=1.36){
    subtitle=compareAt<3.62?'我就标注了下 Claude、Codex 和':'DeepSeek 三个玩偶的互动';
  }
  return <ScriptNotesScene questionHeadingOpacity={1-during(time,2.4,2.9)} subtitle={subtitle}>
    <ScriptPlanningExcerpt time={time} compareAt={compareAt}/>
    {compareAt!==undefined&&<ModelComparisonPanel time={compareAt}>
      <Sequence from={Math.round((134+modelComparisonClipOffset)*fps)} layout="none">
        <OffthreadVideo
          src={staticFile('model-comparison/demo.mp4')}
          muted
          style={{display:'block',width:'100%',height:'100%',objectFit:'cover'}}
        />
      </Sequence>
    </ModelComparisonPanel>}
  </ScriptNotesScene>;
};
export const ScriptModelComparisonFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const compareAt=frame/fps-134;
  return compareAt<0?<ScriptPlanningFilm/>:<ScriptPlanningScene compareAt={compareAt}/>;
};
export const ScriptPlanningFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  return frame/fps<129?<ScriptNotesFilm/>:<ScriptPlanningScene/>;
};
