import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {SrtSyncExample, srtSyncStartFrame, type SrtPlayback} from '../../reference-opening/compositions/SrtSynchronization';
import {PaperBackground} from '../../reference-opening/OpeningScene';

export type SrtSyncFullExampleProps = {playback?: SrtPlayback};

const SrtSyncStage = ({playback}: SrtSyncFullExampleProps) => {
  const frame = useCurrentFrame();
  return <>
    <PaperBackground time={frame / 30}/>
    <SrtSyncExample frame={frame} playback={playback}/>
  </>;
};

export const SrtSyncFullExample = ({playback}: SrtSyncFullExampleProps) => {
  const {width, height, durationInFrames} = useVideoConfig();
  return <AbsoluteFill style={{background:'#f5f6ef', overflow:'hidden', fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div style={{position:'absolute', width:800, height:450, transformOrigin:'0 0', transform:`scale(${width/800},${height/450})`}}>
      <Sequence trimBefore={srtSyncStartFrame} durationInFrames={durationInFrames} layout="none">
        <SrtSyncStage playback={playback}/>
      </Sequence>
    </div>
  </AbsoluteFill>;
};
