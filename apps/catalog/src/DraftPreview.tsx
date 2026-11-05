import {useEffect, useRef, useState} from 'react';
import {Player} from '@remotion/player';
import type {PlayerRef} from '@remotion/player';
import {ScreenshotFocusDraft} from '../../../packages/animations/src/drafts/ScreenshotFocusDraft';
import {referenceVideo, screenshotExamples} from './draftReview';

const duration = 240;
const fps = 30;

export const DraftPreview = () => {
  const player = useRef<PlayerRef>(null);
  const played = useRef(false);
  const [exampleId, setExampleId] = useState('document');
  const [frame, setFrame] = useState(30);
  const [playing, setPlaying] = useState(false);
  const example = screenshotExamples.find((item) => item.id === exampleId)!;

  useEffect(() => {
    const current = player.current;
    if (!current) return;
    const syncFrame = (event: {detail: {frame: number}}) => setFrame(event.detail.frame);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    current.addEventListener('frameupdate', syncFrame);
    current.addEventListener('play', onPlay);
    current.addEventListener('pause', onPause);
    current.addEventListener('ended', onPause);
    return () => {
      current.removeEventListener('frameupdate', syncFrame);
      current.removeEventListener('play', onPlay);
      current.removeEventListener('pause', onPause);
      current.removeEventListener('ended', onPause);
    };
  }, []);

  const start = (restart = false) => {
    const current = player.current;
    if (!current) return;
    if (restart || !played.current || current.getCurrentFrame() >= duration - 1) current.seekTo(0);
    played.current = true;
    current.play();
  };

  return <article className="draft-review" aria-label="截图窗口聚焦待验收预览">
    <div className="draft-heading"><div><span className="draft-status">待验收</span><h3>截图窗口聚焦</h3><p>文档进入 → 重点高亮 → 轻推聚焦 → 保持画面</p></div><a href={referenceVideo} target="_blank" rel="noreferrer">查看原片 02:02–02:15 ↗</a></div>
    <div className="draft-stage">
      <Player ref={player} component={ScreenshotFocusDraft} inputProps={example.props} compositionWidth={1280} compositionHeight={720} durationInFrames={duration} fps={fps} initialFrame={30} controls={false} loop={false} moveToBeginningWhenEnded={false} autoPlay={false} initiallyMuted clickToPlay={false} doubleClickToFullscreen={false} style={{width: '100%', aspectRatio: '16 / 9'}}/>
    </div>
    <div className="draft-controls">
      <button type="button" onClick={() => playing ? player.current?.pause() : start()} aria-label={playing ? '暂停动画' : '播放动画'}>{playing ? '暂停' : '播放'}</button>
      <button type="button" onClick={() => start(true)}>重新播放</button>
      <input aria-label="动画进度" type="range" min={0} max={duration - 1} value={frame} onChange={(event) => {played.current = true; player.current?.pause(); player.current?.seekTo(Number(event.target.value));}}/>
      <output aria-label="当前动画时间">{(frame / fps).toFixed(1)} / 8.0 秒</output>
      <label>更换示例 <select aria-label="更换示例" value={exampleId} onChange={(event) => {player.current?.pause(); setExampleId(event.target.value); played.current = false; player.current?.seekTo(30);}}>{screenshotExamples.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    </div>
    <p className="draft-note">参考原片的白色文档卡、浅纸底与重点引导；演示文档为本项目原创。当前是首版复刻，等待视觉验收，尚未作为正式素材开放。</p>
  </article>;
};
