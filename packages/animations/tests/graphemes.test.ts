import {describe, expect, it} from 'vitest';
import {splitGraphemes} from '../src/internal/graphemes';

describe('grapheme segmentation', () => {
  it('handles combining accents without separating the glyph', () => {
    expect(splitGraphemes('e\u0301')).toEqual(['e\u0301']);
  });

  it('keeps joined emoji and skin-tone sequences intact', () => {
    expect(splitGraphemes('👩🏽‍💻!')).toEqual(['👩🏽‍💻', '!']);
  });

  it('preserves whitespace and returns no tokens for empty text', () => {
    expect(splitGraphemes('')).toEqual([]);
    expect(splitGraphemes('A B')).toEqual(['A', ' ', 'B']);
  });
});
