import {describe, expect, it} from 'vitest';
import * as animations from '../src';

describe('animation library reset', () => {
  it('exports none of the removed animation components', () => {
    expect(Object.keys(animations)).toEqual([]);
  });
});
