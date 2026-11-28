import {Composition, registerRoot} from 'remotion';
import {SrtSyncFullExample} from './Example';
import example from './example.json';

registerRoot(() => <Composition {...example.composition} component={SrtSyncFullExample} defaultProps={example.defaultProps}/>);
