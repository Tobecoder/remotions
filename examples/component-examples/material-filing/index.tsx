import {Composition, registerRoot} from 'remotion';
import {MaterialFilingExample} from './Example';
import example from './example.json';

registerRoot(() => <Composition {...example.composition} component={MaterialFilingExample} defaultProps={example.defaultProps}/>);
