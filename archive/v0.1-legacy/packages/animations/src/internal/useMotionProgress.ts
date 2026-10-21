import {useCurrentFrame} from 'remotion';
import {easeOutCubic, progressAtFrame} from './math';
import type {MotionTiming} from '../types';

/** Frame-derived progress; never depends on wall-clock time or React effects. */
export const useMotionProgress = (
  {delayInFrames = 0, durationInFrames = 30}: MotionTiming,
  easing: 'linear' | 'out' = 'out',
): number => {
  const frame = useCurrentFrame();
  const progress = progressAtFrame(frame, delayInFrames, durationInFrames);
  return easing === 'out' ? easeOutCubic(progress) : progress;
};
