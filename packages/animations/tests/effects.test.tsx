import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import {ParticleField, PulseRings, ShimmerSweep} from '../src';

const clock = vi.hoisted(() => ({frame: 0}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: 30}),
}));

describe('visual effect components', () => {
  it.each([
    ['PulseRings', <PulseRings width={640} height={260} />],
    ['ParticleField', <ParticleField width={640} height={260} />],
    ['ShimmerSweep', <ShimmerSweep width={640} height={260} />],
  ])('%s changes with the current frame without invalid SVG values', (_, component) => {
    clock.frame = 0;
    const first = renderToStaticMarkup(component);
    clock.frame = 45;
    const later = renderToStaticMarkup(component);
    expect(first).toContain('role="img"');
    expect(first).not.toMatch(/NaN|Infinity/);
    expect(later).not.toBe(first);
  });

  it('keeps compact dimensions valid', () => {
    const markup = renderToStaticMarkup(<ParticleField width={1} height={1} />);
    expect(markup).not.toMatch(/NaN|Infinity/);
    expect(markup).toContain('width="1"');
    expect(markup).toContain('height="1"');
  });

  it('closes the ParticleField geometry at its eight-second boundary', () => {
    clock.frame = 0;
    const first = renderToStaticMarkup(<ParticleField width={640} height={260} />);
    clock.frame = 240;
    const looped = renderToStaticMarkup(<ParticleField width={640} height={260} />);
    expect(looped).toBe(first);
  });
});
