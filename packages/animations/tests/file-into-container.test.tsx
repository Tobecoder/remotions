import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {FileIntoContainer} from '../src';

const render = (progress: number) => renderToStaticMarkup(
  <FileIntoContainer progress={progress} from={{x:10,y:150,width:100}} to={{x:200,y:200}} liftHeight={120}>
    <span>Reference card</span>
  </FileIntoContainer>,
);

describe('FileIntoContainer', () => {
  it('shrinks toward the opening, drops vertically, and removes the collected content', () => {
    expect(render(0)).toContain('translate(10px,150px) scale(1)');
    expect(render(.57)).toContain('translate(175px,80px) scale(0.5)');
    const [, x, y, scale] = /translate\(([\d.]+)px,([\d.]+)px\) scale\(([\d.]+)\)/.exec(render(.785))!;
    expect(Number(x) + Number(scale) * 50).toBeCloseTo(200);
    expect(Number(y)).toBeCloseTo(140);
    expect(Number(scale)).toBeCloseTo(.2625);
    expect(render(.99)).toContain('Reference card');
    expect(render(1)).toBe('');
  });
});
