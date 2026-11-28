import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {WhisperPrompt, type WhisperCorrectionCards} from '../../reference-opening/compositions/WhisperPrompt';
import {PaperBackground} from '../../reference-opening/OpeningScene';

export type ScriptCorrectionExampleProps = {correctionCopy?: WhisperCorrectionCards};

export const ScriptCorrectionExample = ({correctionCopy}: ScriptCorrectionExampleProps) => {
  const localFrame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const frame = 11448 + Math.floor(localFrame * 30 / fps);
  return <AbsoluteFill style={{background:'#f5f6ef', overflow:'hidden', fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div style={{position:'absolute', width:800, height:450, transformOrigin:'0 0', transform:`scale(${width/800},${height/450})`}}>
      <PaperBackground time={frame / 30}/>
      <WhisperPrompt frame={frame} correctionCopy={correctionCopy}/>
    </div>
  </AbsoluteFill>;
};
