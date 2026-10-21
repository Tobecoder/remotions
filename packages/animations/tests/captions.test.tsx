import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import type {Caption} from '@remotion/captions';
import {BasicCaptions, MovingPillCaptions, PoppingWordCaptions, RoundedCaptions, WordHighlightCaptions} from '../src';

const clock = vi.hoisted(() => ({frame: 0}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: 30}),
}));

const captions: Caption[] = [
  {text: '让素材', startMs: 0, endMs: 900, timestampMs: 450, confidence: null},
  {text: ' 随时可用', startMs: 900, endMs: 1800, timestampMs: 1350, confidence: null},
];

describe('caption components', () => {
  it.each([
    ['BasicCaptions', <BasicCaptions captions={captions} width={640} height={260} />],
    ['RoundedCaptions', <RoundedCaptions captions={captions} width={640} height={260} />],
    ['MovingPillCaptions', <MovingPillCaptions captions={captions} width={640} height={260} />],
    ['PoppingWordCaptions', <PoppingWordCaptions captions={captions} width={640} height={260} />],
    ['WordHighlightCaptions', <WordHighlightCaptions captions={captions} width={640} height={260} />],
  ])('%s responds to the current frame without invalid SVG values', (_, component) => {
    clock.frame = 5;
    const first = renderToStaticMarkup(component);
    clock.frame = 25;
    const later = renderToStaticMarkup(component);
    expect(first).toContain('role="img"');
    expect(first).not.toMatch(/NaN|Infinity/);
    expect(later).not.toBe(first);
  });

  it('keeps empty captions and compact dimensions valid', () => {
    const markup = renderToStaticMarkup(<RoundedCaptions captions={[]} width={1} height={1} />);
    expect(markup).toContain('width="1"');
    expect(markup).toContain('height="1"');
    expect(markup).not.toMatch(/NaN|Infinity/);
  });

  it('constrains long captions inside narrow rounded and pill previews', () => {
    const longCaptions: Caption[] = [
      {text: '这是一段很长的字幕需要留在卡片内部', startMs: 0, endMs: 1200, timestampMs: 600, confidence: null},
    ];
    const rounded = renderToStaticMarkup(<RoundedCaptions captions={longCaptions} width={240} height={120} />);
    const pill = renderToStaticMarkup(<MovingPillCaptions captions={longCaptions} width={240} height={120} />);
    expect(rounded).toContain('data-caption-shape="bubble-background"');
    expect(pill).toContain('data-caption-shape="bubble-background"');
    expect(rounded).not.toContain('data-caption-shape="glyph-bubble"');
    expect(pill).not.toContain('data-caption-shape="glyph-bubble"');
    expect(rounded).not.toMatch(/NaN|Infinity/);
    expect(pill).not.toMatch(/NaN|Infinity/);
  });

  it('keeps the bubble edge close to the active caption', () => {
    const changingCaptions: Caption[] = [
      {text: '短句', startMs: 0, endMs: 900, timestampMs: 450, confidence: null},
      {text: '这是一段更长的字幕', startMs: 900, endMs: 1800, timestampMs: 1350, confidence: null},
    ];
    const firstBubbleX = (markup: string) => Number(markup.match(/data-caption-shape="bubble-background" d="M ([0-9.-]+)/)?.[1]);
    clock.frame = 5;
    const shortMarkup = renderToStaticMarkup(<RoundedCaptions captions={changingCaptions} width={240} height={120} />);
    clock.frame = 35;
    const longMarkup = renderToStaticMarkup(<RoundedCaptions captions={changingCaptions} width={240} height={120} />);
    expect(firstBubbleX(shortMarkup)).toBeGreaterThan(firstBubbleX(longMarkup));
  });

  it('fits long character captions instead of stacking glyphs', () => {
    const longCaptions: Caption[] = [
      {text: '一二三四五六七八九十甲乙丙丁戊己庚辛壬癸', startMs: 0, endMs: 1200, timestampMs: 600, confidence: null},
    ];
    const popping = renderToStaticMarkup(<PoppingWordCaptions captions={longCaptions} width={240} height={120} />);
    const highlight = renderToStaticMarkup(<WordHighlightCaptions captions={longCaptions} width={240} height={120} />);
    const maxFontSize = (markup: string) => Math.max(...Array.from(markup.matchAll(/font-size="([0-9.]+)"/g), (match) => Number(match[1])));
    expect(maxFontSize(popping)).toBeLessThan(62);
    expect(maxFontSize(highlight)).toBeLessThan(62);
    expect(highlight).toContain('letter-spacing:0.9px');
  });
});
