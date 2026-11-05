import {Composition, registerRoot} from 'remotion';
import {OpeningScene} from './OpeningScene';

registerRoot(()=> <Composition id="Reference-Opening-10s" component={OpeningScene} width={1920} height={1080} fps={30} durationInFrames={300}/>);
