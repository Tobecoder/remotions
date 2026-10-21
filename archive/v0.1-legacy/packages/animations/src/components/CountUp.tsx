import {formatCount} from '../internal/math';
import {useMotionProgress} from '../internal/useMotionProgress';
import type {MotionStyleProps} from '../types';

export type CountUpProps = MotionStyleProps & {
  from?: number;
  to: number;
  decimals?: number;
  locale?: string;
  prefix?: string;
  suffix?: string;
};

export const CountUp = ({from = 0, to, decimals = 0, locale = 'en-US', prefix = '', suffix = '', delayInFrames = 0, durationInFrames = 45, className, style}: CountUpProps) => {
  const progress = useMotionProgress({delayInFrames, durationInFrames});
  const value = from + (to - from) * progress;
  return <span className={className} style={{fontVariantNumeric: 'tabular-nums', ...style}}>{prefix}{formatCount(value, decimals, locale)}{suffix}</span>;
};
