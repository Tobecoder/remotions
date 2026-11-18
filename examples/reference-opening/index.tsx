import {Composition,Folder,registerRoot} from 'remotion';
import {ModelComparisonClip} from './ModelComparisonClip';
import {ReferenceSegments} from './ReferenceSegments';

registerRoot(()=>(
  <>
    <ReferenceSegments/>
    <Folder name="Media">
      <Composition id="Model-Comparison-Clip" component={ModelComparisonClip} width={960} height={540} fps={30} durationInFrames={150}/>
    </Folder>
  </>
));
