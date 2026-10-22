import {describe, expect, it} from 'vitest';
import {getPreviewDurationInSeconds, getPreviewLoopMode} from './catalog';
import {getPreviewDurationInFrames, getPreviewFrame, getPreviewLoopDurationInFrames} from './previewTimeline';

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

  it.each(['liquid-contours', 'notebook-paper', 'paper-texture'] as const)('%s uses a ping-pong preview loop', (id) => {
    expect(getPreviewLoopMode(id)).toBe('ping-pong');
  });

  it('keeps audio, captions, and exact effect cycles playing forward', () => {
    expect(getPreviewLoopMode('oscilloscope')).toBe('forward');
    expect(getPreviewLoopMode('basic-captions')).toBe('forward');
    expect(getPreviewLoopMode('moving-waves')).toBe('forward');
    expect(getPreviewLoopMode('moving-zigzags')).toBe('forward');
    expect(getPreviewLoopMode('particle-field')).toBe('forward');
    expect(getPreviewLoopMode('rotating-starburst')).toBe('forward');
    expect(getPreviewLoopMode('shimmer-sweep')).toBe('forward');
  });

  it('turns around without jumping between the last and first preview frames', () => {
    const cycleFrames = 4;
    const totalFrames = getPreviewLoopDurationInFrames(cycleFrames, 'ping-pong');
    expect(totalFrames).toBe(6);
    expect(Array.from({length: totalFrames + 1}, (_, frame) => getPreviewFrame(frame / 30 * 1000, 30, cycleFrames, 'ping-pong'))).toEqual([0, 1, 2, 3, 2, 1, 0]);
  });
});
