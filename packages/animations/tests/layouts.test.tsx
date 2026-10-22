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

const readTranslate = (markup: string) => {
  const match = markup.match(/translate:([^;\"]+)/);
  const values = match?.[1].trim().match(/^(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px$/);
  if (!values) throw new Error(`Could not read translate from ${markup}`);
  return {x: Number(values[1]), y: Number(values[2])};
};

const readClipRadius = (markup: string) => {
  const match = markup.match(/clip-path:inset\([^;\"]*round ([\d.]+)px\)/);
  if (!match) throw new Error(`Could not read clip radius from ${markup}`);
  return Number(match[1]);
};

const readProductCollectionContainer = (markup: string) => {
  const match = markup.match(/<div(?=[^>]*data-product-collection-container="true")[^>]*>/);
  if (!match) throw new Error(`Could not find ProductCollection container in ${markup}`);
  return match[0];
};

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
    expect(readProductCollectionContainer(sourceFade)).toContain('opacity:0');
    expect(readProductCollectionContainer(visibleEnd)).toContain('opacity:1');
  });

  it('uses explicit PiP padding as the final edge margin for every inset position', () => {
    const width = 1920;
    const height = 1080;
    const padding = 20;
    const positions = [
      {insetPosition: 'top-left' as const, left: true, top: true},
      {insetPosition: 'top-right' as const, left: false, top: true},
      {insetPosition: 'bottom-left' as const, left: true, top: false},
      {insetPosition: 'bottom-right' as const, left: false, top: false},
    ];

    for (const insetScale of [0.38, 0.72]) {
      const visibleLeft = width * 0.302 * insetScale;
      const visibleRight = width * (1 - 0.302) * insetScale;
      const visibleTop = height * 0.06 * insetScale;
      const visibleBottom = height * (1 - 0.06) * insetScale;

      for (const position of positions) {
        const markup = renderToStaticMarkup(<PictureInPictureTransition width={width} height={height} progress={1} insetPosition={position.insetPosition} insetScale={insetScale} padding={padding} />);
        const {x, y} = readTranslate(markup);
        expect(x + (position.left ? visibleLeft : visibleRight)).toBeCloseTo(position.left ? padding : width - padding, 5);
        expect(y + (position.top ? visibleTop : visibleBottom)).toBeCloseTo(position.top ? padding : height - padding, 5);
      }
    }
  });

  it('applies corner radius to the visible PiP crop', () => {
    for (const [insetScale, cornerRadius] of [[0.38, 48], [0.72, 24]]) {
      const markup = renderToStaticMarkup(<PictureInPictureTransition width={1920} height={1080} progress={1} insetScale={insetScale} cornerRadius={cornerRadius} />);
      expect(readClipRadius(markup)).toBeCloseTo(cornerRadius / insetScale, 5);
    }
  });

  it('falls back to finite dimensions for invalid input', () => {
    const markup = renderToStaticMarkup(<SlideToSplitScreen width={Number.NaN} height={Number.POSITIVE_INFINITY} durationInSeconds={Number.NaN} speed={Number.NaN} />);
    expect(markup).not.toMatch(/NaN|Infinity/);
    expect(markup).toContain('width:1px');
    expect(markup).toContain('height:1px');
  });
});
