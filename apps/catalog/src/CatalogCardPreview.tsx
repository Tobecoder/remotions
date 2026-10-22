import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef} from 'react';
import type {SyntheticEvent} from 'react';
import {Player} from '@remotion/player';
import type {PlayerRef} from '@remotion/player';
import {AudioCardComposition, getPreviewDurationInSeconds} from './catalog';
import type {PreviewProps} from './catalog';
import {getPreviewDurationInFrames, getPreviewFrame} from './previewTimeline';

type CatalogCardPreviewProps = {
  inputProps: PreviewProps;
  active: boolean;
};

export type CatalogCardPreviewHandle = {
  start: (event?: SyntheticEvent) => void;
  stop: () => void;
};

const fps = 30;

/** A silent inline Remotion preview for browsing the catalog cards. */
export const CatalogCardPreview = forwardRef<CatalogCardPreviewHandle, CatalogCardPreviewProps>(({inputProps, active}, ref) => {
  const playerRef = useRef<PlayerRef>(null);
  const animationFrameRef = useRef<number | null>(null);
  const durationInSeconds = getPreviewDurationInSeconds(inputProps.id);
  const durationInFrames = getPreviewDurationInFrames(durationInSeconds, fps);

  const stop = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    const player = playerRef.current;
    if (!player) return;
    player.pause();
    player.seekTo(0);
  }, []);

  const start = useCallback((event?: SyntheticEvent) => {
    void event;
    stop();
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(0);
    const startedAt = performance.now();
    const tick = (now: number) => {
      const currentPlayer = playerRef.current;
      if (!currentPlayer) return;
      const nextFrame = getPreviewFrame(now - startedAt, fps, durationInFrames);
      currentPlayer.seekTo(nextFrame);
      animationFrameRef.current = requestAnimationFrame(tick);
    };
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [durationInFrames, stop]);

  useImperativeHandle(ref, () => ({start, stop}), [start, stop]);

  useEffect(() => {
    if (active) start();
    else stop();
  }, [active, start, stop]);

  const isAudioPreview = inputProps.id === 'oscilloscope' || inputProps.id === 'spectrum' || inputProps.id === 'voice';
  const compositionWidth = isAudioPreview ? 900 : 640;
  const compositionHeight = isAudioPreview ? 300 : 260;

  return <div className="card-player" aria-hidden="true">
    <Player
      key={`${inputProps.id}-${inputProps.src}`}
      ref={playerRef}
      component={AudioCardComposition}
      inputProps={inputProps}
      durationInFrames={durationInFrames}
      fps={fps}
      compositionWidth={compositionWidth}
      compositionHeight={compositionHeight}
      controls={false}
      clickToPlay={false}
      autoPlay={false}
      loop
      style={{width: '100%', height: '100%', objectFit: 'fill'}}
    />
  </div>;
});

CatalogCardPreview.displayName = 'CatalogCardPreview';
