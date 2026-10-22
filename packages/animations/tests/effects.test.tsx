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

  it('keeps the ShimmerSweep wrapped beam present at the forward loop boundary', () => {
    clock.frame = 0;
    const first = renderToStaticMarkup(<ShimmerSweep width={640} height={260} />);
    clock.frame = 164;
    const last = renderToStaticMarkup(<ShimmerSweep width={640} height={260} />);
    expect(first.match(/<path/g)?.length).toBe(last.match(/<path/g)?.length);
    const getBeamStarts = (markup: string) => Array.from(markup.matchAll(/<path d="M (-?\d+(?:\.\d+)?),0/g), (match) => Number(match[1]));
    const firstStarts = getBeamStarts(first);
    const lastStarts = getBeamStarts(last);
    expect(firstStarts).toHaveLength(6);
    expect(lastStarts).toHaveLength(6);
    const nearestWrappedBeam = Math.min(...firstStarts.flatMap((start) => lastStarts.map((candidate) => Math.abs(start - candidate))));
    expect(nearestWrappedBeam).toBeLessThan(8);
    expect(first).not.toMatch(/NaN|Infinity/);
    expect(last).not.toMatch(/NaN|Infinity/);
  });
});
