import {Composition, registerRoot} from 'remotion';
import {OpeningScene} from './OpeningScene';
import {FirstPointScene,Opening20Scene} from './ContinuationScene';

registerRoot(()=> <><Composition id="Reference-Opening-10s" component={OpeningScene} width={1920} height={1080} fps={30} durationInFrames={300}/><Composition id="Reference-Opening-20s" component={Opening20Scene} width={1920} height={1080} fps={30} durationInFrames={600}/><Composition id="Reference-First-Point" component={FirstPointScene} width={1920} height={1080} fps={30} durationInFrames={750}/></>);
