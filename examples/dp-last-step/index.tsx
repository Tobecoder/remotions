import {Composition,registerRoot} from 'remotion';
import {Sample} from './src/Composition';

registerRoot(()=> <Composition id="DP-Last-Step-20s" component={Sample} width={1920} height={1080} fps={30} durationInFrames={600}/>);
