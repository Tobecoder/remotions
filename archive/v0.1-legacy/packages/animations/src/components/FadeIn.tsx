import type {MotionChildrenProps} from '../types';
import {useMotionProgress} from '../internal/useMotionProgress';

export type FadeInProps = MotionChildrenProps & {fromOpacity?: number};

/** Fade children into view on a predictable frame timeline. */
export const FadeIn = ({children, fromOpacity = 0, delayInFrames = 0, durationInFrames = 24, style, className}: FadeInProps) => {
  const progress = useMotionProgress({delayInFrames, durationInFrames});
  return <div className={className} style={{opacity: fromOpacity + (1 - fromOpacity) * progress, ...style}}>{children}</div>;
};
