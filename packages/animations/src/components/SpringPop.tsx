import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {MotionChildrenProps} from '../types';

export type SpringPopProps = MotionChildrenProps & {fromScale?: number; damping?: number; stiffness?: number; mass?: number};

export const SpringPop = ({children, fromScale = 0.35, damping = 12, stiffness = 130, mass = 1, delayInFrames = 0, durationInFrames = 40, style, className}: SpringPopProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({fps, frame: frame - delayInFrames, durationInFrames: Math.max(1, durationInFrames), config: {damping, stiffness, mass}});
  const scale = fromScale + (1 - fromScale) * progress;
  return <div className={className} style={{opacity: Math.min(1, Math.max(0, progress * 3)), transform: `scale(${scale})`, ...style}}>{children}</div>;
};
