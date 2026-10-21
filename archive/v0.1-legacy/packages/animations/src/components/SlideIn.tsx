import type {MotionChildrenProps} from '../types';
import {useMotionProgress} from '../internal/useMotionProgress';

export type SlideDirection = 'up' | 'down' | 'left' | 'right';
export type SlideInProps = MotionChildrenProps & {direction?: SlideDirection; distance?: number};

const offsets: Record<SlideDirection, [number, number]> = {
  up: [0, 1], down: [0, -1], left: [1, 0], right: [-1, 0],
};

export const SlideIn = ({children, direction = 'up', distance = 80, delayInFrames = 0, durationInFrames = 30, style, className}: SlideInProps) => {
  const progress = useMotionProgress({delayInFrames, durationInFrames});
  const [x, y] = offsets[direction];
  return <div className={className} style={{opacity: progress, transform: `translate3d(${x * distance * (1 - progress)}px, ${y * distance * (1 - progress)}px, 0)`, ...style}}>{children}</div>;
};
