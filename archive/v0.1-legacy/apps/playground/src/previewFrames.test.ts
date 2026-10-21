import {describe, expect, it} from 'vitest';
import {previewFrames} from './timing';

describe('preview duration', () => {
  it('accounts for delay and final-frame padding', () => {
    expect(previewFrames('fade', 'Hi', 40, 10)).toBe(68);
  });
  it('extends preview for staggered typography', () => {
    expect(previewFrames('wave', 'Long sentence', 30, 5))
      .toBeGreaterThan(previewFrames('fade', 'Long sentence', 30, 5));
    expect(previewFrames('words', 'One two three', 30, 0)).toBe(58);
  });
  it('sets a useful floor for very short durations', () => {
    expect(previewFrames('fade', '', 1, 0)).toBe(30);
  });
  it('counts emoji and combining accents as the visual units used by WaveText', () => {
    expect(previewFrames('wave', '👩🏽‍💻e\u0301', 30, 5)).toBe(56);
    expect(previewFrames('wave', '', 30, 5)).toBe(53);
  });
  it('ignores surrounding and repeated whitespace in word staggering', () => {
    expect(previewFrames('words', '  One   two  ', 30, 5)).toBe(58);
    expect(previewFrames('words', '   ', 30, 5)).toBe(53);
  });
});
