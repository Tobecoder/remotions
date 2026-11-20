import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {during} from '../../packages/animations/src/reference-opening/motion';
import {PaperBackground,Subtitle} from './OpeningScene';
import {ScriptPrinciplesFilm} from './ScriptPrinciplesScene';
import {ScriptPrinciples} from './compositions/ScriptPrinciples';
import {ScriptMaterialNotes} from './compositions/ScriptMaterialNotes';
import {ScriptPlanningVerdict} from './compositions/ScriptPlanningVerdict';

const subtitles:readonly [number,string][]=[
  [159.5,'但如果说要提前规划好每一段的动画'],
  [162.45,'以我对解说视频的要求我认为没有必要'],
  [165.55,'有人说让 AI 来规划'],
  [167.6,'然后自己来修改确认'],
  [170.1,'啊，真的吗？'],
  [171.15,'就算让 AI 写出来我看一遍我都觉得费劲'],
];

export const ScriptClosingFilm=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  if(time<159.5)return <ScriptPrinciplesFilm/>;
  let subtitle=subtitles[0][1];
  for(const [at,text] of subtitles)if(time>=at)subtitle=text;
  const outgoing=1-during(time,159.5,160.05);
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-script-closing-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <PaperBackground time={time}/>
      {outgoing>0&&<div data-planning-outgoing style={{position:'absolute',inset:0,opacity:outgoing}}>
        <ScriptMaterialNotes time={63.5} assets={[]} nextQuestionOpacity={0} secondQuestionOpacity={0}/>
        <ScriptPrinciples time={159.5}/>
      </div>}
      <ScriptPlanningVerdict time={time}/>
      {time<175.3&&<Subtitle time={time} text={subtitle}/>}
    </div>
  </AbsoluteFill>;
};
