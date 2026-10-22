import {describe, expect, it} from 'vitest';
import {getNextCategoryIndex, isPreviewToggleActivation, togglePreview} from './interaction';

describe('catalog interactions', () => {
  it('supports roving category navigation with arrows and Home/End', () => {
    expect(getNextCategoryIndex(0, 5, 'ArrowRight')).toBe(1);
    expect(getNextCategoryIndex(0, 5, 'ArrowLeft')).toBe(4);
    expect(getNextCategoryIndex(2, 5, 'Home')).toBe(0);
    expect(getNextCategoryIndex(2, 5, 'End')).toBe(4);
    expect(getNextCategoryIndex(2, 5, 'Enter')).toBeNull();
  });

  it('treats touch and keyboard activation as preview toggles', () => {
    expect(isPreviewToggleActivation(1, 'touch')).toBe(true);
    expect(isPreviewToggleActivation(0, null)).toBe(true);
    expect(isPreviewToggleActivation(1, 'mouse')).toBe(false);
    expect(togglePreview(true)).toBe(false);
    expect(togglePreview(false)).toBe(true);
  });
});
