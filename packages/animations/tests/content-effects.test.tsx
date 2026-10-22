import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import {Peel, Shine, TearApart, WigglingCallout} from '../src';
import {getContentEffectChain, loadContentEffectEngine} from '../src/components/ContentEffects';

const clock = vi.hoisted(() => ({frame: 0, fps: 30}));
const delays = vi.hoisted(() => ({delayRender: vi.fn(() => 1), continueRender: vi.fn(), cancelRender: vi.fn()}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: clock.fps}),
  useDelayRender: () => delays,
}));

describe('source-style content effects', () => {
  it('wiggles around the pointer and settles without shrinking or losing the text', () => {
    const first = renderToStaticMarkup(<WigglingCallout progress={0} text="-20%" />);
    const tilted = renderToStaticMarkup(<WigglingCallout progress={7 / 119} />);
    const settled = renderToStaticMarkup(<WigglingCallout progress={1} />);
    expect(first).toContain('rotate(0)');
    expect(tilted).toContain('rotate(10)');
    expect(settled).toContain('rotate(0)');
    expect(settled).toContain('-20%');
    expect(settled).not.toMatch(/NaN|Infinity/);
  });

  it('preserves the source aspect ratio and accepts a custom callout color', () => {
    const markup = renderToStaticMarkup(<WigglingCallout width={640} height={260} color="#ff0000" text="NEW" />);
    expect(markup).toContain('viewBox="0 0 760 760"');
    expect(markup).not.toContain('preserveAspectRatio="none"');
    expect(markup).toContain('fill="#ff0000"');
    expect(markup).toContain('NEW');
  });

  it.each([24, 30, 60])('uses FPS, speed, and controlled progress consistently at %s FPS', (fps) => {
    clock.fps = fps;
    clock.frame = Math.round(fps * 2) - 1;
    expect(renderToStaticMarkup(<Peel />)).toContain('data-progress="1"');
    clock.frame = 0;
    expect(renderToStaticMarkup(<Peel progress={0.5} />)).toContain('data-progress="0.5"');
    clock.frame = fps;
    expect(renderToStaticMarkup(<Peel speed={2} />)).toContain('data-progress="1"');
    clock.fps = 30;
  });

  it.each([Peel, Shine, TearApart])('keeps invalid dimensions and duration away from the canvas engine', (Component) => {
    const markup = renderToStaticMarkup(<Component width={NaN} height={Infinity} durationInSeconds={NaN} speed={Infinity} />);
    expect(markup).toContain('width:1px;height:1px');
    expect(markup).not.toMatch(/NaN|Infinity/);
  });

  it('uses the actual official page-turn factory, including front and back shading', async () => {
    const engine = await loadContentEffectEngine();
    const first = getContentEffectChain(engine, 'peel', 0, 1280, 720);
    const middle = getContentEffectChain(engine, 'peel', 0.475, 1280, 720);
    const end = getContentEffectChain(engine, 'peel', 1, 1280, 720);
    expect(first[0].params).toMatchObject({scale: 0.75});
    expect(first[1].params).toMatchObject({foldPosition: [1.25, 0.5]});
    expect(middle[1].params).toMatchObject({foldPosition: [0.4, 0.5], foldDirection: -75, foldRadius: 70, paperColor: '#fff', backPageOpacity: 0.1});
    expect(end[1].params).toMatchObject({foldPosition: [expect.closeTo(-0.45), 0.5]});
    expect(middle[1].definition.backend).toBe('webgpu');
  });

  it('scales pixel-based curl, light, and tear parameters with preview resolution', async () => {
    const engine = await loadContentEffectEngine();
    expect(getContentEffectChain(engine, 'peel', 0.5, 640, 360)[1].params).toMatchObject({foldRadius: 35});
    expect(getContentEffectChain(engine, 'shine', 0.5, 640, 360)[1].params).toMatchObject({haloSigma: 100, coreSigma: 32.5, progress: 0.5});
    expect(getContentEffectChain(engine, 'tear', 1, 640, 360)[1].params).toMatchObject({jaggedness: 12, rotation: expect.closeTo(5, 5), progress: expect.closeTo(1, 5)});
    expect(getContentEffectChain(engine, 'tear', 0, 640, 360)[1].params).toMatchObject({progress: 0, rotation: 0});
  });

});
