import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import {LiquidContours, MovingWaves, MovingZigzags, NotebookPaper, PaperTexture, RotatingStarburst} from '../src';
import {parseColor} from '../src/components/Backgrounds';

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
    ['MovingZigzags', <MovingZigzags width={640} height={360} />],
    ['NotebookPaper', <NotebookPaper width={640} height={360} />],
    ['PaperTexture', <PaperTexture width={640} height={360} />],
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

  it.each([
    ['MovingWaves', <MovingWaves width={640} height={360} />],
    ['MovingZigzags', <MovingZigzags width={640} height={360} />],
  ])('%s keeps a visible band at long frames', (_, component) => {
    for (const frame of [0, 300, 1500, 3000]) {
      clock.frame = frame;
      const markup = renderToStaticMarkup(component);
      const paths = Array.from(markup.matchAll(/<path[^>]* d="([^"]+)"/g), (match) => match[1]);
      const yValues = paths.flatMap((path) => Array.from(path.matchAll(/-?\d+(?:\.\d+)?/g), (match, index) => index % 2 === 1 ? Number(match[0]) : null).filter((value): value is number => value !== null));
      expect(yValues.some((value) => value >= 0 && value <= 360), `frame ${frame} should contain a visible band`).toBe(true);
    }
  });

  it('keeps the notebook grid offset within one cell at long frames', () => {
    clock.frame = 3000;
    const markup = renderToStaticMarkup(<NotebookPaper width={640} height={360} />);
    const offset = Number(markup.match(/<g transform="translate\([^ ]+ (-?\d+(?:\.\d+)?)\)"/)?.[1]);
    expect(Number.isFinite(offset)).toBe(true);
    expect(Math.abs(offset)).toBeLessThanOrEqual(48);
  });

  it('parses common CSS color inputs for liquid contours', () => {
    expect(parseColor('red')).toEqual([1, 0, 0, 1]);
    expect(parseColor('rgb(255, 128, 0)')).toEqual([1, 128 / 255, 0, 1]);
    expect(parseColor('rgba(0 64 255 / 50%)')).toEqual([0, 64 / 255, 1, 0.5]);
  });
});
