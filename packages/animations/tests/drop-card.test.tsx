import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {DropCard} from '../src';

const render = (frame: number, tilt = -8.5) => renderToStaticMarkup(
  <DropCard frame={frame} x={20} y={160} width={120} height={100} durationInFrames={28} tilt={tilt}>
    Tool
  </DropCard>,
);

describe('DropCard', () => {
  it('delays visibility until the first drop frame and interpolates a retimed rebound', () => {
    expect(render(-1)).toBe('');
    expect(render(0)).toContain('top:9px');
    expect(render(0)).toContain('rotate(-8.5deg)');
    expect(render(0, 8.5)).toContain('rotate(8.5deg)');
    expect(render(1)).toContain('top:29.5px');
    expect(render(18)).toContain('top:171px');
    expect(render(28)).toContain('top:160px');
    expect(render(28)).toContain('rotate(0deg)');
    expect(render(100)).toBe(render(28));
  });
});
