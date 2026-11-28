import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {NarrationAgent, NarrationTools, type VoiceTools} from '../../reference-opening/compositions/NarrationTools';
import {NarrationMicrophone} from '../../reference-opening/NarrationScene';
import {PaperBackground} from '../../reference-opening/OpeningScene';

export type DropCardsExampleProps = {tools?: VoiceTools};

export const DropCardsExample = ({tools}: DropCardsExampleProps) => {
  const localFrame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const frame = 9370 + localFrame * (30 / fps);
  return <AbsoluteFill style={{background:'#f5f6ef', overflow:'hidden', fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div style={{position:'absolute', width:800, height:450, transformOrigin:'0 0', transform:`scale(${width/800},${height/450})`}}>
      <PaperBackground time={frame / 30}/>
      <NarrationMicrophone frame={frame}/>
      <NarrationTools frame={frame} tools={tools}/>
      <NarrationAgent frame={frame}/>
    </div>
  </AbsoluteFill>;
};
