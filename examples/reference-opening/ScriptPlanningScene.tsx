import type {ReactNode} from 'react';
import {OffthreadVideo,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {ScriptNotesFilm,ScriptNotesScene} from './ScriptNotesScene';
import {ScriptPlanningExcerpt,planningQuestionFade} from './compositions/ScriptPlanningExcerpt';
import {ModelComparisonPanel,modelComparisonClipOffset} from './compositions/ModelComparisonPanel';

const comparisonStart=134;
export const comparisonVideoStart=comparisonStart+modelComparisonClipOffset;

export const ModelComparisonVideo=({trimBefore}:{trimBefore?:number}={})=>(
  <OffthreadVideo
    src={staticFile('model-comparison/demo.mp4')}
    trimBefore={trimBefore}
    muted
    style={{display:'block',width:'100%',height:'100%',objectFit:'cover'}}
  />
);

export const ScriptPlanningLayers=({time,compareAt,video}:{time:number;compareAt?:number;video?:ReactNode})=>{
  const {fps}=useVideoConfig();
  return <>
    <ScriptPlanningExcerpt time={time} compareAt={compareAt}/>
    {compareAt!==undefined&&<ModelComparisonPanel time={compareAt}>
      {video??<Sequence from={Math.round(comparisonVideoStart*fps)} layout="none"><ModelComparisonVideo/></Sequence>}
    </ModelComparisonPanel>}
  </>;
};

export const ScriptPlanningScene=({compareAt}:{compareAt?:number}={})=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),time=frame/fps;
  let subtitle=time<132.2?'我是几乎不写的只在个别地方做了备注':'呃例如对比三个模型能力那段';
  if(compareAt!==undefined&&compareAt>=1.36){
    subtitle=compareAt<3.62?'我就标注了下 Claude、Codex 和':'DeepSeek 三个玩偶的互动';
  }
  return <ScriptNotesScene questionHeadingOpacity={planningQuestionFade(time)} subtitle={subtitle}>
    <ScriptPlanningLayers time={time} compareAt={compareAt}/>
  </ScriptNotesScene>;
};
export const ScriptModelComparisonFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const compareAt=frame/fps-comparisonStart;
  return compareAt<0?<ScriptPlanningFilm/>:<ScriptPlanningScene compareAt={compareAt}/>;
};
export const ScriptPlanningFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  return frame/fps<128.93?<ScriptNotesFilm/>:<ScriptPlanningScene/>;
};
