import {useCurrentFrame,useVideoConfig} from 'remotion';
import {ScriptNotesFilm,ScriptNotesScene} from './ScriptNotesScene';
import {ScriptPlanningExcerpt} from './compositions/ScriptPlanningExcerpt';
import {during} from '../../packages/animations/src/reference-opening/motion';

export const ScriptPlanningScene=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),time=frame/fps-129;
  return <ScriptNotesScene questionHeadingOpacity={1-during(time,2.4,2.9)} subtitle={time<3?'我是几乎不写的只在个别地方做了备注':'呃例如对比三个模型能力那段'}>
    <ScriptPlanningExcerpt time={time}/>
  </ScriptNotesScene>;
};
export const ScriptPlanningFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  return frame/fps<129?<ScriptNotesFilm/>:<ScriptPlanningScene/>;
};
