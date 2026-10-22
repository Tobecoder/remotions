import {describe, expect, it} from 'vitest';
import {getPreviewDurationInSeconds} from './catalog';
import {getPreviewDurationInFrames, getPreviewFrame} from './previewTimeline';

describe('catalog preview timeline', () => {
  it.each([
    ['oscilloscope', 6],
    ['moving-waves', 8],
    ['pulse-rings', 4.5],
    ['shimmer-sweep', 5.5],
  ] as const)('uses the component cycle for %s', (id, seconds) => {
    expect(getPreviewDurationInSeconds(id)).toBe(seconds);
  });

  it.each([6, 8, 4.5, 5.5])('wraps only at the configured %s-second boundary', (seconds) => {
    const fps = 30;
    const durationInFrames = getPreviewDurationInFrames(seconds, fps);
    expect(getPreviewFrame(((durationInFrames - 1) / fps) * 1000, fps, durationInFrames)).toBe(durationInFrames - 1);
    expect(getPreviewFrame((durationInFrames / fps) * 1000, fps, durationInFrames)).toBe(0);
  });
});
