import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {WritingComparison,type WritingComparisonProps} from '../../reference-opening/compositions/WritingComparison';
import {PreparationArtwork} from '../../../packages/animations/src/reference-opening/PreparationArtwork';
import {NeuronPreview} from '../../../packages/animations/src/reference-opening/NeuronPreview';

export type WritingComparisonExampleProps=Omit<WritingComparisonProps,'time'|'startAt'>;
export const WritingComparisonExample=({ownThumbnail,aiThumbnail,...props}:WritingComparisonExampleProps={})=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-component-example="writing-comparison" style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <WritingComparison {...props} time={time} ownThumbnail={ownThumbnail===undefined?<PreparationArtwork kind={0}/>:ownThumbnail} aiThumbnail={aiThumbnail===undefined?<NeuronPreview time={time-5.4}/>:aiThumbnail}/>
    </div>
  </AbsoluteFill>;
};
