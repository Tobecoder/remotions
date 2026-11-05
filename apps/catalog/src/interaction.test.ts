import {describe, expect, it} from 'vitest';
import {getNextCategoryIndex} from './interaction';

describe('category navigation', () => {
  it('supports arrows, wrapping and Home/End', () => {
    expect(getNextCategoryIndex(0, 5, 'ArrowRight')).toBe(1);
    expect(getNextCategoryIndex(0, 5, 'ArrowLeft')).toBe(4);
    expect(getNextCategoryIndex(2, 5, 'Home')).toBe(0);
    expect(getNextCategoryIndex(2, 5, 'End')).toBe(4);
    expect(getNextCategoryIndex(2, 5, 'Enter')).toBeNull();
  });
});
