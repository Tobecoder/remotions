import {Composition,registerRoot} from 'remotion';
import {UsageMeterExample} from './Example';
import example from './example.json';
registerRoot(()=><Composition {...example.composition} component={UsageMeterExample} defaultProps={example.defaultProps}/>);
