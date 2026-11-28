import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {TextFlip} from '../src';

const render = (frame: number) => renderToStaticMarkup(
  <TextFlip frame={frame} before="Practice" after={<strong>Timestamp</strong>} beforeScale={1.1}
    beforeStyle={{color:'red'}} afterStyle={{color:'green'}}/>,
);

describe('TextFlip', () => {
  it('closes the old content, switches to the replacement at zero, and fully opens it', () => {
    expect(render(-3)).toContain('scale(1.1,1.1)');
    expect(render(-1)).toMatch(/scale\(1\.1,0\.077[^)]*\)/);
    expect(render(-1)).toContain('color:red');
    expect(render(0)).toContain('scaleY(0.28)');
    expect(render(0)).toContain('color:green');
    expect(render(0)).toContain('<strong>Timestamp</strong>');
    expect(render(2)).toContain('scaleY(1)');
  });
});
