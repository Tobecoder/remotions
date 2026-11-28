import {Composition, registerRoot} from 'remotion';
import {DropCardsExample} from './Example';
import example from './example.json';

registerRoot(() => <Composition {...example.composition} component={DropCardsExample} defaultProps={example.defaultProps}/>);
