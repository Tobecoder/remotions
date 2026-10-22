import {describe, expect, it} from 'vitest';
import {getPreviewDurationInSeconds, getPreviewLoopMode, getPreviewStillFrame} from './catalog';
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

  it.each(['horizontal-bar-chart', 'line-chart', 'number-counter', 'pie-chart', 'vertical-bar-chart'] as const)('%s holds its final chart frame', (id) => {
    expect(getPreviewLoopMode(id)).toBe('forward-hold');
    const durationInFrames = getPreviewDurationInFrames(getPreviewDurationInSeconds(id), 30);
    expect(getPreviewFrame(999999, 30, durationInFrames, 'forward-hold')).toBe(durationInFrames - 1);
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

  it('holds the final frame for one-shot layout previews', () => {
    expect(getPreviewLoopDurationInFrames(150, 'forward-hold')).toBe(150);
    expect(getPreviewFrame(0, 30, 150, 'forward-hold')).toBe(0);
    expect(getPreviewFrame(4999, 30, 150, 'forward-hold')).toBe(149);
    expect(getPreviewFrame(999999, 30, 150, 'forward-hold')).toBe(149);
  });

  it.each(['location-lower-third', 'name-lower-third'] as const)('%s previews the complete entrance and exit with a visible resting frame', (id) => {
    expect(getPreviewLoopMode(id)).toBe('forward');
    expect(getPreviewDurationInSeconds(id)).toBe(4);
    expect(getPreviewStillFrame(id)).toBe(60);
    expect(getPreviewFrame(4000, 30, 120)).toBe(0);
  });
});
