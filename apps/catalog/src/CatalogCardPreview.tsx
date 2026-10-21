import {useEffect, useRef} from 'react';
import {Player} from '@remotion/player';
import type {PlayerRef} from '@remotion/player';
import {AudioCardComposition} from './catalog';
import type {PreviewProps} from './catalog';

type CatalogCardPreviewProps = {
  inputProps: PreviewProps;
  active: boolean;
};

const fps = 30;
const durationInFrames = 180;

/** A silent inline Remotion preview. The full player is where the shared audio is heard. */
export const CatalogCardPreview = ({inputProps, active}: CatalogCardPreviewProps) => {
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (active) {
      player.seekTo(0);
      void player.play();
      return;
    }
    player.pause();
    player.seekTo(0);
  }, [active]);

  return <div className="card-player" aria-hidden="true">
    <Player
      key={`${inputProps.id}-${inputProps.src}`}
      ref={playerRef}
      component={AudioCardComposition}
      inputProps={inputProps}
      durationInFrames={durationInFrames}
      fps={fps}
      compositionWidth={640}
      compositionHeight={260}
      controls={false}
      clickToPlay={false}
      loop
      style={{width: '100%', height: '100%'}}
    />
    {!active && <span className="card-hover-hint">悬浮查看动效</span>}
  </div>;
};
