import {renderToStaticMarkup} from 'react-dom/server';
import type {ComponentProps} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {NewsArticleHighlight, OnScreenMessages, PolaroidPictures, SpeedLines} from '../src';

const clock = vi.hoisted(() => ({frame: 0, fps: 30}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: clock.fps}),
  // Image loading is exercised in the real Player; these tests inspect layout and timing.
  Img: (props: ComponentProps<'img'>) => <img {...props} />,
}));
const markup = renderToStaticMarkup;

describe('reference-style storytelling', () => {
  it('reveals messages in order and keeps incoming/outgoing colors and tail shapes', () => {
    const messages = [{text: 'First', from: 'them'}, {text: 'Second', from: 'me'}, {text: 'Third', from: 'them'}] as const;
    const first = markup(<OnScreenMessages progress={0} messages={messages} />);
    const middle = markup(<OnScreenMessages progress={15 / 161} messages={messages} />);
    const end = markup(<OnScreenMessages progress={1} messages={messages} color="#123456" />);
    expect((first.match(/opacity:0;/g) ?? []).length).toBe(3);
    expect((middle.match(/opacity:1;/g) ?? []).length).toBe(1);
    expect((end.match(/opacity:1;/g) ?? []).length).toBe(3);
    expect(end).toContain('#123456');
    expect(end).toContain('#e5e5ea');
    expect(end).toContain('M0 0h20');
    expect(end).toContain('M32 0H12');
    expect(end.indexOf('First')).toBeLessThan(end.indexOf('Second'));
    expect(end.indexOf('Second')).toBeLessThan(end.indexOf('Third'));
  });

  it('preserves empty conversations/photos instead of injecting demonstration content', () => {
    expect(markup(<OnScreenMessages messages={[]} progress={1} />)).not.toContain('data-story-message=');
    expect(markup(<PolaroidPictures photos={[]} progress={0.5} />)).not.toContain('<img');
  });

  it('fits long messages and custom photo collections without discarding items', () => {
    const messages = Array.from({length: 12}, (_, i) => ({text: `消息${i}${'长文'.repeat(30)}`, from: 'me' as const}));
    const output = markup(<OnScreenMessages width={640} height={260} messages={messages} progress={1} />);
    expect((output.match(/data-story-message=/g) ?? []).length).toBe(12);
    expect(output).toContain('消息11');
    expect(output).not.toMatch(/NaN|Infinity/);
    const photos = Array.from({length: 5}, (_, i) => ({src: `photo-${i}.png`, caption: `Caption ${i}`}));
    const photosOutput = markup(<PolaroidPictures photos={photos} progress={0.5} />);
    expect((photosOutput.match(/data-story-photo=/g) ?? []).length).toBe(5);
    expect(photosOutput).toContain('photo-4.png');
    expect(photosOutput).not.toContain('>A<');
  });

  it('uses independent marker reveals and preserves literal headline text', () => {
    const props = {headline: '把灵感变成故事，也让故事被看见', highlights: ['变成故事', '被看见'], summary: '摘要'};
    const first = markup(<NewsArticleHighlight {...props} progress={0} />);
    const middle = markup(<NewsArticleHighlight {...props} progress={58 / 149} />);
    const later = markup(<NewsArticleHighlight {...props} progress={90 / 149} />);
    expect((first.match(/inset\(0 100% 0 0\)/g) ?? []).length).toBe(7);
    expect((middle.match(/inset\(0 0% 0 0\)/g) ?? []).length).toBe(4);
    expect((later.match(/inset\(0 0% 0 0\)/g) ?? []).length).toBe(7);
    const literal = markup(<NewsArticleHighlight headline="A.* + B?" highlights={['.*', 'B?']} progress={0.5} />);
    expect(literal).not.toMatch(/NaN|Infinity/);
    expect(literal).toContain('data-story-highlight=');
  });

  it('supports absent/overlapping phrases and long words without invalid geometry', () => {
    expect(markup(<NewsArticleHighlight headline="" highlights={['', 'absent']} />)).not.toContain('data-story-highlight=');
    const long = markup(<NewsArticleHighlight headline={'A'.repeat(500)} highlights={['A'.repeat(40), 'A']} progress={0.7} />);
    expect(long).not.toMatch(/NaN|Infinity/);
    expect(long).toContain('overflow-wrap:anywhere');
  });

  it('uses taped paper cards with staggered positions, drift, and a configurable exit', () => {
    const first = markup(<PolaroidPictures progress={0} />);
    const middle = markup(<PolaroidPictures progress={0.5} />);
    const end = markup(<PolaroidPictures progress={1} />);
    const held = markup(<PolaroidPictures progress={1} fadeOut={false} />);
    expect((middle.match(/data-story-tape=/g) ?? []).length).toBe(3);
    expect(middle).toContain('rotate:-8deg');
    expect(middle).toContain('rotate:6deg');
    expect(first).not.toBe(middle);
    expect((end.match(/opacity:0;/g) ?? []).length).toBe(3);
    expect((held.match(/opacity:1;/g) ?? []).length).toBe(3);
    expect(markup(<NewsArticleHighlight progress={1} />)).toContain('opacity:0');
    expect(markup(<NewsArticleHighlight progress={1} fadeOut={false} />)).toContain('opacity:1');
  });

  it('draws deterministic triangular rays with a quiet center and a complete fade', () => {
    const middle = markup(<SpeedLines width={640} height={260} progress={0.5} />);
    expect((middle.match(/<path /g) ?? []).length).toBe(56);
    expect(middle).toBe(markup(<SpeedLines width={640} height={260} progress={0.5} />));
    expect(middle).not.toBe(markup(<SpeedLines width={640} height={260} progress={0.65} />));
    expect(markup(<SpeedLines progress={0} />)).toContain('opacity="0"');
    expect(markup(<SpeedLines progress={1} />)).toContain('opacity="0"');
    const tips = [...middle.matchAll(/d="M ([\d.e+-]+) ([\d.e+-]+)/g)];
    expect(tips).toHaveLength(56);
    for (const tip of tips) {
      const distance = Math.hypot((Number(tip[1]) - 320) / 320, (Number(tip[2]) - 130) / 130);
      expect(distance).toBeGreaterThanOrEqual(0.36);
      expect(distance).toBeLessThanOrEqual(0.58);
    }
  });

  it.each([24, 30, 60])('keeps equivalent progress at %s FPS and respects speed/controlled progress', (fps) => {
    clock.fps = fps;
    clock.frame = Math.round(5 * fps) - 1;
    expect(markup(<PolaroidPictures />)).toBe(markup(<PolaroidPictures progress={1} />));
    clock.frame = 0;
    expect(markup(<OnScreenMessages progress={0.5} />)).toContain('opacity:1;');
    clock.frame = Math.ceil((5 * fps - 1) / 2);
    expect(markup(<NewsArticleHighlight speed={2} />)).toBe(markup(<NewsArticleHighlight progress={1} />));
    clock.frame = 0;
    clock.fps = 30;
  });

  it.each([NewsArticleHighlight, OnScreenMessages, PolaroidPictures, SpeedLines])('sanitizes non-finite sizes and timing', (Component) => {
    expect(markup(<Component width={NaN} height={Infinity} durationInSeconds={NaN} speed={Infinity} progress={NaN} />)).not.toMatch(/NaN|Infinity/);
  });
});
