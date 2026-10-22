import {Composition, registerRoot} from 'remotion';
import {FullLesson, narratedScenes} from './src/Lesson';
import {timing} from './src/shared';
const dimensions = {width:1920, height:1080, fps:30};
const Root = () => <>
  <Composition id="DP-Intro" component={FullLesson} {...dimensions} durationInFrames={timing.durationInFrames}/>
  {narratedScenes.map((Scene, index) => <Composition key={index} id={`DP-${timing.scenes[index].id}`} component={Scene} {...dimensions} durationInFrames={timing.scenes[index].durationInFrames}/>)}
</>;
registerRoot(Root);
