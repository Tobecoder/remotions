import {describe, expect, it, vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';

let frame = 120;
vi.mock('remotion', async () => {
  const React = await import('react');
  return {
    useCurrentFrame: () => frame,
    useVideoConfig: () => ({width: 1280, height: 720, fps: 30}),
    AbsoluteFill: (props: Record<string, unknown>) => React.createElement('div', props),
    Img: (props: Record<string, unknown>) => React.createElement('img', props),
  };
});

import {ScreenshotFocusDraft} from '../src/drafts/ScreenshotFocusDraft';
import {validateWindowInput, windowFocusState} from '../src/drafts/windowFocus';
const focus = {x: 0.06, y: 0.46, width: 0.86, height: 0.13};

describe('screenshot focus draft', () => {
  it('preserves the screenshot ratio and keeps the full window inside the frame', () => {
    for (const [w, h] of [[1280, 720], [1920, 1080], [1080, 1920]]) {
      for (let f = 0; f <= 300; f += 3) {
        const p = windowFocusState(f, 30, w, h, 1440, 760, focus);
        expect(p.width / p.height).toBeCloseTo(1440 / 760);
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.x + p.width).toBeLessThanOrEqual(w);
        expect(p.y + p.height).toBeLessThanOrEqual(h);
      }
    }
  });
  it('holds its end state and is independent of seek order and FPS', () => {
    const pose = (f: number, fps = 30) => windowFocusState(f, fps, 1280, 720, 1440, 760, focus);
    const end = pose(150);
    pose(0);
    expect(pose(150)).toEqual(end);
    expect(pose(3000)).toEqual(end);
    expect(pose(300, 60)).toEqual(end);
    expect(pose(0).mark).toBe(0);
    expect(pose(70).zoom).toBe(0);
    expect(end.zoom).toBe(1);
  });
  it('accepts replacement images without changing the material structure', () => {
    frame = 120;
    const render = (src: string) => renderToStaticMarkup(<ScreenshotFocusDraft src={src} imageWidth={1440} imageHeight={760} focus={focus}/>);
    expect(render('document.png')).toContain('document.png');
    expect(render('code.png')).toContain('code.png');
    expect(render('code.png')).toContain('data-window-highlight');
  });
  it('rejects out-of-image focus rectangles and invalid screenshot dimensions', () => {
    expect(() => validateWindowInput(0, 760, focus)).toThrow();
    expect(() => validateWindowInput(1440, 760, {...focus, x: 0.8})).toThrow();
  });
});
