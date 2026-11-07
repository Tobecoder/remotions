import {Composition,registerRoot} from 'remotion';
import {ProgressRowExample} from './Example';
import example from './example.json';

registerRoot(()=><Composition id={example.composition.id} component={ProgressRowExample} width={example.composition.width} height={example.composition.height} fps={example.composition.fps} durationInFrames={example.composition.durationInFrames} defaultProps={example.defaultProps}/>);
