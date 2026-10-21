import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import {MirroredSpectrum, Oscilloscope, VoiceNote} from '../src';

const clock = vi.hoisted(() => ({frame: 10}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: 30}),
}));
vi.mock('@remotion/media-utils', () => ({
  useWindowedAudioData: () => ({audioData: {loaded: true}, dataOffsetInSeconds: 0}),
  visualizeAudio: () => Array.from({length: 64}, (_, index) => (clock.frame + index % 8) / 100),
  visualizeAudioWaveform: ({numberOfSamples}: {numberOfSamples: number}) =>
    Array.from({length: numberOfSamples}, (_, index) => Math.sin(index / 3 + clock.frame / 4) * 0.6),
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
    expect((markup.match(/<rect /g) ?? []).length).toBe(96);
  });
});
