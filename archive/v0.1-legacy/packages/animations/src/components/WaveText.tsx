import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import type {MotionStyleProps} from '../types';
import {splitGraphemes} from '../internal/graphemes';

export type WaveTextProps = MotionStyleProps & {text: string; staggerInFrames?: number; amplitude?: number};

export const WaveText = ({text, staggerInFrames = 3, amplitude = 45, delayInFrames = 0, durationInFrames = 26, className, style}: WaveTextProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <span className={className} role="text" aria-label={text} style={{whiteSpace: 'pre-wrap', ...style}}>
    {splitGraphemes(text).map((character, index) => {
      const progress = spring({fps, frame: frame - delayInFrames - index * staggerInFrames, durationInFrames: Math.max(1, durationInFrames), config: {damping: 12, mass: 0.8}});
      return <span key={index} aria-hidden="true" style={{display: 'inline-block', opacity: Math.min(1, Math.max(0, progress * 4)), transform: `translateY(${(1 - progress) * amplitude}px)`}}>{character === ' ' ? '\u00a0' : character}</span>;
    })}
  </span>;
};
