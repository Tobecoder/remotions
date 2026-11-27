import {Composition,registerRoot} from 'remotion';
import {ResourceCreditsExample} from './Example';
import example from './example.json';
registerRoot(()=><Composition {...example.composition} component={ResourceCreditsExample} defaultProps={example.defaultProps}/>);
