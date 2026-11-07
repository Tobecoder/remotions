import {Composition,registerRoot} from 'remotion';
import {SceneThumbnailExample} from './Example';
import example from './example.json';

registerRoot(()=><Composition id={example.composition.id} component={SceneThumbnailExample} width={example.composition.width} height={example.composition.height} fps={example.composition.fps} durationInFrames={example.composition.durationInFrames} defaultProps={example.defaultProps}/>);
