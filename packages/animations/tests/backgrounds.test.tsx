import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import {LiquidContours, MovingWaves, RotatingStarburst} from '../src';

const clock = vi.hoisted(() => ({frame: 0}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: 30}),
}));

describe('background components', () => {
  it.each([
    ['LiquidContours', <LiquidContours width={640} height={360} />],
    ['MovingWaves', <MovingWaves width={640} height={360} />],
    ['RotatingStarburst', <RotatingStarburst width={640} height={360} />],
  ])('%s changes with the current frame without invalid SVG values', (_, component) => {
    clock.frame = 0;
    const first = renderToStaticMarkup(component);
    clock.frame = 45;
    const later = renderToStaticMarkup(component);
    expect(first).toContain('role="img"');
    expect(first).not.toMatch(/NaN|Infinity/);
    expect(later).not.toBe(first);
  });

  it('keeps the background components usable at compact dimensions', () => {
    const markup = renderToStaticMarkup(<LiquidContours width={1} height={1} />);
    expect(markup).not.toMatch(/NaN|Infinity/);
    expect(markup).toContain('width="1"');
    expect(markup).toContain('height="1"');
  });
});
