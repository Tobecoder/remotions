import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {NarrationFilm} from './NarrationScene';
import {PaperBackground, Subtitle} from './OpeningScene';
import {SrtSyncExample, SrtWaveform} from './compositions/SrtSynchronization';
import {SpeechRecognition} from './compositions/SpeechRecognition';

const srtStartFrame = 9877;
const captions = [
  [9877, '有了配音之后'],
  [9914, '让Agent生成SRT字幕'],
  [9976, '把每句旁白对应的时间戳标记出来'],
  [10057, '很多小伙伴问'],
  [10094, '怎么让字幕跟配音同步'],
  [10150, '动画怎么跟着旁白节奏走'],
  [10206, '靠的就是SRT'],
  [10250, 'Agent可以根据时间戳'],
  [10300, '安排字幕和动画在对应的时间出现'],
  [10379, '要注意了，Opus、Astra'],
  [10440, 'DeepSeek这些模型'],
  [10473, '本身没有语音识别能力'],
  [10523, '要根据配音生成SRT'],
  [10579, '它得借助语音识别模型'],
  [10637, '或者飞书妙记'],
  [10677, '剪映这些有语音转文字功能的工具'],
] as const;

export const SrtFilm = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  if (frame < srtStartFrame) return <NarrationFilm/>;

  const time = frame / fps;
  let subtitle: string = captions[0][1];
  for (const [at, text] of captions) {
    if (frame < at) break;
    subtitle = text;
  }
  return <AbsoluteFill style={{background: '#f5f6ef', overflow: 'hidden', fontFamily: '"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-srt-scene style={{position: 'absolute', width: 800, height: 450, transformOrigin: '0 0', transform: `scale(${width / 800},${height / 450})`}}>
      <PaperBackground time={time}/>
      {frame < 10077 && <SrtWaveform frame={frame}/>}
      {frame >= 10061 && frame < 10385 && <SrtSyncExample frame={frame}/>}
      {frame >= 10379 && <SpeechRecognition frame={frame}/>}
      <div style={{position: 'absolute', inset: 0, transform: 'translateZ(0)'}}><Subtitle time={time} text={subtitle}/></div>
    </div>
  </AbsoluteFill>;
};
