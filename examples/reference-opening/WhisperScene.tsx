import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {during} from '../../packages/animations/src/reference-opening/motion';
import {PaperBackground, Subtitle} from './OpeningScene';
import {SrtFilm} from './SrtScene';
import {SpeechRecognition} from './compositions/SpeechRecognition';
import {WhisperPrompt} from './compositions/WhisperPrompt';
import {WhisperSetup} from './compositions/WhisperSetup';

export const whisperStartFrame = 10754;
export const whisperEndFrame = 11870;

const captions = [
  [10754, '这里我最推荐的方法'],
  [10801, '就是本地部署Whisper'],
  [10847, '它是OpenAI免费开源的语音识别模型'],
  [10932, '有不同规格'],
  [10963, '我用的是whisper.cpp版的v3-turbo'],
  [11048, '这是社区开发的'],
  [11088, '用更轻量的方式来运行Whisper模型'],
  [11165, '安装前你可以让AI帮你评估电脑配置'],
  [11253, '然后让Agent生成SRT'],
  [11321, '但有几个小细节值得你关注'],
  [11385, '提示词里可提醒Agent参考脚本'],
  [11464, '因为语音识别经常会出现'],
  [11522, '专业术语识别错误'],
  [11568, '同音错字等问题'],
  [11609, '有脚本辅助校准就几乎不会出错了'],
  [11700, '另外加上文字宽度的要求'],
  [11759, '避免长句挤在一起'],
  [11809, '导致视频出现两行字幕'],
] as const;

export const WhisperFilm = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  if (frame < whisperStartFrame) return <SrtFilm/>;
  const time = frame / fps;
  const previous = 1 - during(frame, 10754, 10763);
  let subtitle: string = captions[0][1];
  for (const [at, text] of captions) {
    if (frame < at) break;
    subtitle = text;
  }
  return <AbsoluteFill style={{background:'#f5f6ef', overflow:'hidden', fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-whisper-scene style={{position:'absolute', width:800, height:450, transformOrigin:'0 0', transform:`scale(${width / 800},${height / 450})`}}>
      <PaperBackground time={time}/>
      {previous > 0 && <div data-whisper-outgoing style={{position:'absolute', inset:0, opacity:previous}}><SpeechRecognition frame={frame}/></div>}
      {frame < 11329 && <WhisperSetup frame={frame}/>}
      {frame >= 11325 && <WhisperPrompt frame={frame}/>}
      <div style={{position:'absolute',inset:0,transform:'translateZ(0)'}}><Subtitle time={time} text={subtitle}/></div>
    </div>
  </AbsoluteFill>;
};
