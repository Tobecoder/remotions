import {Composition,Sequence} from 'remotion';
import {SrtFilm} from './SrtScene';
import segments from './segments.json';

type SegmentProps={startFrame:number;endFrame:number};

const ReferenceSegment=({startFrame,endFrame}:SegmentProps)=>(
  <Sequence layout="none" showInTimeline={false} trimBefore={startFrame} durationInFrames={endFrame-startFrame}>
    <SrtFilm/>
  </Sequence>
);

export const ReferenceSegments=()=>(
  <>
    {segments.map(({id,endFrame},index)=>{
      const startFrame=segments[index-1]?.endFrame??0;
      return <Composition key={id} id={id} component={ReferenceSegment}
        width={1920} height={1080} fps={30} durationInFrames={endFrame-startFrame}
        defaultProps={{startFrame,endFrame}}
      />;
    })}
  </>
);
