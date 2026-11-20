import {Composition,registerRoot} from 'remotion';
import {ThreeStepFlowExample} from './Example';
import example from './example.json';
registerRoot(()=><Composition {...example.composition} component={ThreeStepFlowExample} defaultProps={example.defaultProps}/>);
