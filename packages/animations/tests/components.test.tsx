import {describe, expect, it, vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {
  CardReveal, CountUp, FadeIn, ProgressBar, ProgressRing, ScaleIn,
  SlideIn, SpringPop, Typewriter, WaveText, WordReveal,
} from '../src';

const clock = vi.hoisted(() => ({frame: 0, fps: 30}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: clock.fps}),
}));

const cases = [
  ['FadeIn', <FadeIn delayInFrames={10} durationInFrames={20}>Hello</FadeIn>],
  ['SlideIn', <SlideIn delayInFrames={10} durationInFrames={20}>Hello</SlideIn>],
  ['ScaleIn', <ScaleIn delayInFrames={10} durationInFrames={20}>Hello</ScaleIn>],
  ['SpringPop', <SpringPop delayInFrames={10} durationInFrames={20}>Hello</SpringPop>],
  ['Typewriter', <Typewriter text="Hello" delayInFrames={10} durationInFrames={20} cursor={false} />],
  ['WordReveal', <WordReveal text="Hello world" delayInFrames={10} durationInFrames={20} />],
  ['WaveText', <WaveText text="Hello" delayInFrames={10} durationInFrames={20} />],
  ['CountUp', <CountUp to={1234} delayInFrames={10} durationInFrames={20} />],
  ['ProgressBar', <ProgressBar value={86} delayInFrames={10} durationInFrames={20} />],
  ['ProgressRing', <ProgressRing value={86} delayInFrames={10} durationInFrames={20} />],
  ['CardReveal', <CardReveal delayInFrames={10} durationInFrames={20}>Hello</CardReveal>],
] as const;

describe('frame-driven components', () => {
  it.each(cases)('%s renders deterministically when frames are visited out of order', (_, element) => {
    clock.fps = 30;
    clock.frame = 20;
    const midpoint = renderToStaticMarkup(element);
    clock.frame = 100;
    const completed = renderToStaticMarkup(element);
    clock.frame = 0;
    const initial = renderToStaticMarkup(element);
    clock.frame = 20;
    expect(renderToStaticMarkup(element)).toBe(midpoint);
    expect(completed).not.toBe(initial);
    for (const html of [initial, midpoint, completed]) expect(html).not.toMatch(/NaN|Infinity/);
  });

  it('holds FadeIn during delay and completes at duration', () => {
    clock.frame = 9;
    expect(renderToStaticMarkup(<FadeIn delayInFrames={10} durationInFrames={20}>Hey</FadeIn>)).toContain('opacity:0');
    clock.frame = 30;
    expect(renderToStaticMarkup(<FadeIn delayInFrames={10} durationInFrames={20}>Hey</FadeIn>)).toContain('opacity:1');
  });

  it.each(['up', 'down', 'left', 'right'] as const)('moves SlideIn %s to the origin', (direction) => {
    clock.frame = 0;
    const initial = renderToStaticMarkup(<SlideIn direction={direction} distance={40} durationInFrames={10}>A</SlideIn>);
    expect(initial).toContain('40px');
    clock.frame = 10;
    expect(renderToStaticMarkup(<SlideIn direction={direction} durationInFrames={10}>A</SlideIn>)).toContain('translate3d(0px, 0px, 0)');
  });

  it('outputs formatted counter endpoints and counts down with decimals', () => {
    clock.frame = 0;
    expect(renderToStaticMarkup(<CountUp to={1234} durationInFrames={10} />)).toContain('>0</span>');
    clock.frame = 10;
    expect(renderToStaticMarkup(<CountUp to={1234} durationInFrames={10} />)).toContain('1,234');
    expect(renderToStaticMarkup(<CountUp from={10} to={-4.2} decimals={2} prefix="$" suffix="!" durationInFrames={10} />)).toContain('$-4.20!');
  });

  it('reveals joined emoji as one complete character', () => {
    clock.frame = 5;
    const halfway = renderToStaticMarkup(<Typewriter text="👩🏽‍💻X" durationInFrames={10} cursor={false} />);
    expect(halfway).toContain('👩🏽‍💻');
    expect(halfway).not.toContain('👩🏽‍💻X</span>');
    clock.frame = 10;
    expect(renderToStaticMarkup(<Typewriter text="👩🏽‍💻X" durationInFrames={10} cursor={false} />)).toContain('👩🏽‍💻X');
  });

  it('does not delay the first word after leading whitespace', () => {
    clock.frame = 10;
    const plain = renderToStaticMarkup(<WordReveal text="Hi" durationInFrames={10} />);
    const padded = renderToStaticMarkup(<WordReveal text="  Hi" durationInFrames={10} />);
    const firstWord = /<span aria-hidden="true" style="[^"]+">Hi<\/span>/;
    expect(padded.match(firstWord)?.[0]).toBe(plain.match(firstWord)?.[0]);
    expect(padded).toContain('opacity:1');
  });

  it.each([ProgressBar, ProgressRing])('clamps progress to the allowed range', (Component) => {
    clock.frame = 20;
    expect(renderToStaticMarkup(<Component value={180} durationInFrames={10} />)).toContain('aria-valuenow="100"');
    expect(renderToStaticMarkup(<Component value={-20} durationInFrames={10} />)).toContain('aria-valuenow="0"');
    clock.frame = 0;
    expect(renderToStaticMarkup(<Component value={86} delayInFrames={10} />)).toContain('aria-valuenow="0"');
  });

  it.each([24, 30, 60])('settles springs at %i fps and stays hidden before delay', (fps) => {
    clock.fps = fps;
    clock.frame = 0;
    expect(renderToStaticMarkup(<SpringPop delayInFrames={10}>Hi</SpringPop>)).toContain('opacity:0');
    expect(renderToStaticMarkup(<WaveText delayInFrames={10} text="👩🏽‍💻" />)).toContain('opacity:0');
    clock.frame = 100;
    expect(renderToStaticMarkup(<SpringPop delayInFrames={10}>Hi</SpringPop>)).toContain('scale(1)');
    expect(renderToStaticMarkup(<WaveText delayInFrames={10} text="👩🏽‍💻" />)).toContain('translateY(0px)');
  });
});
