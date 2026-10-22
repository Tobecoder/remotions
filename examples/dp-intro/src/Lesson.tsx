import {Audio} from '@remotion/media';
import {Sequence, staticFile} from 'remotion';
import Intro from './scenes/S01';
import Enumerate from './scenes/S02';
import LastStep from './scenes/S03';
import State from './scenes/S04';
import Bases from './scenes/S05';
import BottomUp from './scenes/S06';
import Code from './scenes/S07';
import Recap from './scenes/S08';
import {CaptionTrack,timing} from './shared';

const scenes = [Intro, Enumerate, LastStep, State, Bases, BottomUp, Code, Recap];
const audio = () => staticFile('audio/narration.wav');
export const FullLesson = () => <>
  {scenes.map((Scene, i) => <Sequence key={timing.scenes[i].id} name={timing.scenes[i].id} from={timing.scenes[i].startFrame} durationInFrames={timing.scenes[i].durationInFrames} premountFor={30}><Scene/></Sequence>)}
  <Audio src={audio()} premountFor={30}/>
  <CaptionTrack/>
</>;
export const narratedScenes = scenes.map((Scene, index) => {
  const NarratedScene = () => <><Scene/><Audio src={audio()} trimBefore={timing.scenes[index].startFrame} trimAfter={timing.scenes[index].endFrame} premountFor={30}/><CaptionTrack offsetFrame={timing.scenes[index].startFrame}/></>;
  return NarratedScene;
});
