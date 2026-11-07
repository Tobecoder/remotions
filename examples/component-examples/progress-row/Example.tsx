import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ProgressRace,type ProgressRaceProps} from '../../reference-opening/compositions/ProgressRace';

export type ProgressRowExampleProps=Omit<ProgressRaceProps,'time'|'startAt'>;

/** The full comparison uses the existing case choreography, with replaceable copy. */
export const ProgressRowExample=(props:ProgressRowExampleProps)=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-component-example="progress-row-comparison" style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <ProgressRace {...props} time={frame/fps}/>
    </div>
  </AbsoluteFill>;
};
