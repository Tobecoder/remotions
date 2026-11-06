import {Composition, registerRoot} from 'remotion';
import {OpeningScene} from './OpeningScene';
import {FirstPointScene,Opening20Scene} from './ContinuationScene';
import {BeforeWorkScene} from './SecondPointScene';
import {PreparationFilm} from './PreparationScene';
import {ScriptFilm} from './ScriptScene';

registerRoot(()=> <>
  <Composition id="Reference-Opening-10s" component={OpeningScene} width={1920} height={1080} fps={30} durationInFrames={300}/>
  <Composition id="Reference-Opening-20s" component={Opening20Scene} width={1920} height={1080} fps={30} durationInFrames={600}/>
  <Composition id="Reference-First-Point" component={FirstPointScene} width={1920} height={1080} fps={30} durationInFrames={750}/>
  <Composition id="Reference-Before-Work" component={BeforeWorkScene} width={1920} height={1080} fps={30} durationInFrames={1575}/>
  <Composition id="Reference-Preparation" component={PreparationFilm} width={1920} height={1080} fps={30} durationInFrames={1740}/>
  <Composition id="Reference-Script-96s" component={ScriptFilm} width={1920} height={1080} fps={30} durationInFrames={2880}/>
</>);
