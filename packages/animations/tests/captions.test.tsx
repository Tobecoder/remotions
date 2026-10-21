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
    expect(rounded).toContain('data-caption-shape="glyph-bubble"');
    expect(pill).toContain('data-caption-shape="glyph-bubble"');
    expect(rounded).toContain('stroke-linejoin="round"');
    expect(pill).toContain('stroke-linejoin="round"');
    expect(rounded).not.toMatch(/NaN|Infinity/);
    expect(pill).not.toMatch(/NaN|Infinity/);
  });
});
