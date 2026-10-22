import type {ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {CircleMarker, CrossedOffText, CylinderText, SpinningTextWheel, StrikeThroughText, TextMarker} from '../src';

const clock = vi.hoisted(() => ({frame: 0, fps: 30}));
vi.mock('remotion', async (original) => ({
  ...await original<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: clock.fps}),
  CanvasImage: ({src, effects}: {src: string; effects: unknown}) => <div data-texture={src} data-effects={JSON.stringify(effects)} />,
}));
vi.mock('../src/components/TextEffectsRuntime', () => {
  const annotation = (kind: string) => ({children, ...props}: {children: ReactNode}) => <span data-native={kind} data-params={JSON.stringify(props)}>{children}</span>;
  const annotations = {Circle: annotation('circle'), CrossedOff: annotation('cross'), StrikeThrough: annotation('strike'), Highlight: annotation('highlight')};
  const cylinder = {cylinder: (params: unknown) => params};
  const loadTextAnnotations = () => Promise.resolve(annotations);
  const loadCylinderEffect = () => Promise.resolve(cylinder);
  return {loadTextAnnotations, loadCylinderEffect, useTextEffectResource: (loader: unknown) => loader === loadTextAnnotations ? annotations : cylinder};
});
const render = renderToStaticMarkup;
beforeEach(() => {clock.frame = 0; clock.fps = 30;});

describe('Elements text effects', () => {
  it.each([CircleMarker, CrossedOffText, StrikeThroughText, TextMarker])('keeps literal text, absent phrases, and explicit empty input: %s', (Component) => {
    const output = render(<Component text="A.* + B?" markedText=".*" progress={0.5} />);
    expect(output).toContain('data-native=');
    expect(output).toContain('.*');
    expect(render(<Component text="unchanged" markedText="missing" />)).not.toContain('data-native=');
    expect(render(<Component text="" markedText="" />)).not.toContain('data-native=');
  });

  it('retains reference colors, crossed-off iterations, and stroke widths', () => {
    expect(render(<CircleMarker progress={1} />)).toContain('&quot;strokeWidth&quot;:12');
    expect(render(<CrossedOffText progress={1} />)).toContain('&quot;iterations&quot;:10');
    expect(render(<StrikeThroughText progress={1} />)).toContain('&quot;strokeWidth&quot;:14');
    expect(render(<TextMarker progress={1} />)).toContain('rgba(255, 236, 79, 0.62)');
    expect(render(<CircleMarker progress={1} color="red" textColor="green" />)).toContain('&quot;color&quot;:&quot;red&quot;');
  });

  it('starts crossed-off and strike-through at their own times and holds the finished ink', () => {
    expect(render(<CrossedOffText progress={17 / 119} />)).toContain('data-annotation-progress="0"');
    expect(render(<CrossedOffText progress={39 / 119} />)).toContain('data-annotation-progress="1"');
    expect(render(<StrikeThroughText progress={9 / 119} />)).toContain('data-annotation-progress="0"');
    expect(render(<StrikeThroughText progress={25 / 119} />)).toContain('data-annotation-progress="1"');
    expect(render(<CircleMarker progress={1} />)).toContain('data-annotation-progress="1"');
  });

  it.each([24, 30, 60])('normalizes drawing duration at %s FPS and respects controlled progress', (fps) => {
    clock.fps = fps;
    clock.frame = Math.round(4 * fps) - 1;
    expect(render(<CrossedOffText />)).toContain('data-annotation-progress="1"');
    expect(render(<CrossedOffText progress={0} />)).toContain('data-annotation-progress="0"');
    clock.frame = Math.round(fps * 0.5);
    expect(render(<CrossedOffText speed={2} />)).not.toBe(render(<CrossedOffText speed={1} />));
  });

  it('keeps long multiline text inside an expanding reference stage without stretching glyphs', () => {
    const output = render(<TextMarker text={Array(20).fill('长文本换行').join('\n')} markedText="长文本" progress={1} width={360} height={640} />);
    expect(output).toContain('white-space:pre-wrap');
    expect(output).toContain('overflow-wrap:anywhere');
    expect(output).toContain('scale(');
    expect(output).not.toMatch(/NaN|Infinity/);
  });

  it('uses the native cylinder parameters, preserves XML text, and supports reverse/frozen rotation', () => {
    clock.frame = 45;
    const forward = render(<CylinderText text={'A & <B> "quoted"'} width={640} height={360} />);
    expect(forward).toContain('data-rotation="90"');
    expect(forward).toContain('&quot;radius&quot;:151.2');
    expect(forward).toContain('&quot;rotationX&quot;:52');
    expect(forward).toContain('&quot;rotationZ&quot;:-18');
    expect(forward).toContain(encodeURIComponent('&amp;'));
    expect(render(<CylinderText speed={-1 / 6} />)).toContain('data-rotation="-90"');
    expect(render(<CylinderText speed={0} />)).toContain('data-rotation="0"');
    expect(render(<CylinderText progress={0.5} />)).toContain('data-rotation="180"');
  });

  it('matches cylinder rotation on both sides of a six-second forward loop', () => {
    clock.frame = 0;
    const start = render(<CylinderText />);
    clock.frame = 180;
    const end = render(<CylinderText />).replaceAll('360', '0');
    expect(end).toBe(start);
  });

  it('retains all wheel options, decelerates onto the first, and keeps empty arrays empty', () => {
    const output = render(<SpinningTextWheel items={['第一项', '第二项', '第三项']} progress={1} />);
    expect((output.match(/data-wheel-item=/g) ?? []).length).toBe(3);
    expect(output).toContain('opacity:1');
    expect(output).toContain('第一项');
    expect(output).toContain('perspective:10000px');
    expect(render(<SpinningTextWheel items={[]} progress={1} />)).not.toContain('data-wheel-item=');
    expect(render(<SpinningTextWheel progress={0.2} />)).not.toBe(render(<SpinningTextWheel progress={1} />));
  });

  it.each([CircleMarker, CylinderText, SpinningTextWheel])('guards non-finite dimensions and timing: %s', (Component) => {
    expect(render(<Component width={NaN} height={Infinity} speed={NaN} progress={NaN} />)).not.toMatch(/NaN|Infinity/);
  });
});
