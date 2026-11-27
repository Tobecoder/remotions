import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {CardEntrance, ChapterHeading, PerspectivePanel} from '../../packages/animations/src';
import {during, mix} from '../../packages/animations/src/reference-opening/motion';
import {AnimationSourcesFilm, AnimationSourcesGallery} from './AnimationSourcesScene';
import {PaperBackground, ScreenContent, Subtitle, VoicePage} from './OpeningScene';
import {NarrationAgent, NarrationTools, NarrationWaveform, RecordingMicrophone} from './compositions/NarrationTools';

const startFrame = 8733;
const narrationSubtitles: ReadonlyArray<readonly [number, string]> = [
  [8792, '我上期视频发布之后'],
  [8839, '没想到问得最多的问题'],
  [8892, '竟然是配音用的什么工具'],
  [8952, '是不是TTS，抱歉了'],
  [9013, '这是我自己配的音'],
  [9046, '但做了一些后期音色美化'],
  [9110, '当然我知道大家更关心的是'],
  [9167, '能不能省掉自己录音这一段'],
  [9228, '让Agent来完成配音'],
  [9281, '当然可以'],
  [9306, '只要让你的Agent接入相应的'],
  [9358, '语音合成工具就可以了'],
  [9407, '这里推荐三个可以免费使用的开源工具'],
  [9491, '它们都支持通过参考音频克隆声音'],
  [9580, '其中VoxCPM2还可以'],
  [9629, '通过文字描述来设计音色'],
  [9695, '关于这些项目的详细介绍和操作指引'],
  [9784, '你可以让你的Agent来指导'],
  [9828, '这里我就不具体演示了'],
];
const chapter = {number: 'CHAPTER 03 / 05', title: '旁白和 SRT', description: '配音工具 · 语音识别 · 字幕时间轴'};

const NarrationChapter = ({frame}: {frame: number}) => {
  const enter = during(frame, 8736, 8754);
  const opacity = enter * (1 - during(frame, 8786, 8804));
  const plane = {x: 491, y: 218, ax: .82, ay: .45, bx: -.72, by: .41};
  return <div data-narration-chapter style={{position: 'absolute', inset: 0, opacity, transform: 'translateY(' + (10 * (1 - enter)) + 'px)'}}>
    <div style={{position: 'absolute', inset: 0, transform: 'scale(1.13)', transformOrigin: '59px 132px'}}>
      <ChapterHeading from={chapter} to={{...chapter, description: frame < 8760 ? '' : chapter.description}}
        progress={enter} x={59} y={132}/>
    </div>
    <PerspectivePanel width={200} height={117} from={{...plane, x: 539, y: 246}} style={{opacity: .61}}>
      {[65, 79, 59, 48].map((width, i) => <div key={i} style={{width, height: 1, margin: i === 0 ? '23px 20px 0' : '4px 20px', background: '#a2a5a6'}}/>)}
    </PerspectivePanel>
    <PerspectivePanel width={200} height={117} from={{...plane, x: 539, y: 214}} style={{opacity: .55}}>
      <div style={{width: '100%', height: '100%', padding: 9, boxSizing: 'border-box', filter: 'grayscale(.9)'}}><ScreenContent time={4}/></div>
    </PerspectivePanel>
    <PerspectivePanel width={200} height={117} from={{...plane, x: 538, y: 155}} style={{opacity: .63}}>
      <span style={{position: 'absolute', left: 99, top: 66, width: 21, height: 5, background: '#c6c8c3'}}/>
    </PerspectivePanel>
    <PerspectivePanel width={200} height={117} from={{...plane, x: 546, y: 126}} style={{opacity: .68}}>
      <div style={{display: 'flex', gap: 8, margin: '38px 20px'}}>
        {[12, 20, 23, 15, 25, 24, 15].map((width, i) => <div key={i} style={{width, height: 18, borderRadius: 3, background: i % 2 === 0 ? '#d5a092' : '#7b8582'}}/>)}
      </div>
    </PerspectivePanel>
    <PerspectivePanel width={200} height={117} from={{...plane, x: 429, y: 145}} style={{opacity: .93}}>
      <div style={{width: '155%', height: '100%', transform: 'scaleX(.64)', transformOrigin: '0 0'}}>
        <VoicePage time={(frame - 8740) / 30}/>
      </div>
    </PerspectivePanel>
  </div>;
};

