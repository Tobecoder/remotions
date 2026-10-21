import type {DemoId} from './catalog';
import {splitGraphemes} from '@remotions/animations';

/** Keep the end of the last staggered character in view before looping. */
export const previewFrames = (
  id: DemoId,
  headline: string,
  durationInFrames: number,
  delayInFrames: number,
): number => {
  const wordCount = headline.trim() ? headline.trim().split(/\s+/u).length : 0;
  const stagger = id === 'wave' ? Math.max(0, splitGraphemes(headline).length - 1) * 3
    : id === 'words' ? Math.max(0, wordCount - 1) * 5
    : 0;
  return Math.max(30, delayInFrames + durationInFrames + stagger + 18);
};
