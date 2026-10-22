import {renderToStaticMarkup} from 'react-dom/server';
import type {CSSProperties} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {PictureInPictureTransition, ProductCollection, RotatingCards, SlideToSplitScreen} from '../src';

const clock = vi.hoisted(() => ({frame: 0}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: 30}),
  Img: ({src, style}: {src: string; style?: CSSProperties}) => <img src={src} style={style} alt="" />,
}));

describe('layout components', () => {
  it.each([
    ['PictureInPictureTransition', <PictureInPictureTransition width={640} height={260} />],
    ['SlideToSplitScreen', <SlideToSplitScreen width={640} height={260} />],
    ['RotatingCards', <RotatingCards width={640} height={260} />],
    ['ProductCollection', <ProductCollection width={640} height={260} />],
  ])('%s is frame-driven and keeps its markup finite', (_, component) => {
    clock.frame = 0;
    const first = renderToStaticMarkup(component);
    clock.frame = 45;
    const later = renderToStaticMarkup(component);
    expect(first).toContain('data-layout=');
    expect(first).not.toMatch(/NaN|Infinity/);
    expect(later).not.toBe(first);
  });

  it('supports externally controlled progress', () => {
    clock.frame = 0;
    const start = renderToStaticMarkup(<PictureInPictureTransition width={640} height={260} progress={0} />);
    const end = renderToStaticMarkup(<PictureInPictureTransition width={640} height={260} progress={1} />);
    expect(start).not.toBe(end);

    const productStart = renderToStaticMarkup(<ProductCollection width={640} height={260} progress={0} />);
    const productMiddle = renderToStaticMarkup(<ProductCollection width={640} height={260} progress={0.5} />);
    expect(productStart).not.toBe(productMiddle);
  });

  it('can keep the ProductCollection visible when a preview holds the last frame', () => {
    const sourceFade = renderToStaticMarkup(<ProductCollection width={640} height={260} progress={1} />);
    const visibleEnd = renderToStaticMarkup(<ProductCollection width={640} height={260} progress={1} fadeOut={false} />);
    expect(sourceFade).toContain('opacity:0');
    expect(visibleEnd).toContain('opacity:1');
  });

  it('falls back to finite dimensions for invalid input', () => {
    const markup = renderToStaticMarkup(<SlideToSplitScreen width={Number.NaN} height={Number.POSITIVE_INFINITY} durationInSeconds={Number.NaN} speed={Number.NaN} />);
    expect(markup).not.toMatch(/NaN|Infinity/);
    expect(markup).toContain('width:1px');
    expect(markup).toContain('height:1px');
  });
});
