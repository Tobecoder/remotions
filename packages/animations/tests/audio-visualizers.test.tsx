import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import {MirroredSpectrum, Oscilloscope, VoiceNote} from '../src';

const clock = vi.hoisted(() => ({frame: 10}));
const spectrumState = vi.hoisted(() => ({override: null as number[] | null}));
const waveformState = vi.hoisted(() => ({silent: false}));
const audioDataHook = vi.hoisted(() => vi.fn(() => ({loaded: true, durationInSeconds: 42})));
const waveformPortion = vi.hoisted(() => vi.fn(({numberOfSamples, outputRange}: {numberOfSamples: number; outputRange: string}) =>
  Array.from({length: numberOfSamples}, (_, index) => ({
    index,
    amplitude: waveformState.silent
      ? 0
      : outputRange === 'minus-one-to-one'
      ? Math.sin(index / 3 + clock.frame / 4) * 0.6
      : Math.abs(Math.sin(index / 3 + clock.frame / 4)) * 0.6,
  }))));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: 30}),
}));
vi.mock('@remotion/media-utils', () => ({
  useAudioData: audioDataHook,
  useWindowedAudioData: () => ({audioData: {loaded: true}, dataOffsetInSeconds: 0}),
  getWaveformPortion: waveformPortion,
  visualizeAudio: () => spectrumState.override ?? Array.from({length: 64}, (_, index) => (clock.frame + index % 8) / 100),
  createSmoothSvgPath: ({points}: {points: Array<{x: number; y: number}>}) =>
    points.map((point, index) => `${index ? 'L' : 'M'}${point.x},${point.y}`).join(' '),
}));

describe('audio-driven components', () => {
  it.each([
    ['Oscilloscope', <Oscilloscope src="/demo.wav" />],
    ['MirroredSpectrum', <MirroredSpectrum src="/demo.wav" />],
    ['VoiceNote', <VoiceNote src="/demo.wav" />],
  ])('%s responds to the current frame without invalid SVG values', (_, component) => {
    clock.frame = 10;
    const first = renderToStaticMarkup(component);
    clock.frame = 35;
    const later = renderToStaticMarkup(component);
    expect(first).toContain('role="img"');
    expect(first).not.toMatch(/NaN|Infinity/);
    expect(later).not.toBe(first);
  });

  it('renders two halves of the mirrored spectrum', () => {
    clock.frame = 20;
    const markup = renderToStaticMarkup(<MirroredSpectrum src="/demo.wav" />);
    expect((markup.match(/data-audio-bar="true"/g) ?? []).length).toBe(65);
  });

  it('keeps custom-width bar geometry valid', () => {
    const spectrum = renderToStaticMarkup(<MirroredSpectrum src="/demo.wav" width={80} height={120} />);
    const voice = renderToStaticMarkup(<VoiceNote src="/demo.wav" width={400} height={140} />);
    expect(spectrum).not.toMatch(/(?:width|height)="-(?:\d|\.)/);
    expect(voice).not.toMatch(/(?:width|height)="-(?:\d|\.)/);
    expect(spectrum).not.toMatch(/NaN|Infinity/);
    expect(voice).not.toMatch(/NaN|Infinity/);
  });

  it('keeps the oscilloscope path inside its viewport', () => {
    const markup = renderToStaticMarkup(<Oscilloscope src="/demo.wav" width={240} height={120} />);
    const path = markup.match(/<path[^>]* d="([^"]+)"/)?.[1] ?? '';
    const yValues = Array.from(path.matchAll(/,(-?\d+(?:\.\d+)?)/g), (match) => Number(match[1]));
    expect(yValues.length).toBeGreaterThan(0);
    expect(Math.min(...yValues)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...yValues)).toBeLessThanOrEqual(120);
  });

  it('keeps the full frequency range when the bar count shrinks', () => {
    spectrumState.override = Array.from({length: 64}, (_, index) => index === 63 ? 1 : 0);
    try {
      const markup = renderToStaticMarkup(<MirroredSpectrum src="/demo.wav" width={80} height={120} />);
      const barHeights = Array.from(markup.matchAll(/<div data-audio-bar="true"[^>]*height:(\d+(?:\.\d+)?)px/g), (match) => Number(match[1]));
      expect(barHeights).toHaveLength(8);
      expect(Math.max(...barHeights)).toBeGreaterThan(4);
    } finally {
      spectrumState.override = null;
    }
  });

  it('loads the complete source for the static voice waveform', () => {
    audioDataHook.mockClear();
    waveformPortion.mockClear();
    clock.frame = 30;
    const markup = renderToStaticMarkup(<VoiceNote src="/long-demo.wav" />);
    expect(audioDataHook).toHaveBeenCalledWith('/long-demo.wav');
    expect(waveformPortion.mock.calls.at(-1)?.[0]).toMatchObject({durationInSeconds: 42});
    const progressStops = Array.from(markup.matchAll(/<stop offset="([0-9.]+)%"/g), (match) => Number(match[1]));
    expect(progressStops[1]).toBeCloseTo((30 / (42 * 30 - 1)) * 100);
  });

  it('keeps a silent voice waveform at its minimum visual baseline', () => {
    waveformState.silent = true;
    try {
      const markup = renderToStaticMarkup(<VoiceNote src="/silent.wav" />);
      const heights = Array.from(markup.matchAll(/<rect[^>]* data-audio-bar="true"[^>]* height="(\d+(?:\.\d+)?)"/g), (match) => Number(match[1]));
      expect(heights.length).toBeGreaterThan(0);
      expect(Math.max(...heights)).toBe(8);
    } finally {
      waveformState.silent = false;
    }
  });
});
