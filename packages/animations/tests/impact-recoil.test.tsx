import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {ImpactRecoil} from '../src';

const render = (frame: number, strength = 8) => renderToStaticMarkup(
  <ImpactRecoil frame={frame} strength={strength} durationInFrames={6} samples={[1, -.5, .25]}>
    {offset => <span>{offset}</span>}
  </ImpactRecoil>,
);

describe('ImpactRecoil', () => {
  it('retimes signed samples, returns to rest, and adds no wrapper', () => {
    expect(render(-1)).toBe('<span>0</span>');
    expect(render(0)).toBe('<span>8</span>');
    expect(render(0, -8)).toBe('<span>-8</span>');
    expect(render(1)).toBe('<span>2</span>');
    expect(render(2)).toBe('<span>-4</span>');
    expect(render(5)).toBe('<span>1</span>');
    expect(render(6)).toBe('<span>0</span>');
  });
});
