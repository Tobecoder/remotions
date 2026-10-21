import {numberBetween} from '../internal/math';
import {useMotionProgress} from '../internal/useMotionProgress';
import type {MotionStyleProps} from '../types';

export type ProgressRingProps = MotionStyleProps & {
  value: number;
  size?: number;
  strokeWidth?: number;
  fillColor?: string;
  trackColor?: string;
  showLabel?: boolean;
};

export const ProgressRing = ({value, size = 180, strokeWidth = 14, fillColor = '#8a7cff', trackColor = '#292939', showLabel = true, delayInFrames = 0, durationInFrames = 45, className, style}: ProgressRingProps) => {
  const progress = useMotionProgress({delayInFrames, durationInFrames});
  const visible = numberBetween(value, 0, 100) * progress;
  const radius = Math.max(0, (size - strokeWidth) / 2);
  const circumference = 2 * Math.PI * radius;
  return <div className={className} style={{width: size, height: size, position: 'relative', ...style}} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(visible)}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={fillColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - visible / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
    {showLabel && <span aria-hidden="true" style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: size / 5, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{Math.round(visible)}%</span>}
  </div>;
};