// The reference's wobble starts just before the question tags disperse.
const microphoneWobbleStart = 8979;
const microphoneWobbleAngles = [9, -7.8, .8, 6.5, -1.1, -5.4, 1.1, 4, -1.1, -2.9, .8, 1.7, -.6, -.6];

const Microphone = ({frame}: {frame: number}) => {
  const move = during(frame, 9005, 9038);
  const height = mix(162, 105, move);
  const x = mix(400, 178, move);
  const fade = during(frame, 8786, 8804) * (1 - during(frame, 9862, 9876));
  const angle = microphoneWobbleAngles[frame - microphoneWobbleStart] ?? 0;
  return <RecordingMicrophone data-narration-microphone width={height * .5} height={height}
    style={{
      position: 'absolute', left: x - height / 4, top: 332 - height, opacity: fade, overflow: 'visible',
      transformOrigin: '50% 95.7%', transform: angle === 0 ? undefined : 'rotate(' + angle + 'deg)',
    }}/>;
};

const questions = [
  {text: '配音用的什么工具？', color: '#d6a295', x: 216, y: 106, width: 167, angle: -4, frame: 8839, dx: -190, dy: -94},
  {text: '是不是TTS？', color: '#9fb7d8', x: 473, y: 138, width: 119, angle: 4, frame: 8855, dx: 220, dy: -54, emphasize: true},
  {text: '求配音工具', color: '#a6cbbc', x: 178, y: 235, width: 112, angle: 2, frame: 8867, dx: -177, dy: 43},
  {text: '这声音是AI合成的吗？', color: '#cdb6de', x: 452, y: 251, width: 172, angle: -3, frame: 8877, dx: 264, dy: 55},
  {text: '用的哪家TTS', color: '#e2d19a', x: 318, y: 176, width: 119, angle: 5, frame: 8887, dx: -53, dy: -218},
  {text: '配音好自然，怎么做的？', color: '#abb7c7', x: 293, y: 295, width: 187, angle: -1, frame: 8904, dx: -12, dy: 154},
  {text: '是真人配音吗？', color: '#e2ac9b', x: 518, y: 63, width: 135, angle: 5, frame: 8921, dx: 137, dy: -131},
];

const NarrationQuestions = ({frame}: {frame: number}) => <div data-narration-questions>
  {questions.map(question => {
    const exit = during(frame, 8992, 9011);
    const highlight = question.emphasize ? during(frame, 8955, 8960) * (1 - during(frame, 8980, 8984)) : 0;
    return <div key={question.text} style={{transform: 'translate(' + exit * question.dx + 'px,' + exit * question.dy + 'px)', opacity: 1 - exit}}>
      <CardEntrance data-narration-tag={question.text} progress={during(frame, question.frame, question.frame + 9)}
        x={question.x} y={question.y} width={question.width} height={29} rotation={question.angle + 14 * exit}
        offset={{x: 0, y: 9}} fromScale={.87} borderRadius={10} background="#fffff7" boxShadow="0 2px 4px #2630370b"
        style={highlight ? {scale: String(mix(1, 1.16, highlight))} : undefined}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '0 7px', height: '100%', color: '#30323b', fontSize: 12.2, fontWeight: 800, whiteSpace: 'nowrap'}}>
          <span style={{width: 18, height: 18, borderRadius: '50%', background: question.color, flexShrink: 0}}/>{question.text}
        </div>
        {highlight > 0 && <span data-narration-tag-highlight aria-hidden="true" style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit', border: '2px solid #c65444', opacity: highlight, pointerEvents: 'none',
        }}/>}
      </CardEntrance>
    </div>;
  })}
</div>;

