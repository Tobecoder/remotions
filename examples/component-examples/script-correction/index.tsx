import {Composition, registerRoot} from 'remotion';
import {ScriptCorrectionExample} from './Example';
import example from './example.json';

registerRoot(() => <Composition {...example.composition} component={ScriptCorrectionExample} defaultProps={example.defaultProps}/>);
