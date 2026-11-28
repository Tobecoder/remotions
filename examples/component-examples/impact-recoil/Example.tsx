import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {SpeechRecognition, type SpeechRecognitionCards} from '../../reference-opening/compositions/SpeechRecognition';
import {PaperBackground} from '../../reference-opening/OpeningScene';

export type ImpactRecoilExampleProps = {cards?: SpeechRecognitionCards};

export const ImpactRecoilExample = ({cards}: ImpactRecoilExampleProps) => {
  const localFrame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const frame = 10400 + localFrame * (30 / fps);
  return <AbsoluteFill style={{background:'#f5f6ef', overflow:'hidden', fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div style={{position:'absolute', width:800, height:450, transformOrigin:'0 0', transform:`scale(${width/800},${height/450})`}}>
      <PaperBackground time={frame / 30}/>
      <SpeechRecognition frame={frame} cards={cards}/>
    </div>
  </AbsoluteFill>;
};
