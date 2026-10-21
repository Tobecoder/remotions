import type {MotionChildrenProps} from '../types';
import {useMotionProgress} from '../internal/useMotionProgress';

export type ScaleInProps = MotionChildrenProps & {fromScale?: number; transformOrigin?: string};

export const ScaleIn = ({children, fromScale = 0.5, transformOrigin = 'center', delayInFrames = 0, durationInFrames = 30, style, className}: ScaleInProps) => {
  const progress = useMotionProgress({delayInFrames, durationInFrames});
  return <div className={className} style={{opacity: progress, transform: `scale(${fromScale + (1 - fromScale) * progress})`, transformOrigin, ...style}}>{children}</div>;
};