const RecordingChain = ({frame}: {frame: number}) => {
  const reveal = during(frame, 9013, 9035);
  const processing = during(frame, 9046, 9059);
  const turnGreen = during(frame, 9260, 9275);
  const color = 'rgb(' + [mix(198, 60, turnGreen), mix(99, 154, turnGreen), mix(80, 115, turnGreen)].map(Math.round).join(',') + ')';
  return <div data-narration-processing style={{position: 'absolute', inset: 0, opacity: 1 - during(frame, 9305, 9317)}}>
    <div style={{position: 'absolute', left: 236, top: 177, opacity: 1 - processing}}>
      <NarrationWaveform width={521} height={99} color="#9192a0" progress={reveal} offset={(frame - 9013) * .84}/>
    </div>
    <div style={{position: 'absolute', left: 236, top: 177, display: 'flex', gap: 96, opacity: processing}}>
      <NarrationWaveform width={202} height={99} color="#9192a0" offset={(frame - 9013) * .84}/>
      <NarrationWaveform width={223} height={99} color={color} offset={(frame - 9013) * .84 + 58}/>
    </div>
    {['降噪', '均衡', '压缩'].map((label, i) => <CardEntrance key={label} x={433} y={158 + i * 44} width={99} height={40}
      progress={during(frame, 9046 + i * 3, 9054 + i * 3)} offset={{x: 0, y: 6}} borderRadius={6} background="#23262b" boxShadow="0 4px 7px #272b3330">
      <div style={{height: '100%', padding: '0 7px', display: 'flex', alignItems: 'center', gap: 6, color: '#f3f1ec', fontSize: 11, fontWeight: 800}}>
        <span style={{width: 17, height: 17, border: '1px solid #5e626a', borderRadius: '50%', position: 'relative', background: '#34353c'}}>
          <i style={{position: 'absolute', width: 1.5, height: 6, background: '#c87462', top: 2, left: 7, transformOrigin: 'bottom', transform: 'rotate(' + (32 + 20 * Math.sin(frame / 10 + i)) + 'deg)'}}/>
        </span>
        <span style={{transform: 'translateZ(0)'}}>{label}</span>
        <span style={{marginLeft: 'auto', display: 'grid', gap: 2}}>
          {[0, 1, 2, 3].map(j => <i key={j} style={{width: 5, height: 2, borderRadius: 1, background: j === 0 ? '#df9879' : '#55a98a', opacity: j < 2 ? .64 + Math.sin(frame / 5 + i) * .34 : .9}}/>)}
        </span>
      </div>
    </CardEntrance>)}
  </div>;
};

export const NarrationFilm = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  if (frame < startFrame) return <AnimationSourcesFilm/>;
  const time = frame / fps;
  const handoff = during(frame, startFrame, startFrame + 12);
  let subtitle = '';
  for (const [at, text] of narrationSubtitles) if (frame >= at) subtitle = text;

  return <AbsoluteFill style={{background: '#f5f6ef', overflow: 'hidden', fontFamily: '"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-narration-scene style={{position: 'absolute', width: 800, height: 450, transformOrigin: '0 0', transform: 'scale(' + width / 800 + ',' + height / 450 + ')'}}>
      <PaperBackground time={time}/>
      {handoff < 1 && <div data-narration-outgoing style={{
        position: 'absolute', inset: 0, opacity: (1 - handoff) ** 2, filter: 'blur(' + (3 * handoff) + 'px)',
        transform: 'scale(' + mix(1, 1.06, handoff) + ')',
      }}><AnimationSourcesGallery frame={startFrame - 1} holdLastFrame/></div>}
      {frame < 8804 && <NarrationChapter frame={frame}/>}
      {frame >= 9013 && frame < 9317 && <RecordingChain frame={frame}/>}
      {frame >= 8786 && <Microphone frame={frame}/>}
      {frame >= 8839 && frame < 9012 && <NarrationQuestions frame={frame}/>}
      {frame >= 9314 && <NarrationTools frame={frame}/>}
      {frame >= 9167 && frame < 9872 && <NarrationAgent frame={frame}/>}
      {subtitle && <div style={{position: 'absolute', inset: 0, transform: 'translateZ(0)'}}>
        <Subtitle time={time} text={subtitle}/>
      </div>}
    </div>
  </AbsoluteFill>;
};
