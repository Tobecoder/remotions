import {Composition,registerRoot} from 'remotion';
import {OpeningScene} from './OpeningScene';
import {FirstPointScene,Opening20Scene} from './ContinuationScene';
import {BeforeWorkScene} from './SecondPointScene';
import {PreparationFilm} from './PreparationScene';
import {ScriptFilm} from './ScriptScene';
import {ScriptNotesFilm} from './ScriptNotesScene';
import {ScriptModelComparisonFilm,ScriptPlanningFilm} from './ScriptPlanningScene';
import {ModelComparisonClip} from './ModelComparisonClip';
import {ScriptPitfallsFilm} from './ScriptPitfallsScene';
import {ReferenceSegments} from './ReferenceSegments';

registerRoot(()=>(
  <>
    <ReferenceSegments/>
    <Composition id="Reference-Opening-10s" component={OpeningScene} width={1920} height={1080} fps={30} durationInFrames={300}/>
    <Composition id="Reference-Opening-20s" component={Opening20Scene} width={1920} height={1080} fps={30} durationInFrames={600}/>
    <Composition id="Reference-First-Point" component={FirstPointScene} width={1920} height={1080} fps={30} durationInFrames={750}/>
    <Composition id="Reference-Before-Work" component={BeforeWorkScene} width={1920} height={1080} fps={30} durationInFrames={1575}/>
    <Composition id="Reference-Preparation" component={PreparationFilm} width={1920} height={1080} fps={30} durationInFrames={1740}/>
    <Composition id="Reference-Script-96s" component={ScriptFilm} width={1920} height={1080} fps={30} durationInFrames={2880}/>
    <Composition id="Reference-Script-129s" component={ScriptNotesFilm} width={1920} height={1080} fps={30} durationInFrames={3870}/>
    <Composition id="Reference-Script-134s" component={ScriptPlanningFilm} width={1920} height={1080} fps={30} durationInFrames={4020}/>
    <Composition id="Reference-Script-139-5s" component={ScriptModelComparisonFilm} width={1920} height={1080} fps={30} durationInFrames={4185}/>
    <Composition id="Reference-Script-153s" component={ScriptPitfallsFilm} width={1920} height={1080} fps={30} durationInFrames={4590}/>
    <Composition id="Model-Comparison-Clip" component={ModelComparisonClip} width={960} height={540} fps={30} durationInFrames={150}/>
  </>
));
