import {useCurrentFrame, useVideoConfig} from 'remotion';
import {progressAtFrame} from '../internal/math';
import {splitGraphemes} from '../internal/graphemes';
import type {MotionStyleProps} from '../types';

export type TypewriterProps = MotionStyleProps & {text: string; cursor?: boolean; cursorCharacter?: string};

export const Typewriter = ({text, cursor = true, cursorCharacter = '|', delayInFrames = 0, durationInFrames = 50, className, style}: TypewriterProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const graphemes = splitGraphemes(text);
  const visible = Math.min(graphemes.length, Math.floor(progressAtFrame(frame, delayInFrames, durationInFrames) * graphemes.length));
  const blinkOn = Math.floor((frame / fps) * 2) % 2 === 0;
  return <span className={className} role="text" aria-label={text} style={{whiteSpace: 'pre-wrap', ...style}}>
    <span aria-hidden="true">{graphemes.slice(0, visible).join('')}</span>
    {cursor && <span aria-hidden="true" style={{opacity: blinkOn ? 1 : 0}}>{cursorCharacter}</span>}
  </span>;
};
