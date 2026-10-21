import {useCurrentFrame} from 'remotion';
import {easeOutCubic, progressAtFrame} from '../internal/math';
import type {MotionStyleProps} from '../types';

export type WordRevealProps = MotionStyleProps & {text: string; staggerInFrames?: number; distance?: number};

export const WordReveal = ({text, staggerInFrames = 6, distance = 36, delayInFrames = 0, durationInFrames = 20, className, style}: WordRevealProps) => {
  const frame = useCurrentFrame();
  let wordIndex = 0;
  return <span className={className} role="text" aria-label={text} style={{whiteSpace: 'pre-wrap', ...style}}>
    {text.split(/(\s+)/).map((part, i) => {
      if (!part || /^\s+$/.test(part)) return <span key={i} aria-hidden="true">{part}</span>;
      const current = wordIndex++;
      const progress = easeOutCubic(progressAtFrame(frame, delayInFrames + current * staggerInFrames, durationInFrames));
      return <span key={i} aria-hidden="true" style={{display: 'inline-block', opacity: progress, transform: `translateY(${(1 - progress) * distance}px)`}}>{part}</span>;
    })}
  </span>;
};
