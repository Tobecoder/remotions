import {Composition, registerRoot} from 'remotion';
import {TranscriptRoutingExample} from './Example';
import example from './example.json';

registerRoot(() => <Composition {...example.composition} component={TranscriptRoutingExample} defaultProps={example.defaultProps}/>);
