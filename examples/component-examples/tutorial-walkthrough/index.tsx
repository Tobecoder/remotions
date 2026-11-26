import {Composition,registerRoot} from 'remotion';
import {TutorialWalkthroughExample} from './Example';
import example from './example.json';
registerRoot(()=><Composition {...example.composition} component={TutorialWalkthroughExample} defaultProps={example.defaultProps}/>);
