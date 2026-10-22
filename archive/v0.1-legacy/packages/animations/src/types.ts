import type {CSSProperties, ReactNode} from 'react';

/** All durations and delays are measured in video frames, not milliseconds. */
export type MotionTiming = {
  delayInFrames?: number;
  durationInFrames?: number;
};

export type MotionChildrenProps = MotionTiming & {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type MotionStyleProps = MotionTiming & {
  className?: string;
  style?: CSSProperties;
};
