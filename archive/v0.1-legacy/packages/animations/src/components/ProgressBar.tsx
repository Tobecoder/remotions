import {numberBetween} from '../internal/math';
import {useMotionProgress} from '../internal/useMotionProgress';
import type {MotionStyleProps} from '../types';

export type ProgressBarProps = MotionStyleProps & {
  value: number;
  width?: number | string;
  height?: number;
  fillColor?: string;
  trackColor?: string;
  rounded?: boolean;
};

export const ProgressBar = ({value, width = 360, height = 14, fillColor = '#8a7cff', trackColor = '#292939', rounded = true, delayInFrames = 0, durationInFrames = 45, className, style}: ProgressBarProps) => {
  const progress = useMotionProgress({delayInFrames, durationInFrames});
  const visible = numberBetween(value, 0, 100) * progress;
  return <div className={className} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(visible)} style={{width, height, background: trackColor, borderRadius: rounded ? 999 : 0, overflow: 'hidden', ...style}}>
    <div style={{width: `${visible}%`, height: '100%', background: fillColor, borderRadius: 'inherit'}} />
  </div>;
};
