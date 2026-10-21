import type {MotionChildrenProps} from '../types';
import {useMotionProgress} from '../internal/useMotionProgress';

export type CardRevealProps = MotionChildrenProps & {tiltDegrees?: number; distance?: number};

export const CardReveal = ({children, tiltDegrees = 14, distance = 60, delayInFrames = 0, durationInFrames = 35, className, style}: CardRevealProps) => {
  const progress = useMotionProgress({delayInFrames, durationInFrames});
  return <div className={className} style={{opacity: progress, transform: `perspective(900px) translateY(${(1 - progress) * distance}px) rotateX(${(1 - progress) * tiltDegrees}deg) scale(${0.92 + 0.08 * progress})`, transformOrigin: 'center bottom', ...style}}>{children}</div>;
};
