import type {CSSProperties, HTMLAttributes, ReactNode} from 'react';
import {clamp, during, mix} from './motion';

export type TextFlipProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  frame: number;
  before: ReactNode;
  after: ReactNode;
  beforeScale?: number;
  firstAfterScale?: number;
  beforeStyle?: CSSProperties;
  afterStyle?: CSSProperties;
};

/** Folds inline content flat before frame zero, then unfolds its replacement. */
export const TextFlip = ({
  frame, before, after, beforeScale = 1, firstAfterScale = .28, beforeStyle, afterStyle, style, ...attributes
}: TextFlipProps) => {
  const replaced = frame >= 0;
  const closed = mix(1, .07, during(frame, -3, -1));
  const opening = clamp(firstAfterScale);
  const next = Math.max(opening, .98);
  const reopened = mix(opening, next, during(frame, 0, 1)) + (1 - next) * during(frame, 1, 2);

  return <span {...attributes} data-text-flip={replaced ? 'after' : 'before'} style={{
    display: 'inline-block', transformOrigin: '50% 52%', ...style, ...(replaced ? afterStyle : beforeStyle),
    transform: replaced ? `scaleY(${reopened})` : `scale(${beforeScale},${beforeScale * closed})`,
  }}>{replaced ? after : before}</span>;
};
