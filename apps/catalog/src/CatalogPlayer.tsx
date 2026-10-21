import {useEffect, useRef, useState} from 'react';
import {Player} from '@remotion/player';
import type {CallbackListener, PlayerRef} from '@remotion/player';
import {PreviewComposition} from './catalog';
import type {PreviewProps} from './catalog';

type CatalogPlayerProps = {inputProps: PreviewProps; durationInFrames: number};
const fps = 30;

/** Catalog playback controls; the composition itself remains frame-driven. */
export const CatalogPlayer = ({inputProps, durationInFrames}: CatalogPlayerProps) => {
  const playerRef = useRef<PlayerRef>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onFrame: CallbackListener<'frameupdate'> = ({detail}) => setFrame(detail.frame);
    const onFullscreen = () => setFullscreen(document.fullscreenElement === shellRef.current);
    setPlaying(player.isPlaying());
    setFrame(player.getCurrentFrame());
    setCanFullscreen(Boolean(document.fullscreenEnabled));
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);
    player.addEventListener('frameupdate', onFrame);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => {
      player.removeEventListener('play', onPlay);
      player.removeEventListener('pause', onPause);
      player.removeEventListener('frameupdate', onFrame);
      document.removeEventListener('fullscreenchange', onFullscreen);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === shellRef.current) await document.exitFullscreen();
      else await shellRef.current?.requestFullscreen();
      setNotice('');
    } catch {
      setNotice('暂时无法进入全屏，请稍后重试。');
    }
  };

  return <div className="player-shell" ref={shellRef}>
    <div className="player-wrap">
      <Player
        ref={playerRef}
        component={PreviewComposition}
        inputProps={inputProps}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={1280}
        compositionHeight={720}
        controls={false}
        clickToPlay
        loop
        initialFrame={8}
        errorFallback={() => <p role="alert">动效预览暂时无法加载，请刷新页面重试。</p>}
        style={{width: '100%', aspectRatio: '16 / 9'}}
      />
    </div>
    <div className="playback-controls" role="group" aria-label="播放控制">
      <button type="button" onClick={(event) => playerRef.current?.toggle(event)} aria-label={playing ? '暂停播放' : '继续播放'}>{playing ? '暂停' : '播放并试听'}</button>
      <button type="button" onClick={(event) => {playerRef.current?.seekTo(0); playerRef.current?.play(event);}}>重播</button>
      <input type="range" aria-label="播放进度" aria-valuetext={`第 ${frame + 1} 帧，共 ${durationInFrames} 帧`} min={0} max={durationInFrames - 1} value={frame} onChange={(event) => {const nextFrame = Number(event.target.value); playerRef.current?.seekTo(nextFrame); setFrame(nextFrame);}} />
      <span className="playback-time">{(frame / fps).toFixed(1)} / {(durationInFrames / fps).toFixed(1)} 秒</span>
      {canFullscreen && <button type="button" onClick={toggleFullscreen}>{fullscreen ? '退出全屏' : '全屏'}</button>}
    </div>
    {notice && <p role="status" className="playback-notice">{notice}</p>}
  </div>;
};
