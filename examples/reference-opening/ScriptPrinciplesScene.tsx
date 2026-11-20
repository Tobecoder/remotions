import {useCurrentFrame,useVideoConfig} from 'remotion';
import {during} from '../../packages/animations/src/reference-opening/motion';
import {ScriptNotesScene} from './ScriptNotesScene';
import {ScriptPitfallsFilm} from './ScriptPitfallsScene';
import {ScriptPitfalls} from './compositions/ScriptPitfalls';
import {principlesBookmarkOpacity,ScriptPrinciples} from './compositions/ScriptPrinciples';

const subtitles:readonly [number,string][]=[
  [153,'所以一些原则性的要求'],
  [155.1,'最好还是提前备注清楚'],
  [156.8,'甚至写入项目的 AGENTS.md 里'],
];

export const ScriptPrinciplesFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),time=frame/fps;
  if(time<153)return <ScriptPitfallsFilm/>;
  let subtitle=subtitles[0][1];
  for(const [at,text] of subtitles)if(time>=at)subtitle=text;
  const outgoing=1-during(time,153,153.45);
  return <ScriptNotesScene subtitle={subtitle} questionHeadingOpacity={0} secondQuestionOpacity={1-principlesBookmarkOpacity(time)}>
    {outgoing>0&&<div data-principles-outgoing style={{position:'absolute',inset:0,opacity:outgoing}}>
      <ScriptPitfalls time={153}/>
    </div>}
    <ScriptPrinciples time={time}/>
  </ScriptNotesScene>;
};
