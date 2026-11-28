import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {MaterialCollection, type MaterialFilingOverrides} from '../../reference-opening/compositions/MaterialCollection';
import {PaperBackground} from '../../reference-opening/OpeningScene';

export type MaterialFilingExampleProps = MaterialFilingOverrides;

export const MaterialFilingExample = (props: MaterialFilingExampleProps) => {
  const frame = useCurrentFrame(), {fps, width, height} = useVideoConfig();
  const time = 187.2 + frame / fps;
  return <AbsoluteFill style={{background:'#f5f6ef', overflow:'hidden', fontFamily:'"Microsoft YaHei", sans-serif'}}>
    <div style={{position:'absolute', width:800, height:450, transformOrigin:'0 0', transform:`scale(${width/800},${height/450})`}}>
      <PaperBackground time={time}/>
      <MaterialCollection time={time} filing={props}/>
    </div>
  </AbsoluteFill>;
};
