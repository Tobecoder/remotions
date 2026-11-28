import {Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import type {CSSProperties} from 'react';
import {CardEntrance, HighlightBox} from '../../../packages/animations/src';
import {clamp, during, mix} from '../../../packages/animations/src/reference-opening/motion';

const coral = '#ca4935';
const ink = '#292c35';
const waveformHeights = [
  68,54,42,32,4,1,1,1,1,1,1,14,69,76,74,62,66,69,18,20,22,65,76,67,58,64,66,66,60,24,
  75,75,31,20,71,78,76,55,23,6,4,9,13,66,66,55,31,4,55,66,75,55,29,61,58,41,30,20,20,64,
  66,71,71,20,55,55,42,19,6,34,56,61,59,38,16,58,61,61,56,18,18,54,56,48,9,11,22,68,68,66,
  64,64,67,31,21,6,1,1,1,1,1,55,72,72,75,72,48,35,28,10,15,60,60,28,26,43,54,58,55,45,51,
  55,55,50,15,75,78,64,59,55,54,50,50,41,25,24,61,63,60,52,63,65,66,64,19,12,69,69,54,54,68,
  71,70,61,10,54,63,50,30,24,60,68,68,63,50,42,31,14,4,
];
const timedLines = [
  {x: 74, width: 122, enter: 9908, copyAt: 9914, clockAt: 9976, start: '00:05:40,880', end: '00:05:42,030', text: '有了配音之后'},
  {x: 214, width: 215, enter: 9917, copyAt: 9927, clockAt: 9982, start: '00:05:42,180', end: '00:05:44,200', text: '让Agent生成SRT字幕'},
  {x: 445, width: 296, enter: 9926, copyAt: 9982, clockAt: 9988, start: '00:05:44,320', end: '00:05:47,080', text: '把每句旁白对应的时间戳标记出来'},
];

export const SrtWaveform = ({frame}: {frame: number}) => {
  const head = Math.min(754, 74 + (frame - 9877) * 3.78);
  const exit = during(frame, 10060, 10077);
  return <div data-srt-waveform style={{
    position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translate3d(${exit * 18}px,0,0)`,
  }}>
    {timedLines.map(({x, width, enter}, i) => <div key={x} data-srt-wave-segment={155 + i} style={{
      position: 'absolute', left: x, top: 93, width: width + 2, height: 96, boxSizing: 'border-box',
      borderRadius: 6, borderInline: '1.25px solid #36323a', background: '#cb583213',
      transform: `scaleY(${during(frame, enter, enter + 7)})`, opacity: during(frame, enter, enter + 7),
    }}/>)}
    <svg width="800" height="450" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} aria-hidden="true">
      {waveformHeights.map((height, i) => {
        const x = 45 + 4.19 * i;
        return <line key={i} x1={x} x2={x} y1={141 - height / 2} y2={141 + height / 2}
          stroke={x < head ? coral : '#b4b1ac66'} strokeWidth="2.65" strokeLinecap="round"/>;
      })}
      <line data-srt-playhead x1={head} x2={head} y1="91" y2="191" stroke="#2e2b31" strokeWidth="1.55" strokeLinecap="round"/>
    </svg>
    {timedLines.map((line, i) => <CardEntrance key={line.x} progress={during(frame, line.enter, line.enter + 9)}
      x={line.x} y={204} width={line.width} height={73} borderRadius={8} offset={{x: 0, y: 12}}
      background="#fcfcf7" boxShadow="0 5px 11px #34363818">
      <div style={{position: 'absolute', left: 7, top: 6, fontSize: 11, fontWeight: 850, color: coral, transform: 'translateZ(0)'}}>{155 + i}</div>
      <div data-srt-timestamp={155 + i} style={{
        position: 'absolute', left: 7, top: 21, color: '#43434c', fontFamily: 'monospace', fontSize: 8.2,
        lineHeight: '12px', opacity: during(frame, line.clockAt, line.clockAt + 7), transform: 'translateZ(0)',
      }}>{line.start} →<br/>{line.end}</div>
      <div style={{
        position: 'absolute', left: 7, bottom: 7, fontSize: 11.7, fontWeight: 800, color: ink,
        opacity: during(frame, line.copyAt, line.copyAt + 8), transform: 'translateZ(0)',
      }}>{line.text}</div>
    </CardEntrance>)}
  </div>;
};

const tutorialCues = [
  {from: 10095, start: '00:00:00,140', end: '00:00:02,630', text: '这是一期很朴素也很啰嗦的Remotion教程。'},
  {from: 10175, start: '00:00:02,840', end: '00:00:04,210', text: '没有什么一个skill搞定，'},
  {from: 10216, start: '00:00:04,310', end: '00:00:05,850', text: '更没有一句话就能做出来。'},
  {from: 10267, start: '00:00:06,150', end: '00:00:09,220', text: '而是还原这些动画从探索到制作的过程，'},
  {from: 10359, start: '00:00:09,340', end: '00:00:12,760', text: '希望能够帮助你掌握方法创作出自己的作品。'},
  {from: 10471, start: '00:00:13,010', end: '00:00:14,610', text: '我最常收到的几个问题，'},
  {from: 10525, start: '00:00:14,710', end: '00:00:17,040', text: '为什么我用Remotion做出来跟PPT一样？'},
];

const lineHeight = 19.15;
const srtPanel = {x: 491, y: 51, width: 272, height: 315};
const tickPositions = [54, 108, 141, 180, 251, 330, 370, 426, 448];
export const srtSyncStartFrame = 10061;
const previewStart = 10095;
const mediaStyle = {width: '100%', height: '100%', display: 'block'} satisfies CSSProperties;

export type SrtCue = {startMs: number; endMs: number; text: string};
export type SrtPlayback = {cues: readonly SrtCue[]; previewSrc: string};

const referenceTracks = tickPositions.slice(0, -1).map((x, i) => ({x, endX: tickPositions[i + 1]}));
const referenceState = (frame: number) => {
  const active = tutorialCues.reduce((index, cue, i) => frame >= cue.from ? i : index, -1);
  const scroll = tutorialCues.slice(1).reduce((offset, cue) =>
    offset + 4 * lineHeight * during(frame, cue.from + 5, cue.from + 40), 0);
  const cueIndex = Math.max(active, 0);
  const cueStart = tutorialCues[cueIndex].from;
  const nextCue = tutorialCues[cueIndex + 1]?.from ?? cueStart + 74;
  const head = mix(tickPositions[cueIndex], tickPositions[cueIndex + 1], clamp((frame - cueStart) / (nextCue - cueStart)));
  return {active, scroll, head, tracks: referenceTracks, rows: tutorialCues};
};

const formatSrtTime = (ms: number) => {
  const time = Math.floor(ms);
  const pad = (value: number, minimum = 2) => String(value).padStart(minimum, '0');
  return pad(Math.floor(time / 3600000)) + ':' + pad(Math.floor(time / 60000) % 60) + ':' +
    pad(Math.floor(time / 1000) % 60) + ',' + pad(time % 1000, 3);
};

const playbackState = (frame: number, cues: readonly SrtCue[]) => {
  const time = (frame - previewStart) * 1000 / 30;
  const started = cues.reduce((index, cue, i) => cue.startMs <= time ? i : index, -1);
  const active = started >= 0 && time < cues[started].endMs ? started : -1;
  const furthest = cues.reduce((end, cue) => Math.max(end, cue.endMs), 1);
  const toX = (ms: number) => mix(54, 448, clamp(ms / furthest));
  const scroll = cues.slice(1).reduce((offset, cue) =>
    offset + 4 * lineHeight * during(time, cue.startMs, cue.startMs + 350), 0);
  const minScroll = Math.max(0, (4 * started + 3) * lineHeight - srtPanel.height);
  const maxScroll = Math.max(0, cues.length * 4 * lineHeight - srtPanel.height);
  return {
    active, scroll: Math.min(maxScroll, Math.max(scroll, minScroll)), head: toX(time),
    tracks: cues.map(cue => ({x: toX(cue.startMs), endX: toX(cue.endMs)})),
    rows: cues.map(cue => ({start: formatSrtTime(cue.startMs), end: formatSrtTime(cue.endMs), text: cue.text})),
  };
};

export const SrtSyncExample = ({frame, playback}: {frame: number; playback?: SrtPlayback}) => {
  const {active, scroll, head, tracks, rows} = playback ? playbackState(frame, playback.cues) : referenceState(frame);
  const outline = during(frame, 10205, 10219);
  const timeline = playback ? during(frame, 10090, previewStart) : during(frame, 10243, 10266);
  return <div data-srt-sync-example data-srt-active-cue={active + 1} style={{
    position: 'absolute', inset: 0, opacity: playback ? 1 : 1 - during(frame, 10372, 10385),
  }}>
    <CardEntrance progress={during(frame, srtSyncStartFrame, 10072)} {...srtPanel} offset={{x: 59, y: 0}}
      borderRadius={10} background="#fffefa" boxShadow="0 7px 13px #30343e20">
      <div data-srt-lines style={{
        position: 'absolute', left: 0, right: 0, top: 0, transform: `translate3d(0,${-scroll}px,0)`,
        fontFamily: 'Consolas, "Microsoft YaHei", monospace', fontSize: 10.8, lineHeight: lineHeight + 'px', color: '#2c272b',
      }}>
        {rows.map((cue, i) => <div key={i}>
          <div data-srt-cue={i + 1} style={{background: active === i ? '#f6dcd4' : undefined, boxShadow: active === i ? 'inset 2px 0 #d25138' : undefined}}>
            {[String(i + 1), cue.start + ' --> ' + cue.end, cue.text].map((line, j) => <div key={j} style={{
              display: 'grid', gridTemplateColumns: '30px 1fr', alignItems: 'center', padding: '0 6px', height: lineHeight,
            }}>
              <span style={{textAlign: 'right', paddingRight: 12, color: '#717174'}}>{i * 4 + j + 1}</span>
              <span style={playback && j === 2 ? {whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'} : {whiteSpace: 'nowrap'}}>{line}</span>
            </div>)}
          </div>
          <div style={{height: lineHeight, marginLeft: 6, width: 18, textAlign: 'right', color: '#717174'}}>{i * 4 + 4}</div>
        </div>)}
        {!playback && <div aria-hidden="true" style={{display: 'grid', gridTemplateColumns: '30px 1fr', padding: '0 6px'}}>
          <span style={{textAlign: 'right', paddingRight: 12, color: '#717174'}}>29</span><span>8</span>
        </div>}
      </div>
      <div aria-hidden="true" style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 18, background: 'linear-gradient(transparent, #fffefa)'}}/>
    </CardEntrance>
    {outline > 0 && <HighlightBox progress={outline} {...srtPanel} color={coral} shadowColor="transparent" radius={10} strokeWidth={1.8}/>}
    {frame >= 10090 && <CardEntrance data-srt-tutorial-preview progress={during(frame, 10090, 10096)}
      x={43} y={61} width={420} height={237} offset={{x: 0, y: 0}}
      borderRadius={8} background="#f2f1f8" boxShadow="0 7px 15px #2d303925">
      {playback || frame < 10374 ? <Sequence from={previewStart} durationInFrames={playback ? undefined : 279} layout="none">
        <OffthreadVideo muted src={playback?.previewSrc ?? staticFile('srt-sync/tutorial-preview.mp4')} style={mediaStyle}/>
      </Sequence> : <Img src={staticFile('srt-sync/tutorial-last.png')} style={mediaStyle}/>}
      {playback && active >= 0 && <div data-srt-preview-caption style={{
        position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: 'max-content', maxWidth: '90%',
        background: '#242a37e8', color: '#fff', padding: '3px 7px', borderRadius: 4, textAlign: 'center',
        fontSize: 10, lineHeight: '14px', fontWeight: 700, whiteSpace: 'pre-line', overflowWrap: 'anywhere',
      }}>{rows[active].text}</div>}
    </CardEntrance>}
    {timeline > 0 && <svg data-srt-tutorial-timeline width="800" height="450" style={{position: 'absolute', inset: 0, opacity: timeline}} aria-hidden="true">
      {tracks.map(({x, endX}, i) => <g key={i}>
        <rect data-srt-timeline-cue={i + 1} x={x - 8} y="317" width={playback ? Math.max(0, endX - x - 3) : endX - x - 5}
          height="14" rx="3" fill={active === i ? coral : '#d1d3ce'}/>
        <rect x={x - 5.3} y="341" width="10.6" height="10.6" rx="1.5" transform={`rotate(45 ${x} 346.3)`} fill={x <= head ? '#292c36' : '#d5d7d1'}/>
      </g>)}
      <line data-srt-timeline-playhead x1={head} x2={head} y1="313" y2="359" stroke={coral} strokeWidth="1.55"/>
    </svg>}
  </div>;
};
