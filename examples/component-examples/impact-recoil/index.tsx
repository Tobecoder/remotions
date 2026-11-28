import {Composition, registerRoot} from 'remotion';
import {ImpactRecoilExample} from './Example';
import example from './example.json';

registerRoot(() => <Composition {...example.composition} component={ImpactRecoilExample} defaultProps={example.defaultProps}/>);
